const request = require("supertest");
const app = require('../app');
const async = require("async");
const Meeting = require("../api/models/meeting");

describe("Tests the funcionality of meetings", function()
{
    it("Finds an empty list", function(done)
    {
        Meeting.remove({}).exec();
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
                        date: time1,
                        itemsExpected: 1
                    })
                    .expect(res => meet1 = res.body.createdMeeting._id)
                    .expect(res => time1 = res.body.createdMeeting.date)
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
                        date: time2,
                        itemsExpected: 2
                    })
                    .expect(res => meet2 = res.body.createdMeeting._id)
                    .expect(res => time2 = res.body.createdMeeting.date)
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
                    .expect(res => time3 = res.body.createdMeeting.date)
                    .expect(201, cb);
            },
            //get the list
            function(cb)
            {
                request(app)
                    .get("/meetings")
                    /*
                    .expect(res =>
                    {
                        console.log(util.inspect(res.body));
                        assert(3, res.body.length);
                        assert(meet1, res.body[0]._id);
                        assert(usr, res.body[0].user._id);
                        //assert(time2, new Date(res.body[1].date));
                    })
                    .expect(res =>
                    {
                        var i;
                        for (i = 0; i < 3; i++)
                            res.body[i].date = new Date(res.body[i].date);
                    })
                    */
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
                                _id: art1,
                                name: "Nearly Done"
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

    it("Filters meetings by user and artisan", function(done)
    {
        var usr1, usr2, art1, art2, meet1, meet2, meet3;
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
                        name: "Lets Finish",
                        password: "getterdun",
                        phone_number: "2"
                    })
                    .expect(res => usr1 = res.body.createdUser._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/users")
                    .send(
                    {
                        name: "Better Hurry",
                        password: "finalStretch",
                        phone_number: "-2"
                    })
                    .expect(res => usr2 = res.body.createdUser._id)
                    .expect(201, cb);
            },
            function(cb)
            {
                request(app)
                    .post("/artisans/noimage")
                    .send(
                    {
                        name: "Doing Better",
                        userId: usr1
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
                        name: "Getting Worse",
                        userId: usr1
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
                        userID: usr1,
                        artisanID: art1,
                        date: time1,
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
                        userID: usr1,
                        artisanID: art2,
                        date: time2,
                        itemsExpected: 2
                    })
                    .expect(res => meet2 = res.body.createdMeeting._id)
                    .expect(201, cb);
            },
            /*
            function(cb)
            {
                request(app)
                    .post("/meetings")
                    .send(
                    {
                        userID: usr2,
                        artisanID: art1,
                        date: time3,
                        itemsExpected: 3
                    })
                    .expect(res => meet3 = res.body.createdMeeting._id)
                    .expect(201, cb);
            },
            */

            //filter by user
            function(cb)
            {
                request(app)
                    .get("/meetings/byuser/" + usr1)
                    .expect(
                    [
                        {
                            __v: 0,
                            user:
                            {
                                _id: usr1,
                                name: "Lets Finish"
                            },
                            artisan: 
                            {
                                _id: art1,
                                name: "Doing Better"
                            },
                            date: time1,
                            itemsExpected: 1,
                            _id: meet1
                        },
                        {
                            __v: 0,
                            user:
                            {
                                _id: usr1,
                                name: "Lets Finish"
                            },
                            artisan:
                            {
                                _id: art2,
                                name: "Getting Worse"
                            },
                            date: date2,
                            itemsExpected: 2,
                            id: meet2
                        }
                    ])
                    .expect(200, cb);
            },
            //none for this user
            function(cb)
            {
                request(app)
                    .get("/meetings/byuser/" + usr2)
                    .expect({ message: "No meeting found for this user" })
                    .expect(404, cb);
            },
            //by artisan and user
            function(cb)
            {
                request(app)
                    .get("/meetings/" + usr1 + "/" + art1)
                    .expect(
                    [
                        {
                            __v: 0,
                            user:
                            {
                                _id: usr1,
                                name: "Lets Finish"
                            },
                            artisan: 
                            {
                                _id: art1,
                                name: "Doing Better"
                            },
                            date: date1,
                            itemsExpected: 1,
                            _id: meet1
                        }
                    ])
                    .expect(200, cb);
            },
            //none for artisan and user
            function(cb)
            {
                request(app)
                    .get("/meetings/" + usr2 + "/" + art1)
                    .expect({ message: "No meeting between artistan and user found" })
                    .expect(404, cb);
            }
        ], done);
    });

    it("Iteratively updates the properites of a meeting", function(done)
    {
        var usr, art, meet;
        var time = new Date();

        async.series(
        [
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
