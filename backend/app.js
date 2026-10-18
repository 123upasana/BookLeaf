import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./src/Routes/user.routes.js";
import bookRoutes from "./src/Routes/bookRoutes.js";
import supportTicketRoutes from "./src/Routes/supportTicketRoutes.js";
import ticketResponseRoutes from "./src/Routes/ticketResponseRoutes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BookLeaf API is running",
  });
});
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/tickets", supportTicketRoutes);
app.use("/api", ticketResponseRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error",
  });
});

export default app;
