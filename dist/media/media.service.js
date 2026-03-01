"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dto_1 = require("./dto");
const client_1 = require("@prisma/client");
const cloudinary_config_1 = require("./cloudinary.config");
const stream_1 = require("stream");
const fs = __importStar(require("fs"));
const util = __importStar(require("util"));
const path = __importStar(require("path"));
const unlink = util.promisify(fs.unlink);
let MediaService = class MediaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
        (0, cloudinary_config_1.configureCloudinary)();
    }
    async uploadToCloudinary(base64Data, listingId, userId, userRole, position) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            include: { media: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (userRole !== client_1.UserRole.SUPER_ADMIN && listing.ownerId !== userId) {
            throw new common_1.ForbiddenException('Cannot add media to this listing');
        }
        const imageCount = listing.media.filter((m) => m.type === 'image').length;
        if (imageCount >= 3) {
            throw new common_1.BadRequestException('Maximum 3 images allowed per listing');
        }
        try {
            const result = await cloudinary_config_1.cloudinary.uploader.upload(base64Data, {
                folder: `car-gate/listings/${listingId}`,
                resource_type: 'image',
                transformation: [
                    { width: 1200, height: 800, crop: 'limit' },
                    { quality: 'auto' },
                    { fetch_format: 'auto' },
                ],
            });
            const media = await this.prisma.media.create({
                data: {
                    listingId,
                    url: result.secure_url,
                    type: 'image',
                    isPrimary: imageCount === 0,
                    order: imageCount,
                },
            });
            return {
                ...media,
                cloudinaryId: result.public_id,
                position: position || dto_1.ImagePosition.OTHER,
            };
        }
        catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new common_1.BadRequestException('Failed to upload image to Cloudinary');
        }
    }
    async uploadStoryMedia(base64Data, userId) {
        try {
            const result = await cloudinary_config_1.cloudinary.uploader.upload(base64Data, {
                folder: `car-gate/stories/${userId}`,
                resource_type: 'auto',
                transformation: [
                    { quality: 'auto' },
                    { fetch_format: 'auto' },
                ],
            });
            return {
                url: result.secure_url,
                publicId: result.public_id,
            };
        }
        catch (error) {
            console.error('Cloudinary story upload error:', error);
            throw new common_1.BadRequestException('Failed to upload story media');
        }
    }
    async uploadStoryVideoFromBuffer(file, userId) {
        try {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_config_1.cloudinary.uploader.upload_stream({
                    resource_type: 'video',
                    folder: `car-gate/stories/${userId}`,
                }, (error, uploadResult) => {
                    if (error)
                        return reject(error);
                    return resolve(uploadResult);
                });
                stream_1.Readable.from(file.buffer).pipe(uploadStream);
            });
            return {
                url: result.secure_url,
                publicId: result.public_id,
            };
        }
        catch (error) {
            console.error('Cloudinary story video upload error:', error);
            throw new common_1.BadRequestException('Failed to upload story video');
        }
    }
    async uploadProfileImage(base64Data, userId) {
        try {
            const result = await cloudinary_config_1.cloudinary.uploader.upload(base64Data, {
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
        }
        catch (error) {
            console.error('Cloudinary profile upload error:', error);
            throw new common_1.BadRequestException('Failed to upload profile image');
        }
    }
    async deleteFromCloudinary(publicId) {
        try {
            await cloudinary_config_1.cloudinary.uploader.destroy(publicId);
        }
        catch (error) {
            console.error('Cloudinary delete error:', error);
        }
    }
    getUploadSignature(folder) {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const uploadFolder = folder || 'car-gate/listings';
        const signature = cloudinary_config_1.cloudinary.utils.api_sign_request({
            timestamp,
            folder: uploadFolder,
        }, process.env.CLOUDINARY_API_SECRET);
        return {
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            folder: uploadFolder,
        };
    }
    async upload(dto, userId, userRole) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: dto.listingId },
            include: { media: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (userRole !== client_1.UserRole.SUPER_ADMIN && listing.ownerId !== userId) {
            throw new common_1.ForbiddenException('Cannot add media to this listing');
        }
        const imageCount = listing.media.filter((m) => m.type === 'image').length;
        const videoCount = listing.media.filter((m) => m.type === 'video').length;
        if (dto.type === 'image' && imageCount >= 10) {
            throw new common_1.BadRequestException('Maximum 10 images allowed per listing');
        }
        if (dto.type === 'video' && videoCount >= 3) {
            throw new common_1.BadRequestException('Maximum 3 videos allowed per listing');
        }
        if (dto.isPrimary) {
            await this.prisma.media.updateMany({
                where: { listingId: dto.listingId, isPrimary: true },
                data: { isPrimary: false },
            });
        }
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
    async findByListing(listingId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        return this.prisma.media.findMany({
            where: { listingId },
            orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }, { createdAt: 'asc' }],
        });
    }
    async uploadVideoToCloudinary(file, listingId, userId, userRole) {
        if (!listingId) {
            throw new common_1.BadRequestException('listingId is required');
        }
        if (!file?.path) {
            throw new common_1.BadRequestException('Video file is required');
        }
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            include: { media: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (userRole !== client_1.UserRole.SUPER_ADMIN && listing.ownerId !== userId) {
            throw new common_1.ForbiddenException('Cannot add media to this listing');
        }
        const videoCount = listing.media.filter((m) => m.type === 'video').length;
        if (videoCount >= 3) {
            throw new common_1.BadRequestException('Maximum 3 videos allowed per listing');
        }
        const folder = `car-gate/listings/${listingId}`;
        let result;
        try {
            const absolutePath = path.resolve(file.path);
            console.log(`Starting upload_large for: ${absolutePath}`);
            result = await cloudinary_config_1.cloudinary.uploader.upload_large(absolutePath, {
                resource_type: 'video',
                folder,
                chunk_size: 6000000,
                timeout: 600000,
            });
        }
        catch (error) {
            console.error('Cloudinary video upload error:', JSON.stringify(error, null, 2));
            const cloudinaryMessage = error?.message ||
                error?.error?.message ||
                error?.response?.data?.error?.message ||
                (typeof error === 'string' ? error : 'Unknown error');
            const httpCode = error?.http_code || error?.status || error?.response?.status;
            const details = [cloudinaryMessage, httpCode ? `code=${httpCode}` : null]
                .filter(Boolean)
                .join(' ');
            throw new common_1.BadRequestException(`Cloudinary upload failed: ${details}`);
        }
        finally {
            if (file.path) {
                try {
                    await unlink(file.path);
                }
                catch (e) {
                    console.error('Failed to delete temp file:', file.path);
                }
            }
        }
        if (!result?.secure_url) {
            throw new common_1.BadRequestException('Failed to upload video to Cloudinary');
        }
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
    async update(mediaId, dto, userId, userRole) {
        const media = await this.prisma.media.findUnique({
            where: { id: mediaId },
            include: { listing: true },
        });
        if (!media) {
            throw new common_1.NotFoundException('Media not found');
        }
        if (userRole !== client_1.UserRole.SUPER_ADMIN && media.listing.ownerId !== userId) {
            throw new common_1.ForbiddenException('Cannot update this media');
        }
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
    async remove(mediaId, userId, userRole) {
        const media = await this.prisma.media.findUnique({
            where: { id: mediaId },
            include: { listing: true },
        });
        if (!media) {
            throw new common_1.NotFoundException('Media not found');
        }
        if (userRole !== client_1.UserRole.SUPER_ADMIN && media.listing.ownerId !== userId) {
            throw new common_1.ForbiddenException('Cannot delete this media');
        }
        await this.prisma.media.delete({
            where: { id: mediaId },
        });
        return { message: 'Media deleted successfully' };
    }
    async setPrimary(mediaId, userId, userRole) {
        const media = await this.prisma.media.findUnique({
            where: { id: mediaId },
            include: { listing: true },
        });
        if (!media) {
            throw new common_1.NotFoundException('Media not found');
        }
        if (userRole !== client_1.UserRole.SUPER_ADMIN && media.listing.ownerId !== userId) {
            throw new common_1.ForbiddenException('Cannot update this media');
        }
        await this.prisma.media.updateMany({
            where: { listingId: media.listingId, isPrimary: true },
            data: { isPrimary: false },
        });
        return this.prisma.media.update({
            where: { id: mediaId },
            data: { isPrimary: true },
        });
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MediaService);
//# sourceMappingURL=media.service.js.map