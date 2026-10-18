
import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Publication details
    isbn: {
      type: String,
      trim: true,
      default: null,
    },

    publisher: {
      type: String,
      trim: true,
      default: "",
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    publicationStatus: {
      type: String,
      enum: ["draft", "published", "unpublished"],
      default: "draft",
    },

    // Royalty-related information
    price: {
      type: Number,
      min: 0,
      required: true,
    },

    royaltyRate: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    copiesSold: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

export { Book };
