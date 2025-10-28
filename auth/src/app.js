// const express = require("express");
// const mongoose = require("mongoose");
// const config = require("./config");
// const authMiddleware = require("./middlewares/authMiddleware");
// const AuthController = require("./controllers/authController");

// class App {
//   constructor() {
//     this.app = express();
//     this.authController = new AuthController();
//     this.connectDB();
//     this.setMiddlewares();
//     this.setRoutes();
//   }

//   async connectDB() {
//     await mongoose.connect(config.mongoURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected");
//   }

//   async disconnectDB() {
//     await mongoose.disconnect();
//     console.log("MongoDB disconnected");
//   }

//   setMiddlewares() {
//     this.app.use(express.json());
//     this.app.use(express.urlencoded({ extended: false }));
//   }

//   setRoutes() {
//     this.app.post("/login", (req, res) => this.authController.login(req, res));
//     this.app.post("/register", (req, res) => this.authController.register(req, res));
//     this.app.get("/dashboard", authMiddleware, (req, res) => res.json({ message: "Welcome to dashboard" }));
//   }

//   start() {
//     this.server = this.app.listen(3000, () => console.log("Server started on port 3000"));
//   }

//   async stop() {
//     await mongoose.disconnect();
//     this.server.close();
//     console.log("Server stopped");
//   }
// }

// module.exports = App;

const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const authMiddleware = require("./middlewares/authMiddleware");
const AuthController = require("./controllers/authController");

class App {
  constructor() {
    this.app = express();
    this.authController = new AuthController();
    // ⚠️ KHÔNG GỌI connectDB() ở đây, để hook test file gọi nó
    this.setMiddlewares(); 
    this.setRoutes(); 
  }

  // Khởi tạo và kết nối DB
  async connectDB() {
    // ⚠️ Loại bỏ các tùy chọn đã lỗi thời
    await mongoose.connect(config.mongoURI);
    console.log("MongoDB connected");
  }

  // Tách biệt hàm này ra khỏi after hook của test file (chỉ để code sạch hơn)
  async deleteTestUsers() {
      // Giả định hàm này được định nghĩa trong authController.authService
      await this.authController.authService.deleteTestUsers(); 
  }

  async disconnectDB() {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }

  setMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  setRoutes() {
    this.app.post("/login", (req, res) => this.authController.login(req, res));
    this.app.post("/register", (req, res) => this.authController.register(req, res));
    // Lưu ý: Nếu muốn test /dashboard, bạn cần sử dụng token JWT hợp lệ
    this.app.get("/dashboard", authMiddleware, (req, res) => res.json({ message: "Welcome to dashboard" }));
  }

  start() {
    this.server = this.app.listen(3000, () => console.log("Server started on port 3000"));
  }

  stop() {
    // Chỉ cần đóng server HTTP, không ngắt kết nối Mongoose ở đây
    if (this.server) {
        this.server.close(() => console.log("Server stopped"));
    }
  }
}

module.exports = App;