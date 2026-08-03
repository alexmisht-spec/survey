import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = "uploads/verification";

// Create upload directory if it doesn't exist
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, uploadPath);

    },

    filename(req, file, cb) {

        const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;

        cb(null, uniqueName);

    }

});

// Allowed file types
const fileFilter = (req, file, cb) => {

    const allowedTypes = new Set([
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "application/pdf"
    ]);

    if (allowedTypes.has(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error("Only JPG, JPEG, PNG, WEBP and PDF files are allowed."), false);

    }

};

// Export upload middleware
const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024 // 5 MB

    }

});

export default upload;