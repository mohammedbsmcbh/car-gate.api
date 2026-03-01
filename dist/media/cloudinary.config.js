"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.configureCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const configureCloudinary = () => {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return cloudinary_1.v2;
};
exports.configureCloudinary = configureCloudinary;
//# sourceMappingURL=cloudinary.config.js.map