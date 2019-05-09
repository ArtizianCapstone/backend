//this file will contain tests, but not yet
const assert = require('assert');
const mongoose = require('mongoose');
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
});

describe("Tests the User request handling", function()
{
});
