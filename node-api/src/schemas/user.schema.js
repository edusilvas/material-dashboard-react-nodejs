import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { required: true, type: String },
  email: { required: true, type: String, unique: true },
  email_verified_at: { type: Date },
  password: { required: true, type: String },
  profile_image: { type: String },
  isBanned: { type: Boolean, default: false },
  credits: { type: Number, default: 0 },
  profileType: { type: String, enum: ["FREE", "PREMIUM"], default: "FREE" },
  linkedIds: {
    linkedin: String,
    google: String
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", { virtuals: true });

export const userModel = mongoose.model("User", userSchema);
