import multer from "multer";
import path from 'path'
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination:path.join(__dirname, 'public/uploads/'),
    filename: (req, file, cb) =>{
        cb(null, new Date().getTime()+ path.extname(file.originalname))
    }
})

const upload = multer({storage}).single('image');
export default upload