import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  description: z.string().optional(),
  isSeller: z.boolean().default(false),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const gigSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  shortTitle: z.string().min(5, "Short title must be at least 5 characters"),
  shortDesc: z
    .string()
    .min(20, "Short description must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(5, "Price must be at least $5"),
  deliveryTime: z.number().min(1, "Delivery time must be at least 1 day"),
  revisionNumber: z.number().min(0, "Revision number cannot be negative"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  cover: z.string().min(1, "Cover image is required"),
  images: z.array(z.string()).optional(),
});

export const reviewSchema = z.object({
  gigId: z.string().min(1, "Gig ID is required"),
  star: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  desc: z.string().min(10, "Review must be at least 10 characters"),
});

export const messageSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  desc: z.string().min(1, "Message cannot be empty"),
});
