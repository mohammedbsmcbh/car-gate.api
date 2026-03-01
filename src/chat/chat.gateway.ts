import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers = new Map<string, Set<string>>(); // userId -> Set<socketId>
  private activeInquiries = new Map<string, string>(); // socketId -> inquiryId

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      // Store user ID in socket
      // Handle logic for Sub-Admins who are not in the User table directly
      // but act on behalf of the Agency/Showroom User.
      let finalUserId = payload.sub;
      
      // 1. Check if it's a regular user
      const user = await this.prisma.user.findUnique({
          where: { id: payload.sub },
          select: { id: true, role: true }
      });

      if (user) {
          finalUserId = user.id;
      } else {
          // 2. Check Agency Sub-Admin
          const agencySub = await this.prisma.agencySubAdmin.findUnique({
              where: { id: payload.sub },
              include: { agency: true }
          });
          
          if (agencySub) {
              finalUserId = agencySub.agency.userId;
          } else {
              // 3. Check Showroom Sub-Admin
              const showroomSub = await this.prisma.showroomSubAdmin.findUnique({
                  where: { id: payload.sub },
                  include: { showroom: true }
              });
              
              if (showroomSub) {
                  finalUserId = showroomSub.showroom.userId;
              }
          }
      }

      client.data.userId = finalUserId;
      
      // Update Presence Maps
      if (!this.activeUsers.has(finalUserId)) {
          this.activeUsers.set(finalUserId, new Set());
      }
      this.activeUsers.get(finalUserId)!.add(client.id);

      // Join a room specific to this user for private notifications
      client.join(`user_${finalUserId}`);
      
      console.log(`Client connected: ${client.id}, Sub: ${payload.sub}, RealUser: ${finalUserId}`);
    } catch (error) {
      console.error('Connection error:', error.message);
      client.disconnect();
    }
  }


  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
        if (this.activeUsers.has(userId)) {
            const sockets = this.activeUsers.get(userId);
            if (sockets) {
                sockets.delete(client.id);
                if (sockets.size === 0) {
                    this.activeUsers.delete(userId);
                }
            }
        }
    }
    this.activeInquiries.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinInquiry')
  handleJoinInquiry(
    @ConnectedSocket() client: Socket,
    @MessageBody() inquiryId: string,
  ) {
    // Verify user is part of this inquiry
    // For now, just join the room
    client.join(`inquiry_${inquiryId}`);

    // Update presence
    this.activeInquiries.set(client.id, inquiryId);
    console.log(`User ${client.data.userId} joined inquiry ${inquiryId}`);

    return { event: 'joined', inquiryId };
  }

  @SubscribeMessage('chat:active')
  handleChatActive(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { inquiryId: string },
  ) {
    client.data.activeInquiryId = payload.inquiryId;
     // Update presence map as well for robustness
    this.activeInquiries.set(client.id, payload.inquiryId);
    
    // Also join the room if not already joined
    client.join(`inquiry_${payload.inquiryId}`);
    
    console.log(`User ${client.data.userId} active in chat ${payload.inquiryId}`);
  }

  @SubscribeMessage('chat:inactive')
  handleChatInactive(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { inquiryId: string },
  ) {
    if (client.data.activeInquiryId === payload.inquiryId) {
        delete client.data.activeInquiryId;
    }
    // Remove from map if it matches
    if (this.activeInquiries.get(client.id) === payload.inquiryId) {
        this.activeInquiries.delete(client.id);
    }
    console.log(`User ${client.data.userId} inactive in chat ${payload.inquiryId}`);
  }


  public isUserActiveInChat(userId: string, inquiryId: string): boolean {
    if (!this.activeUsers.has(userId)) return false;
    
    // Check if any of the user's sockets are active in this inquiry
    const socketIds = this.activeUsers.get(userId);
    if (!socketIds) return false;

    for (const socketId of socketIds) {
        if (this.activeInquiries.get(socketId) === inquiryId) {
            return true;
        }
    }
    return false;
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { inquiryId: string; content: string },
  ) {
    const userId = client.data.userId;
    
    // Save message to DB
    const message = await this.prisma.inquiryMessage.create({
      data: {
        inquiryId: payload.inquiryId,
        senderId: userId,
        content: payload.content,
      },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    // Broadcast to room
    this.server.to(`inquiry_${payload.inquiryId}`).emit('newMessage', message);

    // Notify receiver (if not in room)
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id: payload.inquiryId },
    });
    
    if (inquiry) {
      const receiverId = inquiry.senderId === userId ? inquiry.receiverId : inquiry.senderId;
      
      // Use NotificationsService for Push + Socket notification
      await this.notificationsService.notifyUser(
        receiverId,
        'CHAT_NEW_MESSAGE',
        { 
          senderName: message.sender.name || 'User',
          inquiryId: payload.inquiryId 
        },
        { type: 'CHAT' }
      );
    }

    return message;
  }
}
