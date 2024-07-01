const Customer = require('../models/Customers');
// controllers/customerController.js


// Create a new customer
exports.createCustomer = async (req, res) => {
    const { panNumber, poc: { email, phone } } = req.body;

    try {
        const existingCustomer = await Customer.findOne({ $or: [{ panNumber }, { "poc.email": email }, { "poc.phone": phone }] });

        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer with this PAN number, email, or phone number already exists' });
        }

        const customer = new Customer(req.body);
        await customer.save();

        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all customers
exports.getCustomers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                companyName: { $regex: search, $options: 'i' }
            };
        }
        const customers = await Customer.find(query);
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
