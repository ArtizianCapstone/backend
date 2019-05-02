//unit tests for artisans
console.log("testing artisans");

var request = require("supertest");
var async = require("async");
var app = require('../app');

describe("Tests artisan", function()
{
    //get
    it("Gets empty list", function(done)
    {
        request(app)
            .get("/artisans")
            .expect(200)
            //TODO: chec JSON body
            .end(done);
    });

    //post
    /*
    it("Creates a new artisan", function(done)
    {
        request(app)
            .post("/artisans/noimage")
            .send(
            {
            })
            //TODO: create & record listings and meetings
            .end(done);
    });
    */


    //delete
    it("Deletes pertinent meetings and listings along with deleted artisan", function(done)
    {
        var usr, art, list1, list2, meet1, meet2;
        var today = new Date();

        async.series(
        [
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
                    .expect(res => art = res.body.createdOrder._id)
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
            }
        ], done);
    });
});

/*
//create user
function tempUser()
{
    var usr = 
    { 
        name: "Moneybags Morebucks",
        password: "gr33d1sG00d",
        phone_number: "3600"
    };

    var art1 =
    {
        name: "Toan Deph",
        bio: "Half-orc bard",
        phone_number: "9876"
    };

    request(app)
        .post("/users")
        .send(usr)
        .then(res =>
        {
            var artisan = tempArtisan(res.body.createdUser._id, art1);
        });
}

function tempArtisan(usr, info)
{
    var art =
    {
        userId: usr,
        name: info.name,
        bio: info.bio,
        phone_number: info.phone_number
    };

    var artID;

    request(app)
        .post("/artisans/noimage")
        .send(art)
        .then(res => artID = res.body.createdOrder._id);

    return artID;
}
*/
