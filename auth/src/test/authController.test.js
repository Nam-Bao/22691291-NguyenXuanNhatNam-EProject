// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const App = require("../app");
// require("dotenv").config();


// chai.use(chaiHttp);
// const { expect } = chai;

// describe("User Authentication", () => {
//   let app;

//   before(async () => {
//     app = new App();
//     await app.connectDB();
//     app.start();
//   });

//   after(async () => {
//     await app.authController.authService.deleteTestUsers();
//     await app.disconnectDB();
//     app.stop();
//   });

//   describe("POST /register", () => {
//     it("should register a new user", async () => {
//       const res = await chai
//         .request(app.app)
//         .post("/register")
//         .send({ username: "testuser", password: "password" });

//       expect(res).to.have.status(200);
//       expect(res.body).to.have.property("_id");
//       expect(res.body).to.have.property("username", "testuser");
//     });

//     it("should return an error if the username is already taken", async () => {
//       const res = await chai
//         .request(app.app)
//         .post("/register")
//         .send({ username: "testuser", password: "password" });

//       expect(res).to.have.status(400);
//       expect(res.body).to.have.property("message", "Username already taken");
//     });
//   });

//   describe("POST /login", () => {
//     it("should return a JWT token for a valid user", async () => {
//       const res = await chai
//         .request(app.app)
//         .post("/login")
//         .send({ username: "testuser", password: "password" });

//       expect(res).to.have.status(200);
//       expect(res.body).to.have.property("token");
//     });

//     it("should return an error for an invalid user", async () => {
//       const res = await chai
//         .request(app.app)
//         .post("/login")
//         .send({ username: "invaliduser", password: "password" });

//       expect(res).to.have.status(400);
//       expect(res.body).to.have.property("message", "Invalid username or password");
//     });

//     it("should return an error for an incorrect password", async () => {
//       const res = await chai
//         .request(app.app)
//         .post("/login")
//         .send({ username: "testuser", password: "wrongpassword" });

//       expect(res).to.have.status(400);
//       expect(res.body).to.have.property("message", "Invalid username or password");
//     });
//   });
// });




const chai = require("chai");
const chaiHttp = require("chai-http");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const { app, connectDB } = require("../../app");

chai.use(chaiHttp);
const expect = chai.expect;

let mongoServer;
let server;

describe("User Authentication", function () {
  this.timeout(30000); // tăng timeout để tránh lỗi time

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Gán URI test cho config
    process.env.MONGO_URI = uri;

    // Kết nối database test
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Khởi động server thật
    server = app.listen(0, () => {
      console.log("🚀 Test server started");
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    if (server) server.close();
  });

  describe("POST /register", () => {
    it("should register a new user", async () => {
      const res = await chai
        .request(server)
        .post("/api/auth/register")
        .send({ username: "testuser", password: "123456" });
      expect(res).to.have.status(201);
      expect(res.body).to.have.property("message", "User registered successfully");
    });

    it("should return an error if the username is already taken", async () => {
      const res = await chai
        .request(server)
        .post("/api/auth/register")
        .send({ username: "testuser", password: "123456" });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property("message");
    });
  });

  describe("POST /login", () => {
    it("should return a JWT token for a valid user", async () => {
      const res = await chai
        .request(server)
        .post("/api/auth/login")
        .send({ username: "testuser", password: "123456" });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("token");
    });

    it("should return an error for an invalid user", async () => {
      const res = await chai
        .request(server)
        .post("/api/auth/login")
        .send({ username: "invaliduser", password: "wrong" });
      expect(res).to.have.status(400);
    });
  });
});
