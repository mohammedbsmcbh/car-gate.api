import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { UpdateListingStatusDto } from './dto/update-listing-status.dto';
import { ListingFilterDto } from './dto/listing.dto';
import { UserRole, ListingStatus, Prisma, OfferStatus } from '@prisma/client';
import { PaginatedResponse } from '../common/dto/pagination.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ListingsService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
        private mailService: MailService,
    ) { }

    async create(userId: string, createListingDto: CreateListingDto) {
        // Determine user role and corresponding agency/showroom entity
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { agency: true, showroom: true },
        });

        if (!user) throw new NotFoundException('User not found');

        const { images, ...listingData } = createListingDto;

        const mediaData = images?.length
            ? images.map((url, index) => ({
                url,
                type: 'image',
                order: index,
                isPrimary: index === 0,
            }))
            : undefined;

        const basicData: Prisma.ListingUncheckedCreateInput = {
            ...listingData,
            ownerId: userId,
            status: ListingStatus.PENDING,
            media: mediaData ? { create: mediaData } : undefined,
        };

        if (user.role === UserRole.AGENCY && user.agency) {
            return this.prisma.listing.create({
                data: {
                    ...basicData,
                    agencyId: user.agency.id,
                }
            });
        } else if (user.role === UserRole.SHOWROOM && user.showroom) {
            return this.prisma.listing.create({
                data: {
                    ...basicData,
                    showroomId: user.showroom.id,
                }
            });
        }

        return this.prisma.listing.create({
            data: basicData,
        });
    }

    async findAllPublic(filters: ListingFilterDto = {}): Promise<PaginatedResponse<any>> {
        const { page = 1, limit = 20, category, type, condition, search, make, model, priceMin, priceMax, yearMin, yearMax, sortBy, ownerRole, minFeaturedPriority, maxFeaturedPriority, isFeatured, ownerId, agencyId, showroomId } = filters;
        let skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.ListingWhereInput = {
            status: ListingStatus.APPROVED,
        };

        if (condition) {
            if (condition.toUpperCase() === 'NEW') {
                where.AND = [
                    {
                        OR: [
                            { condition: { equals: 'NEW', mode: 'insensitive' } },
                            { condition: null }
                        ]
                    }
                ];
            } else {
                where.condition = { equals: condition, mode: 'insensitive' };
            }
        }

        if (minFeaturedPriority !== undefined || maxFeaturedPriority !== undefined) {
             const filter: Prisma.IntFilter = (where.featuredPriority as Prisma.IntFilter) || {};
             if (minFeaturedPriority !== undefined) filter.gte = minFeaturedPriority;
             if (maxFeaturedPriority !== undefined) filter.lte = maxFeaturedPriority;
             where.featuredPriority = filter;
        }

        if (isFeatured !== undefined) {
             where.isFeatured = isFeatured;
        }

        // Filter by category (bodyType)
        if (category) {
            where.bodyType = { equals: category, mode: 'insensitive' };
        }

        // Filter by type
        if (type) {
            where.type = type as any;
        }

        if (ownerId) {
            where.ownerId = ownerId;
        }

        if (agencyId) {
            where.agencyId = agencyId;
        }

        if (showroomId) {
            where.showroomId = showroomId;
        }

        // Filter by owner role (e.g., only agency listings)
        if (ownerRole) {
            const normalizedRole = ownerRole.toString().toUpperCase();
            if (normalizedRole === 'MARKET') {
                // MARKET = INDIVIDUAL or TRADER, only regular cars (no special bodyTypes)
                where.owner = { role: { in: [UserRole.INDIVIDUAL, UserRole.TRADER] } } as any;
                where.type = 'CAR' as any;
                // Exclude special categories - bodyType must be null OR not one of the special values
                where.AND = [
                    ...(where.AND as any[] || []),
                    {
                        OR: [
                            { bodyType: null },
                            { bodyType: { notIn: ['Luxury', 'Classic', 'Other', 'Heavy', 'luxury', 'classic', 'other', 'heavy'] } }
                        ]
                    }
                ];
            } else if (normalizedRole in UserRole) {
                const roleEnum = UserRole[normalizedRole as keyof typeof UserRole];
                where.owner = { role: roleEnum } as any;
            }
        }

        // Search in title and description
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { make: { contains: search, mode: 'insensitive' } },
                { model: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Filter by make
        if (make) {
            where.make = { equals: make, mode: 'insensitive' };
        }

        // Filter by model
        if (model) {
            where.model = { equals: model, mode: 'insensitive' };
        }

        // Price range
        if (priceMin || priceMax) {
            where.price = {};
            if (priceMin) where.price.gte = priceMin;
            if (priceMax) where.price.lte = priceMax;
        }

        // Year range
        if (yearMin || yearMax) {
            where.year = {};
            if (yearMin) where.year.gte = yearMin;
            if (yearMax) where.year.lte = yearMax;
        }

        let orderBy: any = { createdAt: 'desc' };
        
        // Handle Random Sort
        if (sortBy === 'random') {
            // If random is requested, we try to randomize the skip if no complex filters are applied
            // or just use a raw query for IDs.
            // For simplicity and performance with filters, we will fetch a larger set and shuffle in memory.
            // But if we want "different results on each request", we can use a random skip.
            
            const count = await this.prisma.listing.count({ where });
            if (count > limit) {
                // Generate a random skip
                const maxSkip = count - limit;
                skip = Math.floor(Math.random() * (maxSkip + 1));
            }
            // We disable orderBy for random to avoid sorting overhead before skip
            orderBy = undefined; 
        }

        const [data, total] = await Promise.all([
            this.prisma.listing.findMany({
                where,
                include: {
                    agency: {
                        select: {
                            id: true,
                            name: true,
                            logo: true,
                        },
                    },
                    showroom: {
                        select: {
                            id: true,
                            name: true,
                            logo: true,
                        },
                    },
                    media: true,
                },
                skip,
                take: limit,
                orderBy,
            }),
            this.prisma.listing.count({ where }),
        ]);

        if (sortBy === 'random') {
            // Shuffle the page results to ensure they look random
            for (let i = data.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [data[i], data[j]] = [data[j], data[i]];
            }
        }

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async incrementViewCount(id: string, ip: string, userId?: string) {
        // Check if viewed recently (e.g., last 1 hour)
        const recentView = await this.prisma.listingView.findFirst({
            where: {
                listingId: id,
                OR: [
                    { ip: ip },
                    userId ? { userId: userId } : {},
                ],
                createdAt: {
                    gt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour
                },
            },
        });

        if (recentView) {
            // Already counted, just return current count
            const listing = await this.prisma.listing.findUnique({
                where: { id },
                select: { viewCount: true },
            });
            return listing;
        }

        // Record view
        await this.prisma.listingView.create({
            data: {
                listingId: id,
                ip,
                userId,
            },
        });

        // Increment count
        return this.prisma.listing.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
    }

    async toggleLike(userId: string, listingId: string) {
        const existingLike = await this.prisma.like.findUnique({
            where: {
                userId_listingId: {
                    userId,
                    listingId,
                },
            },
        });

        if (existingLike) {
            // Unlike
            const [_, listing] = await this.prisma.$transaction([
                this.prisma.like.delete({
                    where: { id: existingLike.id },
                }),
                this.prisma.listing.update({
                    where: { id: listingId },
                    data: { likesCount: { decrement: 1 } },
                }),
            ]);
            return { liked: false, likesCount: listing.likesCount };
        } else {
            // Like
            const [_, listing] = await this.prisma.$transaction([
                this.prisma.like.create({
                    data: {
                        userId,
                        listingId,
                    },
                }),
                this.prisma.listing.update({
                    where: { id: listingId },
                    data: { likesCount: { increment: 1 } },
                }),
            ]);
            return { liked: true, likesCount: listing.likesCount };
        }
    }

    async createOffer(userId: string, listingId: string, amount: number, message?: string) {
        if (amount <= 0) {
            throw new BadRequestException('Offer amount must be greater than 0');
        }

        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        if (listing.ownerId === userId) {
            throw new ForbiddenException('You cannot make an offer on your own listing');
        }

        const offer = await this.prisma.offer.create({
            data: {
                amount,
                message,
                userId,
                listingId,
                status: OfferStatus.PENDING,
            },
        });

        // TODO: Notify car owner (placeholder)
        console.log(`Notification: New offer of ${amount} for listing ${listingId} by user ${userId}`);

        return offer;
    }

    async findMyListings(userId: string, page = 1, limit = 20): Promise<PaginatedResponse<any>> {
        const skip = (page - 1) * limit;

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { agency: true, showroom: true },
        });

        if (!user) throw new NotFoundException('User not found');

        const whereClause: Prisma.ListingWhereInput = {
            OR: [
                { ownerId: userId }, // Always include listings owned directly by user
            ]
        };

        if (user.agency) {
            (whereClause.OR as any[]).push({ agencyId: user.agency.id });
        }

        if (user.showroom) {
            (whereClause.OR as any[]).push({ showroomId: user.showroom.id });
        }

        const [data, total] = await Promise.all([
            this.prisma.listing.findMany({
                where: whereClause,
                include: {
                    media: true,
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.listing.count({
                where: whereClause,
            }),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findAllAdmin(page = 1, limit = 20): Promise<PaginatedResponse<any>> {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.listing.findMany({
                include: {
                    agency: {
                        select: { name: true },
                    },
                    showroom: {
                        select: { name: true },
                    },
                    owner: {
                        select: { name: true, email: true, role: true }
                    },
                    media: {
                        orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
                        take: 3,
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.listing.count(),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string, userId?: string) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                agency: true,
                showroom: true,
                media: true,
                owner: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        phone: true,
                        whatsapp: true,
                        role: true,
                    },
                },
            },
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        let isLiked = false;
        if (userId) {
            const like = await this.prisma.like.findUnique({
                where: {
                    userId_listingId: {
                        userId,
                        listingId: id,
                    },
                },
            });
            isLiked = !!like;
        }

        return { ...listing, isLiked };
    }

    async update(userId: string, listingId: string, updateListingDto: UpdateListingDto) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        if (listing.ownerId !== userId) {
            throw new ForbiddenException('You can only update your own listings');
        }

        const { images, ...data } = updateListingDto;

        // If images are provided, we should probably handle them. 
        // For now, let's just update the fields. Handling images deletion/reordering via update listing is complex.
        // Usually, images are handled via separate upload endpoints or we replace all images here.
        // Given the DTO accepts images: string[], let's assume we might receive new image URLs (but the form uploads them first to get URL).
        // If the 'images' field is meant to replace the media relations, we would delete existing and create new.
        // However, the `create` method creates Media entries.
        // Let's defer image update logic to be consistent with `create`.

        // If images are provided in the update, we'll replace the existing ones.
        if (images) {
             await this.prisma.media.deleteMany({
                 where: { listingId },
             });
             
             if (images.length > 0) {
                 await this.prisma.media.createMany({
                     data: images.map((url, index) => ({
                         listingId,
                         url,
                         type: 'image',
                         order: index,
                     })),
                 });
             }
        }

        return this.prisma.listing.update({
            where: { id: listingId },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
    }

    async updateStatus(id: string, dto: UpdateListingStatusDto) {
        const status = dto.status === 'APPROVED' ? ListingStatus.APPROVED : ListingStatus.REJECTED;

        // Fetch listing WITH owner info before update (for email)
        const listingWithOwner = await this.prisma.listing.findUnique({
            where: { id },
            include: { owner: { select: { email: true, name: true } } },
        });

        const listing = await this.prisma.listing.update({
            where: { id },
            data: { status: status },
        });

        if (status === ListingStatus.APPROVED) {
             await this.notificationsService.notifyUser(
                 listing.ownerId, 
                 'LISTING_APPROVED', 
                 { listingTitle: listing.title },
                 { type: 'SYSTEM' }
             );
             // Send email notification
             if (listingWithOwner?.owner?.email) {
                 this.mailService.sendListingApprovedEmail(
                     listingWithOwner.owner.email,
                     listingWithOwner.owner.name || '',
                     listing.title || '',
                     listing.id,
                 ).catch(() => null);
             }
        } else if (status === ListingStatus.REJECTED) {
             await this.notificationsService.notifyUser(
                 listing.ownerId, 
                 'LISTING_REJECTED', 
                 { listingTitle: listing.title },
                 { type: 'SYSTEM' }
             );
             // Send email notification
             if (listingWithOwner?.owner?.email) {
                 this.mailService.sendListingRejectedEmail(
                     listingWithOwner.owner.email,
                     listingWithOwner.owner.name || '',
                     listing.title || '',
                 ).catch(() => null);
             }
        }

        return listing;
    }

    async findLiked(userId: string, page = 1, limit = 20): Promise<PaginatedResponse<any>> {
        const skip = (page - 1) * limit;

        const [likes, total] = await Promise.all([
            this.prisma.like.findMany({
                where: { userId },
                include: {
                    listing: {
                        include: {
                            agency: true,
                            showroom: true,
                            media: true,
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.like.count({ where: { userId } }),
        ]);

        const data = likes.map(like => ({
            ...like.listing,
            isLiked: true,
        }));

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async remove(userId: string, userRole: string, id: string) {
        const listing = await this.findOne(id);

        if (userRole !== UserRole.SUPER_ADMIN && listing.ownerId !== userId) {
            throw new ForbiddenException('You can only delete your own listings');
        }

        return this.prisma.listing.delete({
            where: { id },
        });
    }
}
