import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private prisma;
    private notificationsService;
    server: Server;
    private activeUsers;
    private activeInquiries;
    constructor(jwtService: JwtService, prisma: PrismaService, notificationsService: NotificationsService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinInquiry(client: Socket, inquiryId: string): {
        event: string;
        inquiryId: string;
    };
    handleChatActive(client: Socket, payload: {
        inquiryId: string;
    }): void;
    handleChatInactive(client: Socket, payload: {
        inquiryId: string;
    }): void;
    isUserActiveInChat(userId: string, inquiryId: string): boolean;
    handleSendMessage(client: Socket, payload: {
        inquiryId: string;
        content: string;
    }): Promise<{
        sender: {
            name: string | null;
            id: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        isRead: boolean;
        inquiryId: string;
        senderId: string;
    }>;
}
