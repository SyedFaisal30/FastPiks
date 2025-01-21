import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product.model";
import { uploadCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  console.log("AddProduct API request received ");

  await dbConnect();
  console.log("Connected to the database");

  try {
    
    const formData = await request.formData();
    const name = formData.get("name")?.toString();
    const price = formData.get("price")?.toString();
    const discounted_price = formData.get("discounted_price")?.toString();
    const note = formData.get("note")?.toString() || "";
    const category = formData.get("category")?.toString();
    const stock = formData.get("stock")?.toString();

    const images = formData.getAll("images") as File[]; 

    if ( !name || !price || ! discounted_price || !category || !stock || images.length === 0) {
      return Response.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }
    
    const existingProductByName = await ProductModel.findOne({ name });

    if( existingProductByName ) {
      return Response.json(
        {
          success: false,
          message: "Product with the same name already exists.",
        },
        { status: 400 }
      );
    }

    const uploadImages = [];
    for ( const image of images ) {
      const buffer = await image.arrayBuffer();
      const uploadResult = await uploadCloudinary( Buffer.from(buffer), image.name );
      if( !uploadResult || !uploadResult.secure_url ) {
        return Response.json(
          {
            success: false,
            message: "Failed to upload one or more images to Cloudinary.",
          },
          { status: 500 }
        );
      }
      uploadImages.push( uploadResult.secure_url );
    }

    const newProduct = new ProductModel({
      name,
      price,
      discounted_price,
      images: uploadImages,
      note,
      category,
      stock,
    });

    await newProduct.save();

    console.log("Product added successfully: ", newProduct);

    return Response.json(
      {
        success: true,
        message: "Product added successfully.",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error adding product: ", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred while adding the product.",
      },
      { status: 500 }
    );
  }
}