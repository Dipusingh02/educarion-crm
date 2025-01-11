import jwt from "jsonwebtoken";
export const applyMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
      return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
      const token = authHeader.split(" ")[1];
      if (!token) {
          return res.status(401).json({ message: "Token not found" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded; // Attaching user data to the request
      next();
  } catch (err) {
      console.error("Token verification error:", err.message);
      return res.status(403).json({ message: "Invalid or expired token" });
  }
};
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
  }
  next();
};
