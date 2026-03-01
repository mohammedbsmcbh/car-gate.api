import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadMediaDto, UpdateMediaDto, ImagePosition } from './dto';
import { UserRole } from '@prisma/client';
import { configureCloudinary, cloudinary } from './cloudinary.config';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

const unlink = util.promisify(fs.unlink);

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {
    // Initialize Cloudinary
    configureCloudinary();
  }

  // Upload image to Cloudinary from base64 or data URL
  async uploadToCloudinary(
    base64Data: string,
    listingId: string,
    userId: string,
    userRole: UserRole,
    position?: ImagePosition,
  ) {
    // Check if listing exists and user owns it
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { media: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Only owner or admin can add media
    if (userRole !== UserRole.SUPER_ADMIN && listing.ownerId !== userId) {
      throw new ForbiddenException('Cannot add media to this listing');
    }

    // Check media limit (max 3 images for product photos)
    const imageCount = listing.media.filter((m) => m.type === 'image').length;
    if (imageCount >= 3) {
      throw new BadRequestException('Maximum 3 images allowed per listing');
    }

    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64Data, {
        folder: `car-gate/listings/${listingId}`,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      });

      // Create media record in database
      const media = await this.prisma.media.create({
        data: {
          listingId,
          url: result.secure_url,
          type: 'image',
          isPrimary: imageCount === 0, // First image is primary
          order: imageCount,
        },
      });

      return {
        ...media,
        cloudinaryId: result.public_id,
        position: position || ImagePosition.OTHER,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new BadRequestException('Failed to upload image to Cloudinary');
    }
  }

  // Upload story media to Cloudinary
  async uploadStoryMedia(base64Data: string, userId: string): Promise<{ url: string; publicId: string }> {
    try {
      const result = await cloudinary.uploader.upload(base64Data, {
        folder: `car-gate/stories/${userId}`,
        resource_type: 'auto', // Allow image or video if base64 supports it
        transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' },
        ],
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error('Cloudinary story upload error:', error);
      throw new BadRequestException('Failed to upload story media');
    }
  }

  async uploadStoryVideoFromBuffer(file: Express.Multer.File, userId: string): Promise<{ url: string; publicId: string }> {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder: `car-gate/stories/${userId}`,
          },
          (error, uploadResult) => {
            if (error) return reject(error);
            return resolve(uploadResult);
          },
        );
        Readable.from(file.buffer).pipe(uploadStream);
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error('Cloudinary story video upload error:', error);
      throw new BadRequestException('Failed to upload story video');
    }
  }

  // Upload profile/cover image to Cloudinary (independent of listings)
  async uploadProfileImage(base64Data: string, userId: string): Promise<{ url: string; publicId: string }> {
    try {
      const result = await cloudinary.uploader.upload(base64Data, {
        folder: `car-gate/profiles/${userId}`,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' }, 
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error('Cloudinary profile upload error:', error);
      throw new BadRequestException('Failed to upload profile image');
    }
  }

  // Delete image from Cloudinary
  async deleteFromCloudinary(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
    }
  }

  // Generate signed upload URL for direct uploads from client
  getUploadSignature(folder?: string) {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const uploadFolder = folder || 'car-gate/listings';
    
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: uploadFolder,
      },
      process.env.CLOUDINARY_API_SECRET!,
    );

    return {
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: uploadFolder,
    };
  }

  async upload(dto: UploadMediaDto, userId: string, userRole: UserRole) {
    // Check if listing exists and user owns it
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
      include: { media: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Only owner or admin can add media
    if (userRole !== UserRole.SUPER_ADMIN && listing.ownerId !== userId) {
      throw new ForbiddenException('Cannot add media to this listing');
    }

    // Check media limit (e.g., max 10 images)
    const imageCount = listing.media.filter((m) => m.type === 'image').length;
    const videoCount = listing.media.filter((m) => m.type === 'video').length;

    if (dto.type === 'image' && imageCount >= 10) {
      throw new BadRequestException('Maximum 10 images allowed per listing');
    }

    if (dto.type === 'video' && videoCount >= 3) {
      throw new BadRequestException('Maximum 3 videos allowed per listing');
    }

    // If this is set as primary, unset other primary media
    if (dto.isPrimary) {
      await this.prisma.media.updateMany({
        where: { listingId: dto.listingId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    // Create media
    const media = await this.prisma.media.create({
      data: {
        listingId: dto.listingId,
        url: dto.url,
        type: dto.type,
        isPrimary: dto.isPrimary || false,
        order: dto.order || 0,
      },
    });

    return media;
  }

  async findByListing(listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return this.prisma.media.findMany({
      where: { listingId },
      orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async uploadVideoToCloudinary(
    file: Express.Multer.File,
    listingId: string,
    userId: string,
    userRole: UserRole,
  ) {
    if (!listingId) {
      throw new BadRequestException('listingId is required');
    }

    if (!file?.path) {
      throw new BadRequestException('Video file is required');
    }

    // Check if listing exists and user owns it
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { media: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Only owner or admin can add media
    if (userRole !== UserRole.SUPER_ADMIN && listing.ownerId !== userId) {
      throw new ForbiddenException('Cannot add media to this listing');
    }

    const videoCount = listing.media.filter((m) => m.type === 'video').length;
    if (videoCount >= 3) {
      throw new BadRequestException('Maximum 3 videos allowed per listing');
    }

    const folder = `car-gate/listings/${listingId}`;
    let result;

    try {
      const absolutePath = path.resolve(file.path);
      console.log(`Starting upload_large for: ${absolutePath}`);
      
      // Use upload_large for chunked uploading which handles files > 100MB
      result = await cloudinary.uploader.upload_large(absolutePath, {
        resource_type: 'video',
        folder,
        chunk_size: 6000000, // 6MB chunks
        timeout: 600000, // 10 minutes timeout
      });
    } catch (error: any) {
      console.error('Cloudinary video upload error:', JSON.stringify(error, null, 2));
      
      const cloudinaryMessage =
        error?.message || 
        error?.error?.message || 
        error?.response?.data?.error?.message ||
        (typeof error === 'string' ? error : 'Unknown error');
        
      const httpCode = error?.http_code || error?.status || error?.response?.status;
      const details = [cloudinaryMessage, httpCode ? `code=${httpCode}` : null]
        .filter(Boolean)
        .join(' ');

      throw new BadRequestException(
        `Cloudinary upload failed: ${details}`
      );
    } finally {
      // Clean up temp file
      if (file.path) {
        try {
          await unlink(file.path);
        } catch (e) {
          console.error('Failed to delete temp file:', file.path);
        }
      }
    }

    if (!result?.secure_url) {
      throw new BadRequestException('Failed to upload video to Cloudinary');
    }

    // Create Media row
    return this.prisma.media.create({
      data: {
        listingId,
        url: result.secure_url,
        type: 'video',
        isPrimary: false,
        order: 999,
      },
    });
  }
  async update(mediaId: string, dto: UpdateMediaDto, userId: string, userRole: UserRole) {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
      include: { listing: true },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    // Check ownership
    if (userRole !== UserRole.SUPER_ADMIN && media.listing.ownerId !== userId) {
      throw new ForbiddenException('Cannot update this media');
    }

    // If setting as primary, unset other primary media
    if (dto.isPrimary) {
      await this.prisma.media.updateMany({
        where: { listingId: media.listingId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    return this.prisma.media.update({
      where: { id: mediaId },
      data: dto,
    });
  }

  async remove(mediaId: string, userId: string, userRole: UserRole) {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
      include: { listing: true },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    // Check ownership
    if (userRole !== UserRole.SUPER_ADMIN && media.listing.ownerId !== userId) {
      throw new ForbiddenException('Cannot delete this media');
    }

    await this.prisma.media.delete({
      where: { id: mediaId },
    });

    return { message: 'Media deleted successfully' };
  }

  async setPrimary(mediaId: string, userId: string, userRole: UserRole) {
    const media = await this.prisma.media.findUnique({
      where: { id: mediaId },
      include: { listing: true },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    // Check ownership
    if (userRole !== UserRole.SUPER_ADMIN && media.listing.ownerId !== userId) {
      throw new ForbiddenException('Cannot update this media');
    }

    // Unset current primary
    await this.prisma.media.updateMany({
      where: { listingId: media.listingId, isPrimary: true },
      data: { isPrimary: false },
    });

    // Set new primary
    return this.prisma.media.update({
      where: { id: mediaId },
      data: { isPrimary: true },
    });
  }
}
