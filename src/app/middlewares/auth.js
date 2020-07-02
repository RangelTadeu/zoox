module.exports = async (req, res, next) => {
  //in header { authorization: bearer key }
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token not found" });
  }

  const [, token] = authHeader.split(" ");

  if (!(token == process.env.APP_SECRET)) {
    res.status(401).json({ message: "Invalid Token" });
  }

  return next();
};
