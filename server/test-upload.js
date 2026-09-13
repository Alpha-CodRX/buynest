import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

try {
    const result = await cloudinary.uploader.upload(
        "./iphone.png",
        {
            folder: "nextcart/test",
        }
    );

    console.log("UPLOAD SUCCESS");
    console.log(result.secure_url);

} catch (error) {
    console.log("UPLOAD FAILED");
    console.log(error);
}