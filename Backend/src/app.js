import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middleware setup
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from localhost, 127.0.0.1, or empty origin
      if (!origin || origin.includes("localhost") || origin.includes("127.0.0.1")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// --- ROUTES IMPORT ---
import userRouter from './routes/user.routes.js';
import helperRouter from './routes/helper.routes.js';
import bookingRouter from './routes/booking.routes.js';
import reviewRouter from './routes/review.routes.js';
import adminRouter from './routes/admin.routes.js';
import chatbotRouter from './routes/chatbot.routes.js';
import aiRouter from './routes/ai.routes.js';
import paymentRouter from './routes/payment.routes.js';
import attendanceRouter from './routes/attendance.routes.js';
import chatRouter from './routes/chat.routes.js';
import notificationRouter from './routes/notification.routes.js';

// --- ROUTES DECLARATION ---
app.use("/api/v1/users", userRouter);
app.use("/api/v1/helpers", helperRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/chatbot", chatbotRouter);
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/attendance", attendanceRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/notifications", notificationRouter);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        statusCode,
        success: false,
        message,
        errors: err.errors || [],
    });
});

export { app };