const mongoose = require('mongoose');

// Corrected Partner schema and model
const PartnerSchema = new mongoose.Schema({
    entityName: { type: String, required: true },
    panNumber: { type: String, required: true },
    partnerType: { type: String, required: true },
    firmType: { type: String, required: true },
    pocName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    hasGst: { type: Boolean, required: true },
    gstNumber: { type: String },
    paymentDetails: { type: String }
});

const Partner = mongoose.model('Partner', PartnerSchema);

module.exports = Partner;
