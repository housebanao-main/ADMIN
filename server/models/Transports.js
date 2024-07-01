const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    panNumber: { type: String, required: true, unique: true },
    typeOfBusiness: { type: String },
    firmType: { type: String, required: true },
    poc: {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, unique: true, required: true } // Ensure phone is unique and required
    },
    basicDetails: {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        pincode: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true }
    },
    vehicleDetails: [
        {
            vehicleNumber: { type: String, required: true },
            vehicleType: { type: String, required: true },
            capacity: { type: Number, required: true },
            documents: { type: String }
        }
    ],
    driverInformation: {
        driversName: { type: String, required: true },
        licenseNumber: { type: String, required: true },
        operationsDocuments: { type: String }
    }
});


const Transport = mongoose.model('Transport', transportSchema);

module.exports = Transport;
