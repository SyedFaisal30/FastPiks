import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (fileBuffer: Buffer, fileName: string) => {
  try {
    if (!fileBuffer) return null;

    // Convert the buffer into a stream using streamifier
    const stream = streamifier.createReadStream(fileBuffer);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "products", // Cloudinary folder
          public_id: `products/${fileName}`, // Custom public ID
          resource_type: "image", // Upload as image
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Pipe the buffer to the upload stream
      stream.pipe(uploadStream);
    });

    return uploadResult;
  } catch (error) {
    console.error("Error uploading to Cloudinary: ", error);
    return null;
  }
};

export { uploadCloudinary };
