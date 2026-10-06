import jwt from 'jsonwebtoken';
import { db } from '../db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'kissurl_secure_jwt_secret_production_2026';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Authentication token is required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User account no longer exists' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

export const requireWorkspaceAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const workspaceId = req.params.workspaceId || req.headers['x-workspace-id'] || req.body?.workspaceId || req.query?.workspaceId;
  if (!workspaceId) {
    return res.status(400).json({ error: 'Missing workspaceId in request' });
  }

  const hasAccess = db.userHasWorkspaceAccess(req.user.id, workspaceId);
  if (!hasAccess) {
    return res.status(403).json({ error: 'Forbidden: You do not have permission to access this workspace' });
  }

  req.workspaceId = workspaceId;
  next();
};
