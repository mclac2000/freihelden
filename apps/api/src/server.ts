import express from "express";
import cors from "cors";

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

app.get("/api/provisions/all", (_req, res) => {
  res.json([]);
});

app.get("/api/search", (_req, res) => {
  res.json([]);
});

app.get("/api/communication", (_req, res) => {
  res.json([]);
});

const port = 3000;

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
