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

artisanSchema.pre("delteOne", function(next)
{
    Listing.deleteMany({artisan: this._id}).exec();
    Meeting.deleteMany({artisan: this._id}).exec();
    next();
});

module.exports = mongoose.model('Artisan', artisanSchema);
