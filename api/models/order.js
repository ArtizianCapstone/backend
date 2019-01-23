const mongoose = require('mongoose');

const orderSchema = mongoose.Schema( {
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    artisan: {type: mongoose.Schema.Types.ObjectId, ref: 'Artisan', required: true},
    listing: {type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true},
    //sessionId: {type: Integer, required: true},
    date_ordered: { type: Date, required: true},
    paid: {type: Boolean, required: true},
    date_paid: { type: Date, required: false},
    shipped: {type: Boolean, required: true},
    date_shipped: {type: Date, required, false}
});

module.exports = mongoose.model('Order', orderSchema);
