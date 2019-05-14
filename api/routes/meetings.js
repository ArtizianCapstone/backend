//imports
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Artisan = require('../models/artisan');
const User = require('../models/user');
const Meeting = require("../models/meeting");

//get all meetings
router.get('/', (req, res, next) => 
{
    Meeting.find()
        .populate('user', 'name')
        .populate('artisan', 'name')
        .exec()
        .then(docs =>
        {
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
        .catch(err => 
        {
            console.log(err);
            res.status(500).json(
            {
                error: err
            });
        });
});

//get specific meeting
router.get('/:meetingID', (req, res, next) =>
{
    const id = req.params.meetingID;
    Meeting.findById(id)
        .populate('user', 'name')
        .populate('artisan', 'name')
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

//get meetings for specific user
router.get("/byuser/:userID", (req, res, next) =>
{
    const usr = req.params.userID;
    Meeting.find({ user: usr })
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
                res.status(404).json({message: "No meeting found for this user"});
            }
        })
        .catch(err =>
        {
            console.log(err);
            res.status(500).json({error: err});
        });
});

//get meetings for specific user and artisan
router.get("/:userID/:artisanID", (req, res, next) =>
{
    const usr = req.params.userID;
    const art = req.params.artisanID;
    Meeting.find(
        { 
            user: usr,
            artisan: art
        })
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
                res.status(404).json({message: "No meeting between artistan and user found"});
            }
        })
        .catch(err =>
        {
            console.log(err);
            res.status(500).json({error: err});
        });
});

//create new meeting
router.post('/', (req, res, next) =>
{
    const meeting = new Meeting(
    {
        _id: new mongoose.Types.ObjectId(),
        user: req.body.userID,
        artisan: req.body.artisanID,
        date: req.body.date,
        itemsExpected: req.body.itemsExpected
    });
    meeting
        .save()
        .then(result =>
        {
            console.log(result);
            res.status(201).json(
            {
                message: "Handling POST requests to /meetings",
                createdMeeting: result
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
});

//update meeting
router.patch('/:meetingID', (req, res, next) => 
{
    const id = req.params.meetingID;
    const updateOps = {};
    for (const ops of req.body)
    {
        updateOps[ops.propName] = ops.value;
    }
    //find by ID
    Meeting.update(
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

//delete meeting
router.delete('/:meetingID', (req, res, next) => 
{
    const id = req.params.meetingID;
    Meeting.remove({_id: id})
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

//export
module.exports = router;
