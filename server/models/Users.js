const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    password: { type: String, required: true },
    userId: { type: String } // Unique user ID
});

// Middleware to hash password before saving
UserSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            if (!this.userId) {
                const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
                const sequence = this.isNew ? 1 : this.sequence + 1; // Increment sequence if existing document, otherwise start at 1 for new document
                this.userId = `UID-${currentDate}-${sequence}`;
            }
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
