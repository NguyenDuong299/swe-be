import express, { Request, Response } from "express";
import { sequelize } from "./config/database";
import userRouter from "./routes/authRouter";
import "./models/user";
import i18nMiddleware from "./middlewares/i18n";
import cors from "cors";
const router = express.Router();
const app = express();
const port = 8080;
router.use(express.json()); 

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(i18nMiddleware);
app.use(express.json());
app.use("/api", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Node.js API!");
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối database thành công!");
    await sequelize.sync({ alter: true });
    console.log("✅ Đồng bộ bảng thành công!");

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Lỗi khi kết nối hoặc đồng bộ database:", error);
  }
}

startServer();
