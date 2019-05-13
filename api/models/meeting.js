const mongoose = require('mongoose');


const meetingSchema = mongoose.Schema(
{
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    artisan: {type: mongoose.Schema.Types.ObjectId, ref: 'Artisan', required: true},
    date: {type: Date, required: true},
    itemsExpected: {type: Number, required: true}
});



module.exports = mongoose.model('Meeting', meetingSchema);
