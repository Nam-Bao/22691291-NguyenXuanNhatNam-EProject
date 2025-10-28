const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const authMiddleware = require("./middlewares/authMiddleware");
const AuthController = require("./controllers/authController");

class App {
  constructor() {
    this.app = express();
    this.authController = new AuthController();
    this.setMiddlewares();
    this.setRoutes();
  }

  // ✅ Kết nối DB có kiểm tra và bắt lỗi
  async connectDB() {
    try {
      const uri = config.mongoURI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/auth_test_db";

      mongoose.set("strictQuery", false);
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log("✅ MongoDB connected:", uri);
    } catch (err) {
      console.error("❌ MongoDB connection error:", err.message);
      throw err;
    }
  }

  async disconnectDB() {
    await mongoose.connection.dropDatabase().catch(() => {});
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }

  setMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  setRoutes() {
    this.app.post("/login", (req, res) => this.authController.login(req, res));
    this.app.post("/register", (req, res) => this.authController.register(req, res));
    this.app.get("/dashboard", authMiddleware, (req, res) =>
      res.json({ message: "Welcome to dashboard" })
    );
  }

  // ✅ Chờ server khởi động xong trước khi test
  start(port = 3000) {
    return new Promise((resolve) => {
      this.server = this.app.listen(port, () => {
        console.log(`🚀 Server started on port ${port}`);
        resolve();
      });
    });
  }

  async stop() {
    if (this.server) this.server.close();
    await mongoose.disconnect();
    console.log("🛑 Server stopped");
  }
}

module.exports = App;
