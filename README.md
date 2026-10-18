# BookLeaf

# BookLeaf Publishing — Author Support & Communication Portal

## 1. Objectives

- Allow authors to securely access their own account data.
- Enable authors to submit and track support tickets.
- Automatically suggest ticket categories and priorities using AI.
- Provide a foundation for efficient ticket handling by the support team.
- Keep AI credentials secure and handle AI service failures gracefully.

## 2. Technology Stack

 Technology

 Node.js 
 Express.js
 MongoDB 
 Mongoose 
 JWT 
 bcryptjs 
 Google Gemini API 
 Helmet 
 Morgan 
 
## 3. Current Implementation

a) Authentication
b) Author Support Tickets
c) AI-Assisted Classification
d) Book APIs
**Implementation status:** The project is currently backend-focused. The author-facing and admin-facing interfaces, complete seeded dataset, and remaining assignment features must be implemented and tested before being described as complete.

## 4. AI Integration

The application uses the Google Gemini API to classify support tickets. The model receives the ticket subject and description and is instructed to return a category and priority in a structured format.

The supported categories are:

- Royalty & Payments
- ISBN & Metadata Issues
- Printing & Quality
- Distribution & Availability
- Book Status & Production Updates
- General Inquiry

Priority levels are represented as `urgent`, `high`, `medium`, and `low`.

### Model choice

Gemini was selected to provide an LLM-based classification capability without hosting a model locally. This keeps the initial implementation simple and allows the model to be changed through configuration.

### Error handling and security

- API credentials are loaded from environment variables.
- AI classification failures should not prevent ticket creation.
- AI-generated values are validated before being stored.
- AI output is treated as a suggestion rather than a substitute for human review.

### Cost awareness

The classification request uses the current ticket's relevant information rather than sending an entire ticket history by default. Additional AI features should use only the knowledge-base sections relevant to the query.

**Current limitation:** AI-generated draft responses grounded in the BookLeaf Knowledge Base are not yet implemented.

## 5. API Documentation

The backend provides REST APIs for user authentication, book management, and support ticket management.

### User Authentication
- `POST /api/users/register` — Registers a new user.
- `POST /api/users/login` — Logs in an existing user and returns an authentication token.

### Books
- `GET /api/books/my-books` — Retrieves books associated with the authenticated author.

### Support Tickets
- `POST /api/tickets` — Creates a new support ticket and generates AI-based category and priority suggestions.
- `GET /api/tickets/my-tickets` — Retrieves support tickets submitted by the authenticated author.
- `GET /api/tickets/my-tickets/:id` — Retrieves a specific ticket belonging to the authenticated author.

### Authentication

Protected endpoints require a valid JWT access token in the request header:

`Authorization: Bearer <token>`

### Error Handling

The API returns JSON responses containing success or failure information and an appropriate error message.

## 6. Project Setup

### Prerequisites
- Node.js and npm
- MongoDB, running locally or hosted
- A Google Gemini API key

### Installation

1. Clone the repository.
2. Open the backend directory:

   `cd backend`

3. Install dependencies:

   `npm install`

4. Create a `.env` file inside the `backend` directory.

5. Configure the following variables:

   `PORT=5000`

   `MONGO_URI=your_mongodb_connection_string`

   `JWT_SECRET=your_jwt_secret`

   `GEMINI_API_KEY=your_gemini_api_key`

   `GEMINI_MODEL=your_supported_gemini_model`

6. Start the development server:

   `npm run dev`

The API will run at `http://localhost:5000`, assuming port 5000 is available.

Never commit the actual `.env` file or expose API credentials in source code.

## 7. Known Limitations and Next Steps

The following items require implementation or verification before the assignment is considered complete:

- Author-facing and admin-facing frontend dashboards.
- Importing and linking the provided author and book sample data.
- Admin ticket queue, filters, assignment, and status management.
- Admin overrides for AI-suggested categories and priorities.
- AI-drafted responses grounded in the BookLeaf Knowledge Base.
- Sending responses to authors and maintaining response history.
- Internal admin notes.
- Near-real-time ticket updates.
- Input validation and role-based access testing across all routes.
- Automated tests, deployment, and a live demo.

