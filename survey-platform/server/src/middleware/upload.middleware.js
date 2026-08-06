import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = "uploads/verification";

if (!fs.existsSync(uploadPath)) {

    fs.mkdirSync(uploadPath, {

        recursive: true

    });

}

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

const fileFilter = (req, file, cb) => {

    const allowed = [

        "image/jpeg",

        "image/jpg",

        "image/png",

        "image/webp",

        "application/pdf"

    ];

    if (allowed.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error("Invalid file type"));

    }

};

export default multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024

    }

});