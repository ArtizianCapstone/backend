const mongoose = require('mongoose');

const userSchema = mongoose.Schema( {
    _id: mongoose.Schema.Types.ObjectId,
    password: {type: String, required: true},
    name: {type: String, required: false },
    phone_number: { type: String, required: false },
    creation_date: { type: Date, required: true}
});

module.exports = mongoose.model('User', userSchema);
