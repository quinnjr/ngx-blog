/**
 * Security utilities
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env['JWT_SECRET'] || 'change-this-in-production';
const JWT_EXPIRES_IN = '7d';

// Rate limit tracking
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

export class Security {
  /**
   * Hash password
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /**
   * Compare password with hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token
   */
  static generateToken(payload: any): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }

  /**
   * Check if IP is locked out
   */
  static isLockedOut(ip: string): boolean {
    const attempt = loginAttempts.get(ip);
    if (!attempt) return false;

    if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
      const timeSince = Date.now() - attempt.lastAttempt;
      if (timeSince < LOCKOUT_TIME) {
        return true;
      }
      // Reset after lockout period
      loginAttempts.delete(ip);
    }
    return false;
  }

  /**
   * Record failed login attempt
   */
  static recordFailedLogin(ip: string): void {
    const attempt = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
    attempt.count++;
    attempt.lastAttempt = Date.now();
    loginAttempts.set(ip, attempt);

    // Clean up old entries
    if (loginAttempts.size > 10000) {
      const old = Date.now() - LOCKOUT_TIME;
      for (const [key, value] of loginAttempts.entries()) {
        if (value.lastAttempt < old) {
          loginAttempts.delete(key);
        }
      }
    }
  }

  /**
   * Reset login attempts on successful login
   */
  static resetLoginAttempts(ip: string): void {
    loginAttempts.delete(ip);
  }

  /**
   * Sanitize input (basic XSS prevention)
   */
  static sanitize(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Generate random API key
   */
  static generateApiKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  /**
   * Get client IP from request
   */
  static getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }
}

/**
 * Authentication middleware
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const decoded = Security.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  (req as any).user = decoded;
  next();
}

/**
 * Admin-only middleware
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

/**
 * Check for SQL injection patterns (paranoid mode)
 */
export function checkSqlInjection(req: Request, res: Response, next: NextFunction) {
  const sqlPatterns = [
    /(\bOR\b|\bAND\b).*?=.*?/i,
    /UNION.*?SELECT/i,
    /DROP\s+TABLE/i,
    /INSERT\s+INTO/i,
    /DELETE\s+FROM/i,
    /UPDATE.*?SET/i,
    /EXEC(\s|\()/i,
    /'.*?OR.*?'.*?=/i,
  ];

  const checkValue = (value: any): boolean => {
    if (typeof value === 'string') {
      return sqlPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };

  if (checkValue(req.body) || checkValue(req.query) || checkValue(req.params)) {
    return res.status(400).json({ error: 'Invalid input detected' });
  }

  next();
}

/**
 * Audit log
 */
export class AuditLog {
  private static logs: Array<{ timestamp: Date; ip: string; action: string; user?: string }> = [];
  private static MAX_LOGS = 10000;

  static log(ip: string, action: string, user?: string) {
    this.logs.push({
      timestamp: new Date(),
      ip,
      action,
      user,
    });

    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }
  }

  static getLogs(limit = 100) {
    return this.logs.slice(-limit);
  }
}
