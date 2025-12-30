import express from "express";
import cors from "cors";

export function startServer() {
  const app = express();

  // Global CORS – minimal & sicher
  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"]
    })
  );

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  const port = 3000;
  app.listen(port, () => {
    console.log(`MINIMAL API running on http://localhost:${port}`);
  });
}
