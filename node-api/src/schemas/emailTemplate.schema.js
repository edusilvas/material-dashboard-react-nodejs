import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema({
  name: { required: true, type: String },
  subject: { required: true, type: String },
  content: { required: true, type: String }, // Markdown or HTML
  type: { type: String, enum: ["TRANSACTIONAL", "MARKETING", "SYSTEM"], default: "SYSTEM" },
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const emailTemplateModel = mongoose.model("EmailTemplate", emailTemplateSchema);
