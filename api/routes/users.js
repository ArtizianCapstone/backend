const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');
const Artisan = require( '../models/artisan')

router.get('/', (req, res, next) => {
    User.find()
        .select('name phone_number creation_date')
        .exec()
        .then( docs => {
            const response = {
                count: docs.length,
                users: docs.map( doc => {
                    return {
                        _id: doc._id, 
                        name: doc.name,
                        phone_number: doc.phone_number,
                        creation_date: doc.creation_date,
                        request: {
                            use: 'Request specific user.',
                            type: 'GET',
                            url: 'http://localhost:3000/users/' + doc._id
                        }
                    }
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
/*
router.get('/', (req, res, next) => {
    User.find()
        .select('name phone_number creation_date')
        .exec()
        .then( docs => {
            const response = docs.map( doc => {
                    return {
                        _id: doc._id, 
                        name: doc.name,
                        phone_number: doc.phone_number,
                        creation_date: doc.creation_date,
                        
                    }
                })
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
*/
router.post('/', (req, res, next) => { 
    var current_date = new Date()
    const user = new User( {
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        phone_number: req.body.phone_number,
        creation_date: current_date
    });
    user
        .save()
        .then( result => {
            console.log(result);
            res.status(201).json({
                message: 'Created user successfully',
                createdUser: {
                    _id: result._id,
                    name: result.name,
                    phone_number: result.phone_number,
                    creation_date: result.creation_date,
                    request: {
                        use: 'Request specific user',
                        type: 'GET',
                        url: "http://localhost:3000/users/" + result._id
                    }
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

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .select( '_id name phone_number creation_date' )
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if( doc ) {
                res.status(200).json({
                    user: doc,
                    request: {
                        use: 'Request all users',
                        type: 'GET',
                        url: 'http://localhost:3000/users'
                    }
                });
            }
            else {
                res.status(404).json({message: 'No valid entry found for provided ID'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.get('/:userId/artisans', (req, res, next) => {
    const id = req.params.userId;
    Artisan.find({user: id})
        .select('_id name bio phone_number image creation_date')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if( doc ) {
                res.status(200).json( doc );
            }
            else {
                res.status(404).json({message: 'No valid entry found for provided ID'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

//update user
router.patch('/:userID', (req, res, next) => 
{
    const id = req.params.userID;
    const updateOps = {};
    for (const ops of req.body)
    {
        updateOps[ops.propName] = ops.value;
    }
    //find by ID
    User.update(
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

/*
router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for( const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    User.update({ _id: id }, { $set: updateOps } )
        .exec()
        .then( result  => {
            console.log( result );
            res.status(200).json({
                message: 'User updated',
                request: {
                    use: 'Request specific user',
                    type: 'GET',
                    url: 'http://localhost:3000/products' + id
                }
            });
        })
        .catch(err => {
            console.log( err);
            res.status(500).json( {
                error: err
            });
        })
});
*/

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted',
                request: {
                    use: 'Create new user.',
                    type: 'POST',
                    url: 'http://localhost:3000/users',
                    body: {name: 'String', phone_number: 'String' }
                }
            });
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err 
            });
        });
});



module.exports = router;
