import { uploadCloudinary } from "./cloudinary"; // Import the function

// Function to upload multiple images
export const uploadImages = async (images: string[]): Promise<string[]> => {
  try {
    // Assuming `images` are base64 encoded strings (you can adjust this part if you're using file buffers directly)
    const uploadedImages = await Promise.all(
      images.map(async (image, index) => {
        const imageBuffer = Buffer.from(image, "base64"); // Convert base64 to Buffer (if applicable)
        const fileName = `image_${index + 1}`; // You can use a custom naming scheme
        const uploadResult = await uploadCloudinary(imageBuffer, fileName); // Upload image
        return uploadResult?.secure_url; // Return the secure URL
      })
    );

    return uploadedImages.filter((url) => url != null); // Filter out any null results
  } catch (error) {
    console.error("Cloudinary upload error: ", error);
    throw new Error("Error uploading images");
  }
};
