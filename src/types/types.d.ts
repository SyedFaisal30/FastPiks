
// types.d.ts or a custom types file
import { NextApiRequest } from "next";

declare module "next" {
  interface NextApiRequest {
    files: Express.Multer.File[]; // Array of files, adjust based on your needs
  }
}
