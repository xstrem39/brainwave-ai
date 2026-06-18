import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'brainwave_fallback_secret';

export const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

export const hashData = (data) => {
  return createHash('sha256').update(String(data)).digest('hex');
};

export const verifyPaystackWebhook = (payload, signature) => {
  const hash = createHash('sha512')
    .update(JSON.stringify(payload))
    .update(process.env.PAYSTACK_SECRET_KEY || '')
    .digest('hex');
  return hash === signature;
};

export const sanitizeHtml = (input) => {
  return String(input || '').replace(/[<>'"&]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', "'": '&#x27;', '"': '&quot;', '&': '&amp;',
  }[c]));
};

export const rateLimit = (() => {
  const store = new Map();
  return (key, limit = 100, windowMs = 60000) => {
    const now = Date.now();
    const windowKey = `${key}:${Math.floor(now / windowMs)}`;
    const count = (store.get(windowKey) || 0) + 1;
    store.set(windowKey, count);
    if (store.size > 10000) {
      const cutoff = Math.floor(now / windowMs) - 2;
      for (const k of store.keys()) {
        if (parseInt(k.split(':').pop()) < cutoff) store.delete(k);
      }
    }
    return { allowed: count <= limit, remaining: Math.max(0, limit - count), count };
  };
})();

export const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  const cookie = req.headers.cookie;
  if (cookie) {
    const match = cookie.match(/brainwave_token=([^;]+)/);
    if (match) return match[1];
  }
  return null;
};

export const requireAuth = (handler) => async (req, res) => {
  const token = getTokenFromRequest(req);
  if (!token) return res.status(401).json({ success: false, error: 'Authentication required' });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ success: false, error: 'Invalid or expired token' });

  req.user = decoded;
  return handler(req, res);
};

export const requireRole = (roles) => (handler) => async (req, res) => {
  return requireAuth(async (req, res) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }
    return handler(req, res);
  })(req, res);
};
