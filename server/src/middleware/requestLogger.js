const requestLogger = (req, res, next) => {
  const startedAt = Date.now();

  console.log(`[API Request] ${req.method} ${req.originalUrl}`, {
    body: req.body,
    query: req.query,
    user: req.user ? `${req.user.name} (${req.user.role})` : "guest"
  });

  res.on("finish", () => {
    const time = Date.now() - startedAt;
    console.log(`[API Response] ${res.statusCode} ${req.method} ${req.originalUrl} - ${time}ms`);
  });

  next();
};

export default requestLogger;
