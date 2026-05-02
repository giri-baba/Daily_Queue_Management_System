export const requireEmailVerified = (req, res, next) => {
  if (!req.user.emailVerified) {
    return res.status(403).json({ message: "Please verify your email first" });
  }
  next();
};
