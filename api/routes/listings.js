const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const Artisan = require( '../models/artisan')
const Listing = require('../models/listing');

var uploadFramework = require('./uploadFramework');
const upload = uploadFramework.upload;

//get all listings
router.get('/', (req, res, next) => {
    Listing.find()
//      .select('name description price listingImage creation_date')
        .populate("User")
        .populate("Artisan")
        .populate('user', 'name')
        .populate('artisan', 'name')
        .exec()
        .then( docs => {
        /*
            const response = {
                count: docs.length,
                listings: docs.map( doc => {
                    return doc;
                })
            };
            console.log(docs);
            res.status(200).json(response);
        })
        */  
            console.log(docs);
            if (docs.length >= 0)
            {
                res.status(200).json(docs);
            }
            else
            {
                res.status(404).json(
                {
                    message: "No entries found"
                })
            }
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
        user: req.body.userID,
        artisan: req.body.artisanID,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
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

//post a listing no image
router.post('/noimage',(req, res, next) => { 
    var current_date = new Date()
    const listing = new Listing( {
        _id: new mongoose.Types.ObjectId(),
        user: req.body.userID,
        artisan: req.body.artisanID,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        creation_date: current_date
    });
    listing
        .save()
        .then( result => {
            console.log(result);
            res.status(201).json({
                message: 'Created listing successfully',
                createdListing: result 
            });
        })
        .catch( err => { 
            console.log( err );
            res.status(500).json({
                error: err
            });
        });
});

//get specific listing
router.get("/:listingID", (req, res, next) =>
{
    const id = req.params.listingID;
    Listing.findById(id)
        .populate("User")
        .populate("Artisan")
        .populate('artisan', 'name')
        .populate('user', 'name')
        .exec()
        .then(doc =>
        {
            console.log("From database", doc);
            if (doc)
            {
                res.status(200).json(doc);
            }
            else
            {
                res.status(404).json({message: "No valid entry found for provided ID"});
            }
        })
        .catch(err =>
        {
            console.log(err);
            res.status(500).json({error: err});
        });
});

//get listings by user
router.get("/byuser/:userID", (req, res, next) =>
{
    const usr = req.params.userID;
    Listing.find({ user: usr })
        .populate("User")
        .populate("Artisan")
        .populate('user', 'name')
        .populate('artisan', 'name')
        .exec()
        .then(doc =>
        {
            console.log("Finding by user", doc);
            if (doc)
            {
                res.status(200).json(doc);
            }
            else
            {
                res.status(404).json({message: "No listing found for this user"});
            }
        })
        .catch(err =>
        {
            console.log(err);
            res.status(500).json({error: err});
        });
});

//get listings for specific user and artisan
router.get("/:userID/:artisanID", (req, res, next) =>
{
    const usr = req.params.userID;
    const art = req.params.artisanID;
    Listing.find(
        { 
            user: usr,
            artisan: art
        })
        .populate("User")
        .populate("Artisan")
        .populate('user', 'name')
        .populate('artisan', 'name')
        .exec()
        .then(doc =>
        {
            console.log("Finding by user and artisan", doc);
            if (doc)
            {
                res.status(200).json(doc);
            }
            else
            {
                res.status(404).json({message: "No listing between artistan and user found"});
            }
        })
        .catch(err =>
        {
            console.log(err);
            res.status(500).json({error: err});
        });
});

//update listing
router.patch("/:listingID", (req, res, next) =>
{
    const id = req.params.listingID;
    const updateOps = {};
    for (const ops of req.body)
    {
        updateOps[ops.propName] = ops.value;
    }
    //find by ID
    Listing.update(
    {
        _id: id
    },
    {
        //set each member
        $set: updateOps
    })
    .exec()
    .then(result =>
    {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err =>
    {
        console.log(err);
        res.status(500).json(
        {
            error: err
        });
    });
});

//delete listing
router.delete("/:listingID", (req, res, next) =>
{
    const id = req.params.listingID;
    Listing.remove({_id: id})
        .exec()
        .then(result =>
        {
            res.status(200).json(result);
        })
        .catch(err =>
        {
            console.log(err);
            res.status(500).json(
            {
                error: err
            });
        });
});

module.exports = router;
