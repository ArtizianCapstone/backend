const mongoose = require('mongoose');
const Listing = require("./listing");
const Meeting = require("./meeting");

const artisanSchema = mongoose.Schema( {
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, required: true},
    bio: {type: String, required: false},
    phone_number: { type: String, required: false},
    image: {type: String, required: false},
    creation_date: { type: Date, required: true}
});

artisanSchema.pre("remove", async function(next)
{
    try
    {
        await Listing.remove({artisan: this._id});
        await Meeting.remove({artisan: this._id});
        next();
    }
    catch(err)
    {
        next(err);
    }
});

module.exports = mongoose.model('Artisan', artisanSchema);
