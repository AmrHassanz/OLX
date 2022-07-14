const multer = require('multer'); 
const path = require('path');     
const { nanoid } = require('nanoid'); 
const fs = require('fs'); 
const multerPath = {
    profilePic: 'users/profile/pic',
    coverPic: 'users/profile/cov',
    product:'/product'
}
const multerValidators = {
    image: ['image/jpeg', 'image/jpg', 'image/png'],
    pdf: ['application/pdf']
}

// handle multer error (middleware)
const HME = (err, req, res, next) => {
    if (err) {
        res.status(400).json({ message: 'multer error', err })
    }
    else {
        next();
    }
}


function myMulter(customPath, customValidator) {

    if (!customPath || customPath == null) {
        customPath = 'general';
    }

    const fullPath = path.join(__dirname, `../uploads/${customPath}`);

    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            req.finalDistination = `uploads/${customPath}`;
            cb(null, fullPath); 
        },
        filename: function (req, file, cb) {
            cb(null, nanoid() + '_' + file.originalname);
        }
    })

    const fileFilter = function (req, file, cb) {
        if (customValidator.includes(file.mimetype)) {
            cb(null, true);
        } else {
            req.fileErr = true; 
            cb(null, false);
        }
    }

    const upload = multer({ dest: fullPath, limits: { fileSize: 2e+6 }, fileFilter, storage });

    return upload;
}

module.exports = { myMulter, multerValidators, multerPath, HME };
