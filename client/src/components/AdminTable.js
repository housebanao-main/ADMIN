import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import styles from './CustomerTable.module.css'; // Import your CSS module for styling

function AdminTable() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        department: '',
        designation: '',
        password: ''
    });
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users`);
            console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
            setUsers(response.data);
        } catch (error) {
            console.error('There was an error fetching the users!', error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };
  
    const closeModal = () => {
        setIsModalOpen(false);
        setFormError('');
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const validateForm = () => {
        let tempErrors = {};
        let errorMessage = '';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;

        if (!formData.name) tempErrors.name = 'Name is required';
        if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) tempErrors.phoneNumber = 'Valid phone number is required';
        if (!formData.email || !emailRegex.test(formData.email)) tempErrors.email = 'Valid email is required';
        if (!formData.department) tempErrors.department = 'Department is required';
        if (!formData.designation) tempErrors.designation = 'Designation is required';
        if (!formData.password) tempErrors.password = 'Password is required';

        if (Object.keys(tempErrors).length > 1) {
            errorMessage = 'Please fill all required fields correctly.';
            tempErrors = {}; // Reset individual field errors if there's more than one error
        }

        setErrors(tempErrors);
        setFormError(errorMessage);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post(`${API_BASE_URL}/users`, formData);
            const newUser = response.data;
            setUsers([...users, newUser]); // Add the new user to the list
            closeModal();
            setFormData({
                name: '',
                phoneNumber: '',
                email: '',
                department: '',
                designation: '',
                password: ''
            });
        } catch (error) {
            console.error('There was an error adding the user!', error);
            // Display an error message to the user (e.g., using state)
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.tableContainer}>
            <div className={styles.layoutBar}>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search here"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <button type="button" onClick={openModal} className={styles.addCustomerButton}>+ Add User</button>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Add User Modal"
                    className={styles.modal}
                    overlayClassName={styles.overlay}
                >
                    <div className={styles.modalContent}>
                        <h2>Add User</h2>
                        {formError && <div className={styles.formError}>{formError}</div>}
                        <div className={styles.userImage}>
                            <img className={styles.userProfile} src="people.png" alt="User" />
                        </div>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <label htmlFor="name">Name</label>
                            {Object.keys(errors).length === 1 && errors.name && <p className={styles.error}>{errors.name}</p>}
                            <input type="text" id="name" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} className={errors.name ? styles.errorInput : ''} />
                            <label htmlFor="phoneNumber">Phone no.</label>
                            {Object.keys(errors).length === 1 && errors.phoneNumber && <p className={styles.error}>{errors.phoneNumber}</p>}
                            <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="987654321" value={formData.phoneNumber} onChange={handleChange} className={errors.phoneNumber ? styles.errorInput : ''} />
                            <label htmlFor="email">Email Id.</label>
                            {Object.keys(errors).length === 1 && errors.email && <p className={styles.error}>{errors.email}</p>}
                            <input type="email" id="email" name="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} className={errors.email ? styles.errorInput : ''} />
                            <label htmlFor="department">Department</label>
                            {Object.keys(errors).length === 1 && errors.department && <p className={styles.error}>{errors.department}</p>}
                            <select id="department" name="department" value={formData.department} onChange={handleChange} className={errors.department ? styles.errorInput : ''}>
                                <option value="">Select Department</option>
                                <option value="Product Designer">Product Designer</option>
                                <option value="Developer">Developer</option>
                            </select>
                            <label htmlFor="designation">Designation</label>
                            {Object.keys(errors).length === 1 && errors.designation && <p className={styles.error}>{errors.designation}</p>}
                            <select id="designation" name="designation" value={formData.designation} onChange={handleChange} className={errors.designation ? styles.errorInput : ''}>
                                <option value="">Select Designation</option>
                                <option value="Junior">Junior</option>
                                <option value="Senior">Senior</option>
                            </select>
                            <label htmlFor="password">Password</label>
                            {Object.keys(errors).length === 1 && errors.password && <p className={styles.error}>{errors.password}</p>}
                            <input type="password" id="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} className={errors.password ? styles.errorInput : ''} />
                            <div className={styles.formGroupBottom}>
                                <button type="button" className={styles.closeButton} onClick={closeModal}>Close</button>
                                <button type="submit" className={styles.saveButton}>Save</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Phone No.</th>
                        <th>Email Id.</th>
                        <th>Department</th>
                        <th>Designation</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user, index) => (
                        <tr key={index}>
                            <td>{user.userId}</td>
                            <td>{user.name}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.email}</td>
                            <td>{user.department}</td>
                            <td>{user.designation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.pagination}>
                {/* Pagination controls can be added here */}
            </div>
        </div>
    );
}

export default AdminTable;
