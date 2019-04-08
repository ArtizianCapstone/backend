//this file will contain tests, but not yet
console.log("testing users");

const assert = require('assert');
const mongoose = require('mongoose');
const User = require('../api/models/user');

describe("tests creating/deleting a user", function()
{
    var current_date = new Date();
    var id = new mongoose.Types.ObjectId();

    //create tests
    it("creates a user", function(done)
    {
        var usr = new User(
        {
            _id: id,
            name: "John Johnson",
            password: "Johnson & Johnson",
            phone_number: "9999",
            creation_date: current_date
        });

        console.log("created user");

        usr.save()
            .then(function()
            {
                console.log("before assert");
                assert(usr.isNew === false);
                done();
                console.log("After done");
            });

        console.log("after save action");
    });

    console.log("after first test");
});
