import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const dbConnect = () => {
  mongoose.connection.on("connected", () => console.log("✅ MongoDB: Conexão estabelecida com sucesso."));
  mongoose.connection.on("error", (err) => console.error("❌ MongoDB: Erro na conexão:", err));
  
  const connectionString = process.env.MONGODB_URI || `mongodb+srv://${process.env.DB_LINK}?retryWrites=true&w=majority`;
  
  console.log("[INIT] Conectando ao MongoDB...");
  return mongoose.connect(
    connectionString,
    { keepAlive: true }
  );
};
