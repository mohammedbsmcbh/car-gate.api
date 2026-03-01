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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const media_service_1 = require("./media.service");
const dto_1 = require("./dto");
const guards_1 = require("../auth/guards");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const client_1 = require("@prisma/client");
const platform_express_1 = require("@nestjs/platform-express");
const multer = __importStar(require("multer"));
const multer_1 = require("multer");
const path_1 = require("path");
let MediaController = class MediaController {
    mediaService;
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    async uploadToCloudinary(body, userId, userRole) {
        console.log('Cloudinary upload request received');
        console.log('Listing ID:', body.listingId);
        console.log('User ID:', userId);
        console.log('User Role:', userRole);
        console.log('Image data length:', body.image?.length || 0);
        console.log('Position:', body.position);
        const result = await this.mediaService.uploadToCloudinary(body.image, body.listingId, userId, userRole, body.position);
        console.log('Upload successful:', result);
        return result;
    }
    async uploadStoryMedia(body, userId) {
        if (!body.image) {
            throw new Error('Image data is required');
        }
        return this.mediaService.uploadStoryMedia(body.image, userId);
    }
    async uploadStoryVideo(file, userId) {
        if (!file) {
            throw new Error('Video file is required');
        }
        return this.mediaService.uploadStoryVideoFromBuffer(file, userId);
    }
    async uploadProfileImage(body, userId) {
        if (!body.image) {
            throw new Error('Image data is required');
        }
        return this.mediaService.uploadProfileImage(body.image, userId);
    }
    async uploadVideoToCloudinary(file, listingId, userId, userRole) {
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
    async getCloudinarySignature(dto) {
        return this.mediaService.getUploadSignature(dto.folder);
    }
    async upload(dto, userId, userRole) {
        return this.mediaService.upload(dto, userId, userRole);
    }
    async findByListing(listingId) {
        return this.mediaService.findByListing(listingId);
    }
    async update(id, dto, userId, userRole) {
        return this.mediaService.update(id, dto, userId, userRole);
    }
    async setPrimary(id, userId, userRole) {
        return this.mediaService.setPrimary(id, userId, userRole);
    }
    async remove(id, userId, userRole) {
        return this.mediaService.remove(id, userId, userRole);
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Post)('cloudinary/upload'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadToCloudinary", null);
__decorate([
    (0, common_1.Post)('cloudinary/upload-story'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadStoryMedia", null);
__decorate([
    (0, common_1.Post)('cloudinary/upload-story-video'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: multer.memoryStorage(),
        limits: { fileSize: 200 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            const mimetype = file?.mimetype;
            const original = (file?.originalname || '').toLowerCase();
            const looksLikeVideo = (typeof mimetype === 'string' && mimetype.startsWith('video/')) ||
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
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadStoryVideo", null);
__decorate([
    (0, common_1.Post)('cloudinary/upload-profile'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadProfileImage", null);
__decorate([
    (0, common_1.Post)('cloudinary/upload-video'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './temp',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: { fileSize: 200 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            const mimetype = file?.mimetype;
            const original = (file?.originalname || '').toLowerCase();
            const looksLikeVideo = (typeof mimetype === 'string' && mimetype.startsWith('video/')) ||
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
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('listingId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadVideoToCloudinary", null);
__decorate([
    (0, common_1.Post)('cloudinary/signature'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CloudinarySignatureDto]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getCloudinarySignature", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.UploadMediaDto, String, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "upload", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('listing/:listingId'),
    __param(0, (0, common_1.Param)('listingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "findByListing", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateMediaDto, String, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/primary'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "setPrimary", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "remove", null);
exports.MediaController = MediaController = __decorate([
    (0, common_1.Controller)('media'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
//# sourceMappingURL=media.controller.js.map