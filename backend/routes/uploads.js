const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// using diskStorage instead of memory storage

// destination stores the directory name where file is uploaded
// request object, file object, and callback
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const dir = path.join(__dirname, '../uploads');

    // if it doesn't exist, create fs for us
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, {recursive: true}) // this will automatically create an upload folder if it doesn't already exist
    }
    callback(null, dir)
  },
  filename: (req, file, callback) => {
    // second parameter is the file name, to get a unique name, use Date and filename
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage })

// adding a middleware with receiving the multer upload instance, it is single because we're only sending one file
router.post('/', upload.single('image'), (req, res) => {
    console.log(req.file)
    if(!req.file){
        return res.status(400).json( {
            success: false,
            message: 'No file was uploaded'
        });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({
        success: true,
        url: fileUrl
    });
    
});

module.exports = router;
