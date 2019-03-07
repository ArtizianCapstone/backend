//imports
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Artisan = require('../models/artisan');
const User = require('../models/user');
const Order = require('../models/order');

//get all orders
router.get("/", (req, res, next) =>
{
    Order.find()
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

//get specific order
router.get("/:orderID", (req, res, next) =>
{
    const id = req.params.orderID;
    Order.findById(id)
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

//get order by listing
router.get("/bylisting/:listingID", (req, res, next) =>
{
    const lst = req.params.listingID;
    Order.find({ listing: lst })
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
                res.status(404).json({message: "No orders found for this listing"});
            }
        })
        .catch(err =>
        {
            console.log(err);
            res.status(500).json({error: err});
        });
});

//make new order
router.post("/", (req, res, next) =>
{
    const currDate = new Date();
    const order = new Order(
    {
        _id: new mongoose.Types.ObjectId(),
        user: req.body.userID,
        artisan: req.body.artisanID,
        listing: req.body.listingID,
        date_ordered: currDate,
        paid: false,
        date_paid: null,
        shipped: false,
        date_shipped: null
    });
    order.save()
        .then(result =>
        {
            console.log(result);
            res.status(201).json(
            {
                message: "Created new Order",
                createdOrder: result
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

//update order
router.patch("/:orderID", (req, res, next) =>
{
    const id = req.params.orderID;
    const updateOps = {};
    for (const ops of req.body)
    {
        updateOps[ops.propName] = ops.value;
    }
    //find by ID
    Order.update(
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

//delete order
router.delete("/:orderID", (req, res, next) =>
{
    const id = req.params.orderID;
    Order.remove({_id: id})
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
