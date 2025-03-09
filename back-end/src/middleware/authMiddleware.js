import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token; // ✅ Use "token" instead of "access_token"

  if (!token) {
    return res.status(401).json({
      meta: { success: false, message: "Unauthorized", status: 401 },
      data: null,
      error: { message: "No token provided" },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (err) {
    return res.status(403).json({
      meta: { success: false, message: "Forbidden", status: 403 },
      data: null,
      error: { message: "Invalid or expired token" },
    });
  }
};

