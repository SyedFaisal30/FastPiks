import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload image using stream
const uploadCloudinary = async (fileBuffer: Buffer, fileName: string) => {
  try {
    if (!fileBuffer) return null;

    // Convert the buffer into a stream using streamifier
    const stream = streamifier.createReadStream(fileBuffer);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      // Upload stream to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "products", // Cloudinary folder
          public_id: `products/${fileName}`, // Custom public ID
          resource_type: "image", // Upload as image
        },
        (error, result) => {
          if (error) reject(error);  // Reject if an error occurs
          else resolve(result);      // Resolve with the upload result
        }
      );

      // Pipe the buffer to the upload stream
      stream.pipe(uploadStream);
    });

    return uploadResult; // Return the upload result (which includes secure_url)
  } catch (error) {
    console.error("Error uploading to Cloudinary: ", error);
    return null;
  }
};

export { uploadCloudinary };
