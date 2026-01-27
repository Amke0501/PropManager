module.exports = (req, res, next) => {
  const user = req.headers["x-user"]; // TEMP (for testing)

  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  req.user = JSON.parse(user); // { id, role }
  next();
};
