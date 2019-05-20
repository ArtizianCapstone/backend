const request = require("supertest");
const app = require('../app');
const async = require("async");
const assert = require("assert");

describe("Tests the funcionality of meetings", function()
{
    it("Finds an empty list", function(done)
    {
        request(app)
            .get("/meetings")
            .expect({ message: "No entries found" })
            .expect(404)
            .end(done);
    });

    it("Fails to get a meeting that doesn't exist", function(done)
    {
        request(app)
            .get("/meetings/111111111111111111111111")
            .expect(404, done);
    });

    it("Creates a new meeting and GETS it", function(done)
    {
        var usr, art, meet;
        var time = new Date();
        async.series(
        [
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Lester Tester",
                        password: "For single meeting",
                        phone_number: "0",
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
                        name: "Always late",
                        bio: "bad bio"
                    })
                    .expect(res => art = res.body.createdArtisan._id)
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
                        date: time,
                        itemsExpected: "3"
                    })
                    .expect(res => meet = res.body.createdMeeting._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .get("/meetings/" + meet)
                    .expect(res => res.body.date = new Date(res.body.date))
                    .expect(
                    {
                        __v: 0,
                        _id: meet,
                        user: 
                        {
                            _id: usr,
                            name: "Lester Tester"
                        },
                        artisan:
                        {
                            _id: art,
                            name: "Always late"
                        },
                        date: time,
                        itemsExpected: 3
                    })
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/meetings/" + meet)
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
            //test deletion
            function(cb)
            {
                request(app)
                    .get("/meetings/" + meet)
                    .expect(404, cb);
            }
        ], done);
    });

    it("Gets a list of meetings", function(done)
    {
        var usr, art1, art2, meet1, meet2, meet3;
        var time1 = new Date();
        var time2 = new Date();
        var time3 = new Date();

        async.series(
        [
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Original name",
                        password: "boring",
                        phone_number: "0"
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
                        name: "Nearly Done"
                    })
                    .expect(res => art1 = res.body.createdArtisan._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/artisans/noimage")
                    .send(
                    {
                        userId: usr,
                        name: "Having Problems"
                    })
                    .expect(res => art2 = res.body.createdArtisan._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/meetings")
                    .send(
                    {
                        userID: usr,
                        artisanID: art1,
                        date: time1.toString(),
                        itemsExpected: 1
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
                        artisanID: art1,
                        date: time2.toString(),
                        itemsExpected: 2
                    })
                    .expect(res => meet2 = res.body.createdMeeting._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/meetings")
                    .send(
                    {
                        userID: usr,
                        artisanID: art2,
                        date: time3,
                        itemsExpected: 3
                    })
                    .expect(res => meet3 = res.body.createdMeeting._id)
                    .expect(201, cb);
            },
            //get the list
            function(cb)
            {
                request(cb)
                    .get("/meetings")
                    .expect(res =>
                    {
                        assert(3, res.body.length);
                        assert(meet1, res.body[0]._id);
                        assert(usr, res.body[0].user._id);
                        //assert(time2, new Date(res.body[1].date));
                    })
                    /*
                    .expect(
                    [
                        {
                            __v: 0,
                            _id: meet1,
                            user:
                            {
                                _id: usr,
                                name: "Original name"
                            },
                            artisan:
                            {
                                _id: art1,
                                name: "Nearly Done"
                            },
                            date: time1,
                            itemsExpected: 1
                        },
                        {
                            __v: 0,
                            _id: meet2,
                            user:
                            {
                                _id: usr,
                                name: "Original name"
                            },
                            artisan:
                            {
                                _id: art2,
                                name: "Having Problems"
                            },
                            date: time2,
                            itemsExpected: 2
                        },
                        {
                            __v: 0,
                            _id: meet3,
                            user:
                            {
                                _id: usr,
                                name: "Original name"
                            },
                            artisan:
                            {
                                _id: art2,
                                name: "Having Problems"
                            },
                            date: time3,
                            itemsExpected: 3
                        }
                    ])
                    */
                    .expect(200, cb);
            },
            //cleanup
            function(cb)
            {
                request(app)
                    .del("/meetings/" + meet1)
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/meetings/" + meet2)
                    .expect(200, cb);
            },
            function(cb)
            {
                request(app)
                    .del("/meetings/" + meet3)
                    .expect(200, cb)
            },
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
                    .del("/users/" + usr)
                    .expect(200, cb);
            }
        ], done);
    });

    it("Throws 500 when updates missing", function(done)
    {
        request(app)
            .patch("/meetings/111111111111111111111111")
            .expect(500)
            .end(done);
    });
});

function trimDate(date) { return date.toString().substring(7, date.lenghth - 2); }
