import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Try Cloudinary upload
    try {
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });

      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      return response;
    } catch (cloudinaryErr) {
      console.warn("Cloudinary upload failed/disabled, storing file locally:", cloudinaryErr.message);

      // Fallback: Copy to public/uploads directory
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileName = `${Date.now()}_${path.basename(localFilePath).replace(/\s+/g, '_')}`;
      const destPath = path.join(uploadsDir, fileName);
      fs.copyFileSync(localFilePath, destPath);

      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }

      const port = process.env.PORT || 8000;
      const localUrl = `http://localhost:${port}/uploads/${fileName}`;
      return { url: localUrl, secure_url: localUrl };
    }
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};

export { uploadOnCloudinary };