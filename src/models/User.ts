import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string; 
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  verificationExpiresAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true, 
      lowercase: true, 
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], 
    },
    username: { 
      type: String, 
      required: [true, "Username is required"], 
      trim: true, 
      minlength: [3, "Username must be at least 3 characters"], 
    },
    password: { 
      type: String, 
      required: [true, "Password is required"], 
      minlength: [8, "Password must be at least 8 characters"], 
      validate: {
        validator: function (value: string) {
          return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
        },
        message:
          "Password must have at least 8 characters, including 1 uppercase and 1 number.",
      },
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    verificationExpiresAt: { 
      type: Date, 
      default: Date.now, 
      expires: 3600  // 1 hour 
    },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", userSchema);
export default User;
