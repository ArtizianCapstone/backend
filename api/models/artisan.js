const mongoose = require('mongoose');

const artisanSchema = mongoose.Schema( {
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, required: true},
    bio: {type: String, required: false},
    phone_number: { type: String, required: false},
    creation_date: { type: Date, required: true}
});

module.exports = mongoose.model('Artisan', artisanSchema);
