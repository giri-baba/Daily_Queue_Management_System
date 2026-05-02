const requests = new Map();

const otpRateLimit = (req, res, next) => {
  const key = `${req.ip}:${req.originalUrl}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 8;

  const history = (requests.get(key) || []).filter((time) => now - time < windowMs);

  if (history.length >= maxRequests) {
    return res.status(429).json({ message: "Too many OTP requests. Please try again later." });
  }

  history.push(now);
  requests.set(key, history);
  next();
};

export default otpRateLimit;
