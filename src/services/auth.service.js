import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';
import { config } from '../config/config.js';
import { AppError } from '../middleware/errorHandler.js';

class AuthService {
  async register(email, password, name) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const tokens = this.generateTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { user: this.excludePassword(user), ...tokens };
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const tokens = this.generateTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { user: this.excludePassword(user), ...tokens };
  }

  async refresh(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });

      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError('Invalid refresh token', 401);
      }

      const tokens = this.generateTokens(user.id, user.role);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (err) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  async logout(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  generateTokens(id, role) {
    const accessToken = jwt.sign({ id, role }, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiration,
    });
    const refreshToken = jwt.sign({ id }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiration,
    });
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId, refreshToken) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  excludePassword(user) {
    const { password, refreshToken, ...userWithoutSecrets } = user;
    return userWithoutSecrets;
  }
}

export default new AuthService();
