import { Request, Response, NextFunction } from 'express';

// Note: All authentication middleware has been disabled

// Optional authentication middleware (no-op)
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  // This middleware allows both authenticated and unauthenticated requests
  next();
};

// Placeholder auth middleware that does nothing
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  // No authentication required - just proceed
  next();
};

// Placeholder clerk middleware that does nothing
export const clerkMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // No authentication required - just proceed
  next();
};

// Placeholder auth middleware that does nothing
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // No authentication required - just proceed
  next();
};
