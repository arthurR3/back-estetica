import cloudinary from "../config/cloudinary.js";
import fs from 'fs'

class ImageUploadService {
    constructor(){
        this.cloudinary = cloudinary;
    }

    async uploadImage(filePath, folderName){
        try {
            const result = await this.cloudinary.uploader.upload(filePath,{
                folder: folderName,
                use_filename: true
            });
            // Se elimina el archivo local despues de subirlo a cloudinary
            fs.unlinkSync(filePath);
            return result.secure_url;
        } catch (error) {
            throw new Error(`Error al subir la imagen: ${error.message}`);
        }
    }

}
export default ImageUploadService;