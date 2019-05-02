require('./smsFramework');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Artisan = require('../models/artisan');
const User = require('../models/user');
const Meeting = require('../models/artisan');
const Listing = require('../models/listing');
const async = require("async");

var uploadFramework = require('./uploadFramework');
const upload = uploadFramework.upload;

router.get('/', (req, res, next) => {
    Artisan.find()
        .select('_id name bio phone_number image creation_date')
        .populate('user', 'name')
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err =>{ 
            res.status(500).json({
                error: err
            });
        });
});
/*
router.get('/', (req, res, next) => {
    Artisan.find()
        .select('_id name bio phone_number image creation_date')
        .populate('user', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                artisans: docs.map(doc => {
                    return {
                        _id: doc._id,
                        user: doc.user,
                        name: doc.name,
                        bio: doc.bio,
                        phone_number: doc.phone_number,
                        image: doc.image,
                        creation_date: doc.creation_date, 
                    }
                })
            });
        })
        .catch(err =>{ 
            res.status(500).json({
                error: err
            });
        });
});
*/
router.post('/', upload.single('image'), (req, res, next) => {
   console.log(req.file);
   var currentDate = new Date();
    User.findById( req.body.userId)
        .then(user => {
            if( !user)  {
                return res.status(404).json({
                    message: "User not found"
                });
            }
            const artisan = new Artisan({
                _id: mongoose.Types.ObjectId(),
                user: req.body.userId,
                name: req.body.name,
                bio: req.body.bio,
                phone_number: req.body.phone_number,
                image: req.file.path,
                creation_date: currentDate
            });
            return artisan.save();
        })
        .then(result => { 
            //console.log(testSmsFramework(4)); 
             
            User.findById(result.user).then( function(myDoc) { addArtisanText(myDoc, result); }); 
            
            console.log( result);
            res.status(201).json({
                message: 'Artisan stored',
                createdOrder: {
                    _id: result._id,
                    user: result.user,
                    name: result.name,
                    bio: result.bio,
                    phone_number: result.phone_number,
                    image: result.image,
                    creation_date: result.creation_date,
                }, 
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    });

router.post('/noimage', (req, res, next) => {
   var currentDate = new Date();
    User.findById( req.body.userId)
        .then(user => {
            if( !user)  {
                return res.status(404).json({
                    message: "User not found"
                });
            }
            const artisan = new Artisan({
                _id: mongoose.Types.ObjectId(),
                user: req.body.userId,
                name: req.body.name,
                bio: req.body.bio,
                phone_number: req.body.phone_number,
                creation_date: currentDate
            });
            return artisan.save();
        })
        .then(result => { 
            //console.log(testSmsFramework(4)); 
             
            //User.findById(result.user).then( function(myDoc) { addArtisanText(myDoc, result); }); 
            
            console.log( result);
            res.status(201).json({
                message: 'Artisan stored',
                createdOrder: {
                    _id: result._id,
                    user: result.user,
                    name: result.name,
                    bio: result.bio,
                    phone_number: result.phone_number,
                    creation_date: result.creation_date,
                }, 
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});



router.get('/:artisanId', (req, res, next) => {
    const id = req.params.artisanId;
    Artisan.findById(id)
        .populate("User")
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
        
        /*
    Artisan.findById(req.params.artisanId)
        .populate( 'User')
        .exec()
        .then( artisan => {
            if( !artisan ) {
                return res.status(404).json({
                    message: 'Artisan not found'
                });
            }
            res.status(200).json({
                artisan: artisan
            });
        })
        .catch( err => {
            res.status(500).json({
                error: err
            });
        });
        */
});

/*
router.patch('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated order!'
    });
});
*/

//update artisan
router.patch('/:artisanID', (req, res, next) => 
{
    const id = req.params.artisanID;
    const updateOps = {};
    for (const ops of req.body)
    {
        updateOps[ops.propName] = ops.value;
    }
    //find by ID
    Artisan.update(
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


router.delete('/:artisanId', (req, res, next) => {
    var art = req.params.artisanId;
    Artisan.findById(art, (err, artisan) =>
    {
        Metting.remove(
        {
            "_id": { $in: artisan._id }
        }, (err, artisan) =>
        {
            Listing.remove(
            {
                "_id": { $in: artisan._id }
            }, err =>
            {
                if (err) return next(err);
                artisan.remove();
            })
            if (err) return next(err);
        })
    });


/*
    async.series(
    [
        function(cb)
        {
            Meeting.deleteMany({ artisan: art }, cb);
            /*.exec().then(result =>
            {
                res.status(200).json(result);
                {
                    message: "Deleted listings",
                    request:
                    {
                        type: "DELETE",
                        url: "http://localhost:3000/artisans"
                    }
                });
            })
            .catch(err =>
            {
                console.log(err);
                res.status(500).json(
                {
                    error: err
                });
            });
        },
        function(cb)
        {
            Listing.deleteMany({ artisan: art }, cb);
            /*.exec().then(result =>
            {
                res.status(200).json(result);
                {
                    message: "Deleted meetings",
                    request:
                    {
                        type: "DELETE",
                        url: "http://localhost:3000/artisans"
                    }
                });
            })
            .catch(err =>
            {
                console.log(err);
                res.status(500).json(
                {
                    error: err
                });
            });
        },
        function(cb)
        {
            Artisan.deleteOne({ _id: art }).exec().then(result => 
            {
                res.status(200).json(result);
                /*
                {
                    message: 'Artisan deleted',
                    request: 
                    {
                        type: "DELETE",
                        url: "http://localhost:3000/artisans"//,
                    }
                });
            })
            .catch(err =>
            {
                console.log(err);
                res.status(500).json(
                {
                    error: err
                });
            });
        }
    ]);
    */
});

module.exports = router;
