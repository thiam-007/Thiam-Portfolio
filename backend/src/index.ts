import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDatabase from "./lib/mongodb";
import projectRoutes from "./routes/projectRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/projects", projectRoutes);
// TODO: ajouter /api/experiences et /api/certifications

async function start() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Backend started on http://localhost:${PORT}`);
  });
}

start();