// ============================================================================
// 📁 middleware/rateLimiting.js
// ============================================================================

const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 10;

const simpleRateLimit = (req, res, next) => {
  const userId = req.user ? req.user._id.toString() : req.ip;
  const now = Date.now();

  if (!requestCounts.has(userId)) {
    requestCounts.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }

  const userRequests = requestCounts.get(userId);

  if (now > userRequests.resetTime) {
    requestCounts.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }

  if (userRequests.count >= MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({
      error: "Trop de demandes",
      details: "Maximum 10 requêtes par minute",
    });
  }

  userRequests.count++;
  next();
};

module.exports = { simpleRateLimit };
