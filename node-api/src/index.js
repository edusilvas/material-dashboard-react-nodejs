import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import "./passport.js";
import { dbConnect } from "./mongo/index.js";
import { meRoutes, authRoutes, kpiRoutes, adminUserRoutes, providerRoutes, adminEmailRoutes } from "./routes/index.js";
import path from "path";
import * as fs from "fs";
import cron from "node-cron";
import ReseedAction from "./mongo/ReseedAction.js";

const PORT = process.env.PORT || 8080;
const app = express();

const whitelist = [
  process.env.APP_URL_CLIENT,
  "https://admin.jobflow.shop",
  "https://jobflow-admin-production.up.railway.app"
].filter(url => !!url);
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

dbConnect();

app.use(cors(corsOptions));
app.use(bodyParser.json({ type: "application/vnd.api+json", strict: false }));

// Serve static files from the React app build folder
console.log(`[CONFIG] Caminho do Build: ${buildPath}`);
if (fs.existsSync(buildPath)) {
  console.log("✅ [BUILD] Pasta de build encontrada.");
} else {
  console.log("❌ [BUILD] Pasta de build NÃO ENCONTRADA no caminho especificado.");
}

app.use(express.static(buildPath));

app.use("/", authRoutes);
app.use("/me", meRoutes);
app.use("/kpi", kpiRoutes);
app.use("/admin/users", adminUserRoutes);
app.use("/admin/providers", providerRoutes);
app.use("/admin/emails", adminEmailRoutes);

// Catch-all route to serve index.html for client-side routing (SPAs)
app.get("*", (req, res) => {
  const indexPath = path.join(buildPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error(`❌ [404] index.html não encontrado em: ${indexPath}`);
    res.status(404).send("Front-end build not found. Please run build script.");
  }
});

if (process.env.SCHEDULE_HOUR) {
  cron.schedule(`0 */${process.env.SCHEDULE_HOUR} * * *`, () => {
    ReseedAction();
  });
}

app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));
