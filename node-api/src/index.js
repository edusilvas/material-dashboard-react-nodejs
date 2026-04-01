import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import "./passport.js";
import { dbConnect } from "./mongo";
import { meRoutes, authRoutes } from "./routes";
import path from "path";
import * as fs from "fs";
import cron from "node-cron";
import ReseedAction from "./mongo/ReseedAction";

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

const whitelist = [process.env.APP_URL_CLIENT];
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

const __dirname = fs.realpathSync(".");
const buildPath = path.join(__dirname, "../material-react-app/build");

// Serve static files from the React app build folder
app.use(express.static(buildPath));

app.use("/", authRoutes);
app.use("/me", meRoutes);
app.use("/kpi", kpiRoutes);
app.use("/admin/users", adminUserRoutes);
app.use("/admin/providers", providerRoutes);
app.use("/admin/emails", adminEmailRoutes);

// Catch-all route to serve index.html for client-side routing (SPAs)
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

if (process.env.SCHEDULE_HOUR) {
  cron.schedule(`0 */${process.env.SCHEDULE_HOUR} * * *'`, () => {
    ReseedAction();
  });
}

app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));
