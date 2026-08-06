import streamifier from "streamifier";
import cloudinary from "../config/cloudinary";

export function uploadToCloudinary(buffer, folder) {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(

            {

                folder,

                resource_type: "auto"

            },

            (error, result) => {

                if (error) return reject(error);

                resolve(result);

            }

        );

        streamifier.createReadStream(buffer).pipe(stream);

    });

}