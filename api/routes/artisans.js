require('./smsFramework')();
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Artisan = require('../models/artisan');
const User = require('../models/user');

var uploadFramework = require('./uploadFramework');
const upload = uploadFramework.upload;

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

router.get('/:artisanId', (req, res, next) => {
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
});

router.patch('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated order!'
    });
});

router.delete('/:artisanId', (req, res, next) => {
    Artisan.remove({_id: req.params.artisanId })
        .exec()
        .then( result => {
            res.status(200).json({
                message: 'Artisan deleted',
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders"//,
                    //body: { ProductId: 'ID', quantity: 'Number'}
                }
            });
        })
});



module.exports = router;
