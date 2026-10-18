import "dotenv/config";
import { classifyTicket } from "./src/Services/aiService.js";

try {
  const result = await classifyTicket({
    subject: "Royalty payment not received",
    description:
      "My book has sold 150 copies, but I have not received my royalty payment.",
  });

  console.log("AI classification:", result);
} catch (error) {
  console.error("AI test failed:", error.message);
}