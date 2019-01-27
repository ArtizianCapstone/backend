const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (rq, file, cb) => {
    //reject file
    if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage, 
    limits:  {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const User = require('../models/user');
const Artisan = require( '../models/artisan')
const Listing = require('../models/listing');

//get all listings
router.get('/', (req, res, next) => {
    Listing.find()
        .select('name description price listingImage creation_date')
        .exec()
        .then( docs => {
            const response = {
                count: docs.length,
                listings: docs.map( doc => {
                    return doc;
                })
            };
            console.log(docs);
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
//post a listing
router.post('/', upload.single('listingImage'),(req, res, next) => { 
    console.log(req.file);
    var current_date = new Date()
    const listing = new Listing( {
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.phone_number,
        price: req.body.price,
        creation_date: current_date,
        listingImage: req.file.path
    });
    listing
        .save()
        .then( result => {
            console.log(result);
            res.status(201).json({
                message: 'Created listing successfully',
                createdListing: {
                    _id: result._id,
                    name: result.name,
                    description: result.description,
                    price: result.price,
                    creation_date: result.creation_date,
                    listingImage: result.listingImage
                    /*
                    request: {
                        use: 'Request specific user',
                        type: 'GET',
                        url: "http://localhost:3000/users/" + result._id
                    }*/
                }
            });
        })
        .catch( err => { 
            console.log( err );
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;
