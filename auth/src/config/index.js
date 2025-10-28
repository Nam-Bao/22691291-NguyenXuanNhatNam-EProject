// require("dotenv").config();

// module.exports = {
//   mongoURI: process.env.MONGODB_AUTH_URI,
//   jwtSecret: process.env.JWT_SECRET || "secret",
// };


require("dotenv").config();

module.exports = {
  // Ưu tiên URI test từ mongodb-memory-server nếu có
  mongoURI:
    process.env.MONGO_URI || // dùng cho test
    process.env.MONGODB_AUTH_URI || // dùng cho môi trường thực
    "mongodb://127.0.0.1:27017/auth_service", // fallback local
  jwtSecret: process.env.JWT_SECRET || "secret",
};
