export const requireFields = (...fields) => {
  return (req, res, next) => {
    const missing = fields.filter((field) => !req.body[field]);

    if (missing.length) {
      return res.status(400).json({ message: `${missing.join(", ")} required` });
    }

    next();
  };
};
