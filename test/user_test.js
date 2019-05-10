//this file will contain tests, but not yet
const assert = require('assert');
const mongoose = require('mongoose');
var request = require("supertest");
var async = require("async");
//const User = require('../api/models/user');

describe("Test Framework", function()
{
    var current_date = new Date();
    var id = new mongoose.Types.ObjectId();

    //create tests
    it("can access database", function(done)
    {
        var usr = new User(
        {
            _id: id,
            name: "John Johnson",
            password: "Johnson & Johnson",
            phone_number: "9999",
            creation_date: current_date
        });

        usr.save()
            .then(function()
            {
                assert(usr.isNew === false);
                done();
            });

    });
});

describe("Tests the User request handling", function()
{
    //get
    it("Gets empty list", function(done)
    {
        request(app)
            .get("/users")
            .expect(res => res.body.count, "0")
            .expect(200)
            .end(done);
    });

    //get specific empty
    it("Fails to get an artisan that doesn't exist", function(done)
    {
        request(app)
            .get("/artisans/111111111111111111111111")
            .expect(404)
            .end(done);
    });

    //post
    it("Creates a new user and finds with GET", function(done)
    {
        var usr, art;
        async.series(
        [
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Cash Moneybags",
                        phone_number: "555"
                        password: "gr33d1sg00d",
                    })
                    //.set("Accept", "application/json")
                    .expect(res => usr = res.body.createdUser._id)
                    .expect(res => res.body.createdUser.name, "Cash Moneybags")
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .get("/users/" + usr)
                    .expect(res => res.body.password, "gr33d1sg00d")
                    .expect(201, cb);
            }
        ], done);
    });

    it("Gets a list of several users", function(done)
    {
        async.series(
        [
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Dylan Clandale",
                        password: "First dog's name",
                        phone_number: "789"
                    })
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Seymore Asses",
                        password: "iWillWait4U",
                        phone_number: "3000"
                    })
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Snake Vargas",
                        password: "justice",
                        phone_number: "2087"
                    })
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .get("/users")
                    .expect(res => res.body.count, "3")
                    .expect(200, cb);
            }
        ], done);
    });
});
