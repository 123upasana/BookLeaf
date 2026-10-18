import express from "express";

import {
  createTicket,
  getMyTickets,
  getMyTicketById,
} from "../Controllers/supportTicketController.js";

import { authmiddleware } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authmiddleware);
router.use(authorizeRoles("author"));

router.post("/", createTicket);
router.get("/my-tickets", getMyTickets);
router.get("/my-tickets/:ticketId", getMyTicketById);

export default router;
