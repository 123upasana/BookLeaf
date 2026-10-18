
import mongoose, { Schema } from "mongoose";

const supportTicketSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
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

    assignedAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // AI classification or manual classification
    category: {
      type: String,
      default: "uncategorized",
      trim: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    status: {
      type: String,
      enum: [
        "open",
        "in_progress",
        "pending",
        "resolved",
        "closed",
      ],
      default: "open",
    },

    // AI suggestions are separate from the final admin decisions
    aiSuggestedCategory: {
      type: String,
      default: null,
    },

    aiSuggestedPriority: {
      type: String,
      enum: ["low", "medium", "high", "urgent", null],
      default: null,
    },

    aiDraftResponse: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const SupportTicket = mongoose.model(
  "SupportTicket",
  supportTicketSchema
);

export { SupportTicket };
