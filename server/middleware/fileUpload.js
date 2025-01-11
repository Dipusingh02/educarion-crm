import multer from "multer";
import XLSX from "xlsx";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      const fileTypes = /xlsx|xls/;
      const extName = fileTypes.test(file.originalname.toLowerCase());
      const mimeType = fileTypes.test(file.mimetype);
      if (extName && mimeType) {
          cb(null, true);
      } else {
          cb(new Error("Only Excel files are allowed!"));
      }
  },
});
export { upload };