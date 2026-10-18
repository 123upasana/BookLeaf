
import mongoose from "mongoose";
import { SupportTicket } from "../Modles/SupportTicket.js";
import { TicketResponse } from "../Modles/TicketResponse.js";

// GET /api/tickets/:ticketId/responses
// Author: retrieve public responses for their own ticket
export const getAuthorResponses = async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!mongoose.isValidObjectId(ticketId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID",
      });
    }

    const ticket = await SupportTicket.findOne({
      _id: ticketId,
      author: req.user.id,
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Exclude internal notes in the database query itself.
    const responses = await TicketResponse.find({
      ticket: ticketId,
      isInternalNote: false,
    })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: responses.length,
      responses,
    });
  } catch (error) {
    console.error("Get author responses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch responses",
    });
  }
};

// POST /api/tickets/:ticketId/responses
// Author: add a public reply to their own ticket
export const addAuthorResponse = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message } = req.body;

    if (!mongoose.isValidObjectId(ticketId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID",
      });
    }

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const ticket = await SupportTicket.findOne({
      _id: ticketId,
      author: req.user.id,
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    if (["resolved", "closed"].includes(ticket.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot reply to a resolved or closed ticket",
      });
    }

    // Do not accept sender or isInternalNote from the request.
    const response = await TicketResponse.create({
      ticket: ticket._id,
      sender: req.user.id,
      message: message.trim(),
      isInternalNote: false,
    });

    return res.status(201).json({
      success: true,
      message: "Reply added successfully",
      response,
    });
  } catch (error) {
    console.error("Add author response error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add reply",
    });
  }
};

// GET /api/admin/tickets/:ticketId/responses
// Admin: retrieve public replies and internal notes
export const getAdminResponses = async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!mongoose.isValidObjectId(ticketId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID",
      });
    }

    const ticketExists = await SupportTicket.exists({
      _id: ticketId,
    });

    if (!ticketExists) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const responses = await TicketResponse.find({
      ticket: ticketId,
    })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: responses.length,
      responses,
    });
  } catch (error) {
    console.error("Get admin responses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch responses",
    });
  }
};

// POST /api/admin/tickets/:ticketId/responses
// Admin: add a public reply or internal note
export const addAdminResponse = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message, isInternalNote = false } = req.body;

    if (!mongoose.isValidObjectId(ticketId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID",
      });
    }

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (typeof isInternalNote !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isInternalNote must be a boolean",
      });
    }

    const ticket = await SupportTicket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const response = await TicketResponse.create({
      ticket: ticket._id,
      sender: req.user.id,
      message: message.trim(),
      isInternalNote,
    });

    return res.status(201).json({
      success: true,
      message: isInternalNote
        ? "Internal note added successfully"
        : "Public reply added successfully",
      response,
    });
  } catch (error) {
    console.error("Add admin response error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add response",
    });
  }
};
