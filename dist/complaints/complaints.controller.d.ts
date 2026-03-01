import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto, UpdateComplaintDto } from './dto';
import { ComplaintStatus } from '@prisma/client';
export declare class ComplaintsController {
    private complaintsService;
    constructor(complaintsService: ComplaintsService);
    create(dto: CreateComplaintDto, userId: string): Promise<{
        author: {
            email: string;
            name: string | null;
            id: string;
        };
    } & {
        subject: string;
        id: string;
        status: import("@prisma/client").$Enums.ComplaintStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        targetId: string | null;
        resolution: string | null;
        resolvedAt: Date | null;
        authorId: string;
    }>;
    getMyComplaints(userId: string, page: number, limit: number): Promise<{
        data: {
            subject: string;
            id: string;
            status: import("@prisma/client").$Enums.ComplaintStatus;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            targetId: string | null;
            resolution: string | null;
            resolvedAt: Date | null;
            authorId: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findAll(status: ComplaintStatus, page: number, limit: number): Promise<{
        data: ({
            target: {
                email: string;
                name: string | null;
                id: string;
            } | null;
            author: {
                email: string;
                name: string | null;
                id: string;
            };
        } & {
            subject: string;
            id: string;
            status: import("@prisma/client").$Enums.ComplaintStatus;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            targetId: string | null;
            resolution: string | null;
            resolvedAt: Date | null;
            authorId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        target: {
            email: string;
            name: string | null;
            phone: string | null;
            id: string;
        } | null;
        author: {
            email: string;
            name: string | null;
            phone: string | null;
            id: string;
        };
    } & {
        subject: string;
        id: string;
        status: import("@prisma/client").$Enums.ComplaintStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        targetId: string | null;
        resolution: string | null;
        resolvedAt: Date | null;
        authorId: string;
    }>;
    update(id: string, dto: UpdateComplaintDto, userId: string, userRole: string): Promise<{
        subject: string;
        id: string;
        status: import("@prisma/client").$Enums.ComplaintStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        targetId: string | null;
        resolution: string | null;
        resolvedAt: Date | null;
        authorId: string;
    }>;
}
