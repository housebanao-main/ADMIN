const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    discount: { type: Number, required: true },
    cost: { type: Number, required: true },
    uploadImage: { type: String } // Assuming you will store the image URL
});

const siteConditionSchema = new mongoose.Schema({
    description: { type: String, required: true },
    uom: { type: String, required: true },
    standard: { type: String, required: true }
});

const specificationSchema = new mongoose.Schema({
    categoryName: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String } // Assuming you will store the image URL
});

const boqSchema = new mongoose.Schema({
    boqId: { type: String }, // Unique BOQ ID
    boqName: { type: String, required: true },
    customer: { type: String, required: true },
    boqComments: { type: String, required: true },
    type: { type: String, required: true },
    createdBy: { type: String, required: true },
    additionalInfo: { type: String },
    constructionDetails: { type: String },
    area: { type: String },
    category: { type: String },
    items: [itemSchema],
    siteInspection: { type: String, enum: ['Yes', 'No'], required: true },
    otherCharges: { type: String },
    siteConditions: [siteConditionSchema],
    specifications: [specificationSchema]
});

// Pre-save hook to generate the unique BOQ ID
boqSchema.pre('save', function(next) {
    const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
    const sequence = this.isNew ? 1 : this.sequence + 1; // Increment sequence if existing document, otherwise start at 1 for new document
    this.boqId = `BID-${currentDate}-${sequence}`;
    this.sequence = sequence; // Update sequence in document
    next();
});

const Boq = mongoose.model('Boq', boqSchema);

module.exports = Boq;
