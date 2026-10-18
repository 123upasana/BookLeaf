
import express from "express";

import {
  getAuthorResponses,
  addAuthorResponse,
  getAdminResponses,
  addAdminResponse,
} from "../Controllers/ticketResponseController.js";

import { authmiddleware } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/roleMiddleware.js";

const router = express.Router();

// Author response endpoints
router.get(
  "/tickets/:ticketId/responses",
  authmiddleware,
  authorizeRoles("author"),
  getAuthorResponses
);

router.post(
  "/tickets/:ticketId/responses",
  authmiddleware,
  authorizeRoles("author"),
  addAuthorResponse
);

// Admin response endpoints
router.get(
  "/admin/tickets/:ticketId/responses",
  authmiddleware,
  authorizeRoles("admin"),
  getAdminResponses
);

router.post(
  "/admin/tickets/:ticketId/responses",
  authmiddleware,
  authorizeRoles("admin"),
  addAdminResponse
);

export default router;
