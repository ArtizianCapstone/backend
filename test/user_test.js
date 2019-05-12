//this file will contain tests, but not yet
const assert = require('assert');
const mongoose = require('mongoose');
var request = require("supertest");
var app = require('../app');
var async = require("async");
const User = require('../api/models/user');

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

    it("Clears user for tests", function(done)
    {
        User.remove({ _id: id})
            .then(() => User.findOne({ name: "John Johnson"}))
            .then(found =>
            {
                assert(found === null);
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
            .expect(
            {
                count: 0,
                users: []
            })
            .expect(200)
            .end(done);
    });

    //get specific empty
    it("Fails to get a user that doesn't exist", function(done)
    {
        request(app)
            .get("/users/111111111111111111111111")
            .expect(404)
            .end(done);
    });

    //post
    it("Creates a new user and finds with GET", function(done)
    {
        var usr, date;
        async.series(
        [
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Cash Moneybags",
                        phone_number: "555",
                        password: "gr33d1sg00d",
                    })
                    .expect(res => usr = res.body.createdUser._id)
                    .expect(res => date = res.body.createdUser.creation_date)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .get("/users/" + usr)
                    .expect(
                    {
                        user:
                        {
                            _id: usr,
                            password: "gr33d1sg00d",
                            name: "Cash Moneybags",
                            phone_number: "555",
                            creation_date: date
                        },
                        request:
                        {
                            use: "Request all users",
                            type: "GET",
                            url: "http://localhost:3000/users"
                        }
                    })
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/users/" + usr)
                    .expect(200, cb);
            }
        ], done);
    });

    it("Gets a list of several users", function(done)
    {
        var u1, u2, u3, d1, d2, d3;
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
                    .expect(res => u1 = res.body.createdUser._id)
                    .expect(res => d1 = res.body.createdUser.creation_date)
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
                    .expect(res => u2 = res.body.createdUser._id)
                    .expect(res => d2 = res.body.createdUser.creation_date)
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
                    .expect(res => u3 = res.body.createdUser._id)
                    .expect(res => d3 = res.body.createdUser.creation_date)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .get("/users")
                    .expect(
                    {
                        count: 3,
                        users:
                        [
                            {
                                _id: u1,
                                name: "Dylan Clandale",
                                password: "First dog's name",
                                phone_number: "789",
                                creation_date: d1
                            },
                            {
                                _id: u2,
                                name: "Seymore Asses",
                                password: "iWillWait4U",
                                phone_number: "3000",
                                creation_date: d2
                            },
                            {
                                _id: u3,
                                name: "Snake Vargas",
                                password: "justice",
                                phone_number: "2087",
                                creation_date: d3
                            }
                        ]
                    })
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/users/" + u1)
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/users/" + u2)
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/users/" + u3)
                    .expect(200, cb);
            }
        ], done);
    });

    it("Can iteratively update properties on a user", function(done)
    {
        var usr, date;
        async.series(
        [
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Some Guy",
                        password: "weak",
                        phone_number: "0"
                    })
                    .expect(res => usr = res.body.createdUser._id)
                    .expect(res => date = res.body.createdUser.creation_date)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .patch("/users/" + usr)
                    .send(
                    [
                        { propName: "name", value: "Someone Else" },
                        { propName: "password", value: "b3T3r" }
                    ])
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .get("/users/" + usr)
                    .expect(
                    {
                        request:
                        {
                            type: "GET",
                            url: "http://localhost:3000/users",
                            use: "Request all users"
                        },
                        user:
                        {
                            _id: usr,
                            name: "Someone Else",
                            password: "b3T3r",
                            phone_number: "0",
                            creation_date: date
                        }
                    })
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/users/" + usr)
                    .expect(200, cb);
            }
        ], done);
    });

    it("Can get artisans by user", function(done)
    {
        var u1, u2, a1, a2, a3, date1, date2;
        async.series(
        [
            //build users
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
                    .expect(res => u1 = res.body.createdUser._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Some Guy",
                        password: "weak",
                        phone_number: "0"
                    })
                    .expect(res => u2 = res.body.createdUser._id)
                    .expect(201, cb);
            },
            //build artisans
            function(cb)
            {
                request(app)
                    .post("/artisans/noimage")
                    .send(
                    {
                        userId: u1,
                        name: "Arsty",
                        bio: "Never graduated",
                        phone_number: "789"
                    })
                    .expect(res => a1 = res.body.createdArtisan._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/artisans/noimage")
                    .send(
                    {
                        userId: u2,
                        name: "Fartsy",
                        bio: "Likes beans too much",
                        phone_number: "22"
                    })
                    .expect(res => a2 = res.body.createdArtisan._id)
                    .expect(res => date1 = res.body.createdArtisan.creation_date)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/artisans/noimage")
                    .send(
                    {
                        userId: u2,
                        name: "Smartsy",
                        bio: "Can't even draw a stick figure",
                        phone_number: "314265"
                    })
                    .expect(res => a3 = res.body.createdArtisan._id)
                    .expect(res => date2 = res.body.createdArtisan.creation_date)
                    .expect(201, cb);
            },
            //find artisans by user
            function(cb)
            {
                request(app)
                    .get("/users/" + u2 + "/artisans")
                    .expect(
                    [ 
                        {
                            "_id": a2,
                            "name": "Fartsy",
                            "bio": "Likes beans too much",
                            "phone_number": "22",
                            "creation_date": date1
                        },
                        {
                            "_id": a3,
                            "name": "Smartsy",
                            "bio": "Can't even draw a stick figure",
                            "phone_number": "314265",
                            "creation_date": date2
                        }
                    ])
                    .expect(200, cb);
            },
            //delete all
            function(cb)
            {
                request(app)
                    .del("/users/" + u1)
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/users/" + u2)
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/artisans/" + a1)
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/artisans/" + a2)
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/artisans/" + a3)
                    .expect(200, cb);
            }
        ], done);
    });

    //deletes nonexistant
    it("Fails to get a user that doesn't exist", function(done)
    {
        request(app)
            .del("/users/111111111111111111111111")
            .expect(200)
            .end(done);
    });
});
