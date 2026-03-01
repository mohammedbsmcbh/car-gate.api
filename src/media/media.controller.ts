import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { UploadMediaDto, UpdateMediaDto, CloudinarySignatureDto, ImagePosition } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

interface CloudinaryUploadBody {
  image: string; // base64 or data URL
  listingId: string;
  position?: ImagePosition;
}

interface ProfileImageUploadBody {
  image: string; // base64 or data URL
}

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private mediaService: MediaService) {}

  // Upload image to Cloudinary
  @Post('cloudinary/upload')
  async uploadToCloudinary(
    @Body() body: CloudinaryUploadBody,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    console.log('Cloudinary upload request received');
    console.log('Listing ID:', body.listingId);
    console.log('User ID:', userId);
    console.log('User Role:', userRole);
    console.log('Image data length:', body.image?.length || 0);
    console.log('Position:', body.position);
    
    const result = await this.mediaService.uploadToCloudinary(
      body.image,
      body.listingId,
      userId,
      userRole,
      body.position,
    );
    
    console.log('Upload successful:', result);
    return result;
  }

  // Upload story media to Cloudinary
  @Post('cloudinary/upload-story')
  async uploadStoryMedia(
    @Body() body: ProfileImageUploadBody,
    @CurrentUser('id') userId: string,
  ) {
    if (!body.image) {
      throw new Error('Image data is required');
    }
    return this.mediaService.uploadStoryMedia(body.image, userId);
  }

  // Upload story video to Cloudinary (multipart)
  @Post('cloudinary/upload-story-video')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
      fileFilter: (_req, file, cb) => {
        const mimetype = file?.mimetype;
        const original = (file?.originalname || '').toLowerCase();
        const looksLikeVideo =
          (typeof mimetype === 'string' && mimetype.startsWith('video/')) ||
          mimetype === 'application/octet-stream' ||
          original.endsWith('.mp4') ||
          original.endsWith('.mov') ||
          original.endsWith('.m4v') ||
          original.endsWith('.3gp') ||
          original.endsWith('.mkv') ||
          original.endsWith('.webm');

        if (!looksLikeVideo) {
          return cb(new Error('Only video files are allowed'), false);
        }
        return cb(null, true);
      },
    }),
  )
  async uploadStoryVideo(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') userId: string,
  ) {
    if (!file) {
      throw new Error('Video file is required');
    }
    return this.mediaService.uploadStoryVideoFromBuffer(file, userId);
  }

  // Upload profile image to Cloudinary
  @Post('cloudinary/upload-profile')
  async uploadProfileImage(
    @Body() body: ProfileImageUploadBody,
    @CurrentUser('id') userId: string,
  ) {
    if (!body.image) {
      throw new Error('Image data is required');
    }
    return this.mediaService.uploadProfileImage(body.image, userId);
  }

  // Upload video to Cloudinary (multipart) and persist Media record
  @Post('cloudinary/upload-video')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './temp',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
      fileFilter: (_req, file, cb) => {
        const mimetype = file?.mimetype;
        const original = (file?.originalname || '').toLowerCase();
        const looksLikeVideo =
          (typeof mimetype === 'string' && mimetype.startsWith('video/')) ||
          mimetype === 'application/octet-stream' ||
          original.endsWith('.mp4') ||
          original.endsWith('.mov') ||
          original.endsWith('.m4v') ||
          original.endsWith('.3gp') ||
          original.endsWith('.mkv') ||
          original.endsWith('.webm');

        if (!looksLikeVideo) {
          return cb(new Error('Only video files are allowed'), false);
        }
        return cb(null, true);
      },
    }),
  )
  async uploadVideoToCloudinary(
    @UploadedFile() file: Express.Multer.File,
    @Body('listingId') listingId: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    console.log('Cloudinary video upload request received');
    console.log('Listing ID:', listingId);
    console.log('User ID:', userId);
    console.log('User Role:', userRole);
    console.log('File received:', {
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
      path: file?.path,
    });

    return this.mediaService.uploadVideoToCloudinary(file, listingId, userId, userRole);
  }

  // Get signature for direct client upload
  @Post('cloudinary/signature')
  async getCloudinarySignature(@Body() dto: CloudinarySignatureDto) {
    return this.mediaService.getUploadSignature(dto.folder);
  }

  // Upload media
  @Post()
  async upload(
    @Body() dto: UploadMediaDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.mediaService.upload(dto, userId, userRole);
  }

  // Get media by listing (public)
  @Public()
  @Get('listing/:listingId')
  async findByListing(@Param('listingId') listingId: string) {
    return this.mediaService.findByListing(listingId);
  }

  // Update media
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMediaDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.mediaService.update(id, dto, userId, userRole);
  }

  // Set as primary
  @Patch(':id/primary')
  async setPrimary(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.mediaService.setPrimary(id, userId, userRole);
  }

  // Delete media
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.mediaService.remove(id, userId, userRole);
  }
}
