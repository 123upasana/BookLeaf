import mongoose from "mongoose";
import { SupportTicket } from "../Modles/SupportTicket.js";

const ALLOWED_CATEGORIES = [
  "Royalty & Payments",
  "ISBN & Metadata Issues",
  "Printing & Quality",
  "Distribution & Availability",
  "Book Status & Production Updates",
  "General Inquiry",
];

const ALLOWED_PRIORITIES = ["low", "medium", "high", "urgent"];

export const createTicket = async (req, res) => {
  try {
    const { subject, description, category } = req.body;

    if (
      typeof subject !== "string" ||
      !subject.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Subject and description are required",
      });
    }

    const authorId = req.user?.sub;

    if (!authorId || !mongoose.isValidObjectId(authorId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token or author ID",
      });
    }

    let finalCategory = "General Inquiry";
    let priority = "medium";
    let aiSuggestedCategory = null;
    let aiSuggestedPriority = null;

    if (
      typeof category === "string" &&
      ALLOWED_CATEGORIES.includes(category.trim())
    ) {
      finalCategory = category.trim();
    }

    try {
      const { classifyTicket } = await import(
        "../Services/aiService.js"
      );

      const aiResult = await classifyTicket({
        subject: subject.trim(),
        description: description.trim(),
      });

      if (ALLOWED_CATEGORIES.includes(aiResult.category)) {
        aiSuggestedCategory = aiResult.category;
        finalCategory = aiResult.category;
      }

      const suggestedPriority = String(
        aiResult.priority ?? ""
      ).toLowerCase();

      if (ALLOWED_PRIORITIES.includes(suggestedPriority)) {
        aiSuggestedPriority = suggestedPriority;
        priority = suggestedPriority;
      }
    } catch (aiError) {
      console.error(
        "AI classification failed; using fallback values:",
        aiError.message
      );
    }

    const ticket = await SupportTicket.create({
      subject: subject.trim(),
      description: description.trim(),
      author: authorId,
      category: finalCategory,
      priority,
      status: "open",
      aiSuggestedCategory,
      aiSuggestedPriority,
    });

    return res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error("Create ticket error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create support ticket",
    });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const authorId = req.user?.sub;

    if (!authorId || !mongoose.isValidObjectId(authorId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token or author ID",
      });
    }

    const tickets = await SupportTicket.find({
      author: authorId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("Get tickets error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch support tickets",
    });
  }
};

export const getMyTicketById = async (req, res) => {
  try {
    const authorId = req.user?.sub;
    const { ticketId } = req.params;

    if (!authorId || !mongoose.isValidObjectId(authorId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token or author ID",
      });
    }

    if (!mongoose.isValidObjectId(ticketId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID",
      });
    }
    const ticket = await SupportTicket.findOne({
      _id: ticketId,
      author: authorId,
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error("Get ticket error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch support ticket",
    });
  }
};
