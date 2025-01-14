import cloudinary from "./cloudinary";

// Explicitly type the `img` parameter to avoid implicit `any` error
export const uploadImages = async (images: string[]): Promise<string[]> => {
  try {
    const uploadedImages = await Promise.all(
      images.map((image: string) =>
        cloudinary.uploader.upload(image, { tags: "product_images" })
      )
    );

    return uploadedImages.map((img: { secure_url: string }) => img.secure_url); // Return the URLs
  } catch (error) {
    console.error("Cloudinary upload error: ", error);
    throw new Error("Error uploading images");
  }
};
