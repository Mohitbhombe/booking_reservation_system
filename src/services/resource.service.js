import prisma from '../prisma/client.js';
import { AppError } from '../middleware/errorHandler.js';

class ResourceService {
  async createResource(data) {
    return await prisma.resource.create({ data });
  }

  async getAllResources(query) {
    const { page = 1, limit = 10, name } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.resource.count({ where }),
    ]);

    return {
      resources,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getResourceById(id) {
    const resource = await prisma.resource.findUnique({ where: { id } });
    if (!resource) {
      throw new AppError('Resource not found', 404);
    }
    return resource;
  }

  async updateResource(id, data) {
    await this.getResourceById(id);
    return await prisma.resource.update({
      where: { id },
      data,
    });
  }

  async deleteResource(id) {
    await this.getResourceById(id);
    return await prisma.resource.delete({ where: { id } });
  }
}

export default new ResourceService();
