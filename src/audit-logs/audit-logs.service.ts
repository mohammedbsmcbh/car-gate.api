import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type AuditLogInput = {
  actorId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
  ip?: string;
  userAgent?: string;
};

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async log(input: AuditLogInput) {
    // Audit logging should never break the primary action.
    try {
      await this.prisma.auditLog.create({
        data: {
          actorId: input.actorId ?? null,
          action: input.action,
          entityType: input.entityType,
          entityId: input.entityId,
          metadata: input.metadata,
          ip: input.ip,
          userAgent: input.userAgent,
        },
      });
    } catch {
      // Intentionally swallow errors (e.g., migrations not yet applied)
    }
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    actorId?: string;
    action?: string;
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.actorId) where.actorId = params.actorId;
    if (params.action) where.action = params.action;

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          actor: { select: { id: true, email: true, name: true, role: true } },
        },
      }),
      this.prisma.auditLog.count({ where }),
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
}
