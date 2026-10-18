
import mongoose, { Schema } from "mongoose";

const ticketResponseSchema = new Schema(
  {
    ticket: {
      type: Schema.Types.ObjectId,
      ref: "SupportTicket",
      required: true,
      index: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    isInternalNote: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const TicketResponse = mongoose.model(
  "TicketResponse",
  ticketResponseSchema
);

export { TicketResponse };
