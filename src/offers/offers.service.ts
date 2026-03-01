import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferStatusDto } from './dto/update-offer.dto';
import { OfferStatus } from '@prisma/client';

@Injectable()
export class OffersService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: string, createOfferDto: CreateOfferDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: createOfferDto.listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.ownerId === userId) {
      throw new ForbiddenException('You cannot make an offer on your own listing');
    }

    const offer = await this.prisma.offer.create({
      data: {
        amount: createOfferDto.amount,
        message: createOfferDto.message,
        status: OfferStatus.PENDING,
        userId,
        listingId: createOfferDto.listingId,
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            media: true,
            currency: true,
          },
        },
      },
    });

    // Notify the listing owner
    await this.notificationsService.notifyUser(
      listing.ownerId,
      'OFFER_RECEIVED',
      {
        amount: `${offer.listing.currency} ${offer.amount.toLocaleString()}`,
        listingTitle: offer.listing.title,
        offerId: offer.id,
      },
      { type: 'SYSTEM' },
    );

    return offer;
  }

  async findAllByUser(userId: string) {
    return this.prisma.offer.findMany({
      where: { userId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            media: true,
            currency: true,
            ownerId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllReceived(userId: string) {
    // Find listings owned by the user
    const listings = await this.prisma.listing.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });

    const listingIds = listings.map((l) => l.id);

    return this.prisma.offer.findMany({
      where: {
        listingId: { in: listingIds },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            media: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
      include: {
        listing: true,
        user: true,
      },
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return offer;
  }

  async updateStatus(id: string, userId: string, updateOfferStatusDto: UpdateOfferStatusDto) {
    const offer = await this.findOne(id);

    // Check if the user is the owner of the listing
    if (offer.listing.ownerId !== userId) {
      throw new ForbiddenException('You are not authorized to update this offer');
    }

    const updatedOffer = await this.prisma.offer.update({
      where: { id },
      data: { status: updateOfferStatusDto.status },
    });

    if (updateOfferStatusDto.status === OfferStatus.ACCEPTED) {
      await this.notificationsService.notifyUser(
        offer.userId,
        'OFFER_ACCEPTED',
        {
          listingTitle: offer.listing.title,
          offerId: offer.id,
        },
        { type: 'SYSTEM' },
      );
    } else if (updateOfferStatusDto.status === OfferStatus.REJECTED) {
      await this.notificationsService.notifyUser(
        offer.userId,
        'OFFER_REJECTED',
        {
          listingTitle: offer.listing.title,
          offerId: offer.id,
        },
        { type: 'SYSTEM' },
      );
    }

    return updatedOffer;
  }
}
// Force update
