const express = require('express');
const router = express();
const ArtData = require('./model');


const multer = require('multer');
const path = require('path')
const DIR = './images';


require('dotenv').config()
require('./cloudinary')

const cloudinary = require('cloudinary');


// Storage
// 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, path.join(__dirname, DIR) );
    },
    filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
    }
});
// Storage ends here


const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif" || file.mimetype == "image/tiff") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}
// Multer Starts Here
var upload = multer({
    storage: storage,
    limits:{fileSize: 1024 * 1024 * 5},
    fileFilter: fileFilter
});
// Multer Ends Here


// get all artworks
router.get('/all', async (req, res, next) => {
    const artworks = await ArtData.find()

    try {
        if (artworks) {
            res.status(200).json(artworks)
        } else if (!user) {
            res.status(200).json({message})
        }

    } catch (error) {
        error.status = 400; 
        next(error)
    }
})

// get artworks by id
router.get('/:id', async (req, res, next) => {
    const id = req.params.id

    try {
        const artwork = await ArtData.findById(id)
        res.status(200).json(artwork)

    } catch (error) {
        error.status = 400; 
        next(error)
    }
})



// add new artwork
router.post('/add', upload.single('image'), async (req, res, next) => {        
	if (req.file) {
		const Artwork = await cloudinary.uploader.upload(req.file.path)
	
		const addArtwork = await new ArtData({
			title: req.body.title,
			description: req.body.description,
			select: req.body.select,
			date: req.body.date,
			image: Artwork.secure_url
		})

		addArtwork.save()
        
        try {
            res.status(200).json(addArtwork)
        } catch (error) {
            res.status(400).json(error)
        }

	} else {
        const addArtwork = await new ArtData({
            title: req.body.title,
            description: req.body.description,
            select: req.body.select,
            date: req.body.date,
            image: null
        })

        addArtwork.save()

        try {
            res.status(200).json(addArtwork)

        } catch (error) {
            res.status(400).json(error)
        }
    }
    
})

// update artwork
router.put('/update/:id', upload.single('image'), async (req, res, next) => {

    if (req.file) {
        const Artwork = await cloudinary.uploader.upload(req.file.path)

        ArtData.findByIdAndUpdate(req.params.id)
        .then((data) => {
            data.title = req.body.title
            data.description = req.body.description
            data.select = req.body.select
            data.date = req.body.date
            data.image = Artwork.secure_url

            data.save()
            .then(() => res.json('Art Updated'))
            .catch((err) => res.status(404).json(err))
        })

        
    } else {
        ArtData.findByIdAndUpdate(req.params.id)
        .then((data) => {
            data.title = req.body.title
            data.description = req.body.description
            data.select = req.body.select
            data.date = req.body.date
            data.image = null

            data.save()
            .then(() => res.json('Art Updated'))
            .catch((err) => res.status(404).json(err))
        })
    }
})

// delete artwork
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleteArtData = await ArtData.findByIdAndRemove(id);
        res.status(200).json(deleteArtData)
    } catch (error) {
        res.status(500).json(error)
    }

});


module.exports = router