const mongoose = require('mongoose');

const listingSchema = mongoose.Schema( {
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
    artisan: {type: mongoose.Schema.Types.ObjectId, ref: 'Artisan', required: false },
    name: {type: String, required: true},
    description: {type: String, required: false},
    price: { type: Number, required: true},
    creation_date: { type: Date, required: true}
});

module.exports = mongoose.model('Listing', listingSchema);
