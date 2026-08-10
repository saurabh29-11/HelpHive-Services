import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});
console.log("GEMINI KEY LOADED:", process.env.GOOGLE_GEMINI_API_KEY);
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("SERVER ERROR: ", error);
      throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });