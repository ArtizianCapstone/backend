//unit tests for artisans
var request = require("supertest");
var async = require("async");
var app = require('../app');
var assert = require("assert");
//var User = require("../api/models/user");
var Artisan = require("../api/models/artisan");

describe("Tests artisan", function()
{
    //get
    it("Gets empty list", function(done)
    {
        Artisan.remove({}).exec();
        request(app)
            .get("/artisans")
            .expect([])
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
    it("Creates a new artisan and finds with GET", function(done)
    {
        var usr, art, date;
        async.series(
        [
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Cash Moneybags",
                        password: "gr33d1sg00d",
                        phone_number: "555"
                    })
                    .expect(res => usr = res.body.createdUser._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/artisans/noimage")
                    .send(
                    {
                        userId: usr,
                        name: "Toan Deph",
                        bio: "Half-orc bard",
                        phone_number: "98754"
                    })
                    .expect(res => art = res.body.createdArtisan._id)
                    .expect(res => date = res.body.createdArtisan.creation_date)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .get("/artisans/" + art)
                    .expect(
                    {
                        __v: 0,
                        _id: art,
                        bio: "Half-orc bard",
                        creation_date: date,
                        name: "Toan Deph",
                        phone_number: "98754",
                        user:
                        {
                            _id: usr,
                            name: "Cash Moneybags"
                        }
                    })
                    .expect(200, cb);
            },
            //cleanup
            function(cb)
            {
                request(app)
                    .del("/artisans/" + art)
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

    it("Can get a list of artisans", function(done)
    {
        Artisan.remove({}).exec();
        var usr, art1, art2, art3, date1, date2, date3;
        async.series(
        [
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Cash Moneybags",
                        password: "gr33d1sg00d",
                        phone_number: "555"
                    })
                    .expect(res => usr = res.body.createdUser._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/artisans/noimage")
                    .send(
                    {
                        userId: usr,
                        name: "Toan Deph",
                        bio: "Half-orc bard",
                        phone_number: "98754"
                    })
                    .expect(res => res.body.createdArtisan.user, usr)
                    .expect(res => art1 = res.body.createdArtisan._id)
                    .expect(res => date1 = res.body.createdArtisan.creation_date)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/artisans/noimage")
                    .send(
                    {
                        userId: usr,
                        name: "One-Eyed Jack",
                        bio: "Gambler",
                        phone_number: "595"
                    })
                    .expect(res => art2 = res.body.createdArtisan._id)
                    .expect(res => date2 = res.body.createdArtisan.creation_date)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/artisans/noimage")
                    .send(
                    {
                        userId: usr,
                        name: "Dixon",
                        bio: "Best wooden pencils you'll ever use",
                        phone_number: "2"
                    })
                    .expect(res => art3 = res.body.createdArtisan._id)
                    .expect(res => date3 = res.body.createdArtisan.creation_date)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .get("/artisans")
                    .expect(
                    [
                        {
                            _id: art1,
                            bio: "Half-orc bard",
                            creation_date: date1,
                            name: "Toan Deph",
                            phone_number: "98754",
                            user:
                            {
                                _id: usr,
                                name: "Cash Moneybags"
                            }
                        },
                        {
                            _id: art2,
                            bio: "Gambler",
                            creation_date: date2,
                            name: "One-Eyed Jack",
                            phone_number: "595",
                            user:
                            {
                                _id: usr,
                                name: "Cash Moneybags"
                            }
                        },
                        {
                            _id: art3,
                            bio: "Best wooden pencils you'll ever use",
                            creation_date: date3,
                            name: "Dixon",
                            phone_number: "2",
                            user:
                            {
                                _id: usr,
                                name: "Cash Moneybags"
                            }
                        }
                    ])
                    .expect(200, cb);
            },
            //cleanup
            function(cb)
            {
                request(app)
                    .del("/artisans/" + art1)
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/artisans/" + art2)
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/artisans/" + art3)
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

    //patch
    it("Can iteratively update the properties of an Artisan", function(done)
    {
        var usr, art, date;
        async.series(
        [
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Cash Moneybags",
                        password: "gr33d1sg00d",
                        phone_number: "555"
                    })
                    .expect(res => usr = res.body.createdUser._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/artisans/noimage")
                    .send(
                    {
                        userId: usr,
                        name: "Toan Deph",
                        bio: "Half-orc bard",
                        phone_number: "98754"
                    })
                    .expect(res => art = res.body.createdArtisan._id)
                    .expect(res => date = res.body.createdArtisan.creation_date)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .patch("/artisans/" + art)
                    .send(
                    [
                        { propName: "name", value: "Someone Else" },
                        { propName: "phone_number", value: "5"}
                    ])
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .get("/artisans/" + art)
                    .expect(
                    {
                        _id: art,
                        user:
                        {
                            _id: usr,
                            name: "Cash Moneybags"
                        },
                        name: "Someone Else",
                        bio: "Half-orc bard",
                        phone_number: "5",
                        creation_date: date,
                        __v: 0
                    })
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/artisans/" + art)
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

    //delete
    it("Deletes pertinent meetings and listings along with deleted artisan", function(done)
    {
        var usr, art, list1, list2, meet1, meet2;
        var today = new Date();

        async.series(
        [
            // CREATION 
            //create user
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Cash Moneybags",
                        password: "gr33d1sg00d",
                        phone_number: "555"
                    })
                    .expect(res => usr = res.body.createdUser._id)
                    .expect(201, cb);
            },

            //create artisan
            function(cb)
            {
                request(app)
                    .post("/artisans/noimage")
                    .send(
                    {
                        userId: usr,
                        name: "Toan Deph",
                        bio: "Half-orc bard",
                        phone_number: "98754"
                    })
                    .expect(res => art = res.body.createdArtisan._id)
                    .expect(201, cb);
            },

            //create listings
            function(cb)
            {
                request(app)
                    .post("/listings/noimage")
                    .send(
                    {
                        name: "Lute",
                        description: "Not a guitar",
                        price: "35",
                        artisanID: art,
                        userID: usr
                    })
                    .expect(res => list1 = res.body.createdListing._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/listings/noimage")
                    .send(
                    {
                        name: "Song",
                        description: "Sheet music",
                        price: "9",
                        artisanID: art,
                        userID: usr
                    })
                    .expect(res => list2 = res.body.createdListing._id)
                    .expect(201, cb);
            },

            //create meetings
            function(cb)
            {
                request(app)
                    .post("/meetings")
                    .send(
                    {
                        userID: usr,
                        artisanID: art,
                        date: today,
                        itemsExpected: "1"
                    })
                    .expect(res => meet1 = res.body.createdMeeting._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/meetings")
                    .send(
                    {
                        userID: usr,
                        artisanID: art,
                        date: today,
                        itemsExpected: "3"
                    })
                    .expect(res => meet2 = res.body.createdMeeting._id)
                    .expect(201, cb);
            },

            //finds listing
            function(cb)
            {
                request(app)
                    .get("/listings/" + list1)
                    .expect(200, cb);
            },

            // DELETION 

            //deletes artisan
            function(cb)
            {
                request(app)
                    .del("/artisans/" + art)
                    .expect(200, cb);
            },

            //checks artisan
            function(cb)
            {
                request(app)
                    .get("/artisans/" + art)
                    .expect(404, cb);
            },

            //checks listings
            function(cb)
            {
                request(app)
                    .get("/listings/" + list1)
                    .expect(404, cb);
            },
            function(cb)
            {
                request(app)
                    .get("/listings/" + list2)
                    .expect(404, cb);
            },

            //checks meetings
            function(cb)
            {
                request(app)
                    .get("/meetings/" + meet1)
                    .expect(404, cb);
            },
            function(cb)
            {
                request(app)
                    .get("/meetings/" + meet2)
                    .expect(404, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/users/" + usr)
                    .expect(200, cb);
            }
        ], done);
    });

    //deletes nonexistant?
    it("Fails to delete an artisan that doesn't exist", function(done)
    {
        request(app)
            .del("/artisans/111111111111111111111111")
            .expect(200)
            .end(done);
    });

    it("Throws 500 when updates missing", function(done)
    {
        request(app)
            .patch("/artisans/111111111111111111111111")
            .expect(500)
            .end(done);
    });
});

