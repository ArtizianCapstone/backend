const request = require("supertest");
const app = require('../app');
const async = require("async");

describe("Tests Listing functionality", function()
{
    it("Finds an empty list", function(done)
    {
        request(app)
            .get("/listings")
            .expect(req => req.body.count, "0")
            .expect(200)
            .end(done);
    });

    it("Fails to get a lsiting that doesn't exist", function(done)
    {
        request(app)
            .get("/listings/111111111111111111111111")
            .expect(404, done);
    });

    it("Creates a new listing and GETs it", function(done)
    {
        var usr, art, list, date;
        async.series(
        [
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Bossman",
                        password: "power",
                        phone_number: "9090"
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
                        name: "Jerri Eckleson",
                        bio: "Lawer",
                        phone_number: "333"
                    })
                    .expect(res => art = res.body.createdArtisan._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/listings/noimage")
                    .send(
                    {
                        userID: usr,
                        artisanID: art,
                        name: "Fountain pen",
                        description: "For writing",
                        price: "50",
                        quantity: "2"
                    })
                    .expect(res => list = res.body.createdListing._id)
                    .expect(res => date = res.body.createdListing.creation_date)
                    .expect(201, cb);
            },
            //check properties
            function(cb)
            {
                request(app)
                    .get("/listings/" + list)
                    .expect(res => res.body.price, "50")
                    .expect(res => res.body.description, "For writing")
                    .expect(res => res.body.user.name, "Bossman")
                    .expect(res => res.body.artisan.name, "Jerri Eckleson")
                    .expect(200, cb);
            },
            //cleanup
            function(cb)
            {
                request(app)
                    .del("/listings/" + list)
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
            },
            function(cb)
            {
                request(app)
                    .get("/listings/" + list)
                    .expect(404, cb);
            }
        ], done);
    });

    it("Gets a list of three listings", function(done)
    {
        var usr, art, l1, l2, l3, d1, d2, d3;
        async.series(
        [
            //create user
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Office Max",
                        password: "not Staples",
                        phone_number: "234"
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
                        name: "Pencil Pusher",
                        bio: "Chronic desk jockey",
                        phone_number: "321"
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
                        userID: usr,
                        artisanID: art,
                        name: "Pencil",
                        description: "Ticonderoga",
                        price: "2",
                        quantity: "5"
                    })
                    .expect(res => l1 = res.body.createdListing._id)
                    .expect(res => d1 = res.body.createdListing.creation_date)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/listings/noimage")
                    .send(
                    {
                        userID: usr,
                        artisanID: art,
                        name: "Paperclip",
                        description: "holds paper together",
                        price: "3",
                        quantity: "5"
                    })
                    .expect(res => l2 = res.body.createdListing._id)
                    .expect(res => d2 = res.body.createdListing.creation_date)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/listings/noimage")
                    .send(
                    {
                        userID: usr,
                        artisanID: art,
                        name: "Stapler",
                        description: "Better than paperclips",
                        price: "10"
                    })
                    .expect(res => l3 = res.body.createdListing._id)
                    .expect(res => d3 = res.body.createdListing.creation_date)
                    .expect(201, cb);
            },
            //get list
            function(cb)
            {
                request(app)
                    .get("/listings")
                    .expect(res => res.body.count, "3")
                    .expect(200, cb);
            },
            //delete listings
            function(cb)
            {
                request(app)
                    .del("/listings/" + l1)
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/listings/" + l2)
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/listings/" + l3)
                    .expect(200, cb);
            },
            //delete artisan
            function(cb)
            {
                request(app)
                    .del("/artisans/" + art)
                    .expect(200, cb);
            },
            //delete user
            function(cb)
            {
                request(app)
                    .del("/users/" + usr)
                    .expect(200, cb);
            }
        ], done);
    });

    it("Filters by user, and artisan and user", function(done)
    {
        var u1, u2, a1, a2, l1, l2, l3;
        async.series(
        [
            //create users
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Wal Greens",
                        password: "green",
                        phone_number: "30"
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
                        name: "Wal Mart",
                        password: "store",
                        phone_number: "03"
                    })
                    .expect(res => u2 = res.body.createdUser._id)
                    .expect(201, cb);
            },
            //create artisans
            function(cb)
            {
                request(app)
                    .post("/artisans/noimage")
                    .send(
                    {
                        userId: u1,
                        name: "Artsy",
                        bio: "Bad at math",
                        phone_number: "99"
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
                        bio: "Likes beans",
                        phone_number: "89"
                    })
                    .expect(res => a2 = res.body.createdArtisan._id)
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
                        bio: "Fun at parties",
                        phone_number: "77"
                    })
                    .expect(res => a3 = res.body.createdArtisan._id)
                    .expect(201, cb);
            },
            //create listings
            function(cb)
            {
                request(app)
                    .post("/listings/noimage")
                    .send(
                    {
                        userID: u1,
                        artisanID: a1,
                        name: "Painting",
                        description: "Not Van Gogh",
                        price: "200"
                    })
                    .expect(res => l1 = res.body.createdListing._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/listings/noimage")
                    .send(
                    {
                        userID: u2,
                        artisanID: a2,
                        name: "Beans",
                        description: "Good for your heart",
                        price: "5"
                    })
                    .expect(res => l2 = res.body.createdListing._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/listings/noimage")
                    .send(
                    {
                        userID: u2,
                        artisanID: a3,
                        name: "Calculator",
                        description: "Does the thinking for you",
                        price: "40"
                    })
                    .expect(res => l3 = res.body.createdListing._id)
                    .expect(201, cb);
            },
            //filter by user
            function(cb)
            {
                request(app)
                    .get("/listings/byuser/" + u2)
                    .expect(res => res.body.count, "2")
                    .expect(200, cb);

            },
            //filter by user and artisan
            function(cb)
            {
                request(app)
                    .get("/listings/" + u2 + "/" + a3)
                    .expect(res => res.body.count, "1")
                    .expect(200, cb);
            },
            //delete listings
            function(cb)
            {
                request(app)
                    .del("/listings/" + l1)
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/listings/" + l2)
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/listings/" + l3)
                    .expect(200, cb);
            },
            //delte artisans
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
            },
            //delete users
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
            }
        ], done);
    });

    it("iteratevely updates", function(done)
    {
        var usr, art, list;
        async.series(
        [
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Bossman",
                        password: "bosslady",
                        phone_number: "34"
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
                        name: "Thing maker",
                        bio: "Makes many things",
                        phone_number: "3"
                    })
                    .expect(res => art = res.body.createdArtisan._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/listings/noimage")
                    .send(
                    {
                        userID: usr,
                        artisanID: art,
                        name: "Thing",
                        description: "Perfectly generic object",
                        price: "0"
                    })
                    .expect(res => list = res.body.createdListing._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .patch("/listings/" + list)
                    .send(
                    [
                        { propName: "price", value: "3" },
                        { propName: "quantity", value: "5" }
                    ])
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .get("/listings/" + list)
                    .expect(res => res.body.price, "3")
                    .expect(res => res.body.quantity, "5")
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/listings/" + list)
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
});
