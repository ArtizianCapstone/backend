const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const Artisan = require( '../models/artisan')
const Listing = require('../models/listing');

router.get('/', (req, res, next) => {
    Listing.find()
        .select('name description price creation_date')
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

router.post('/', (req, res, next) => { 
    var current_date = new Date()
    const listing = new Listing( {
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.phone_number,
        price: req.body.price,
        creation_date: current_date
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
                    creation_date: result.creation_date
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
