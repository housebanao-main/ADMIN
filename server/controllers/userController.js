const User = require('../models/Users');

const addUser = async (req, res) => {
    const { name, phoneNumber, email, department, designation, password } = req.body;
    if (!name || !phoneNumber || !email || !department || !designation || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const newUser = new User({ name, phoneNumber, email, department, designation, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add user: ' + error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users: ' + error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, phoneNumber, email, department, designation, password } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { name, phoneNumber, email, department, designation, password }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user: ' + error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user: ' + error.message });
    }
};

module.exports = { addUser, getUsers, updateUser, deleteUser };