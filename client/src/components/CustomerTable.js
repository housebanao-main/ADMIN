import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaAngleLeft, FaEdit, FaTrash } from 'react-icons/fa';
import styles from './CustomerTable.module.css';
import axios from 'axios';

const initialFormData = {
    companyName: '',
    panNumber: '',
    typeOfBusiness: '',
    firmType: '',
    poc: {
        name: '',
        email: '',
        phone: ''
    },
    basicDetails: {
        addressLine1: '',
        addressLine2: '',
        pincode: '',
        country: '',
        city: '',
        state: ''
    },
    hasGst: false,
    gstNumber: '',
    paymentDetails: {
        paymentType: '',
        creditTimePeriod: '',
        creditAmountPercentage: '',
        creditAmount: '',
        paymentMode: '',
        amountPaid: '',
        comments: ''
    },
    stagesOfPaymentOrWorkDone: [] // Ensure this is what your API expects, if needed add default values
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function CustomerTable() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialFormData);
    const [customers, setCustomers] = useState([]);
    const [errors, setErrors] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, [searchQuery]);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/customers`, {
                params: { search: searchQuery }
            });
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const keys = name.split('.');
            setFormData((prevData) => ({
                ...prevData,
                [keys[0]]: {
                    ...prevData[keys[0]],
                    [keys[1]]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const validateStep1 = () => {
        let tempErrors = {};

        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;

        if (!formData.companyName) tempErrors.companyName = "Customer Name is required";
        if (!formData.panNumber || !panRegex.test(formData.panNumber)) tempErrors.panNumber = "Valid PAN Number is required";
        if (!formData.poc.email || !emailRegex.test(formData.poc.email)) tempErrors.pocEmail = "Valid Email is required";
        if (!formData.poc.phone || !phoneRegex.test(formData.poc.phone)) tempErrors.pocPhone = "Valid Phone Number is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const validateStep2 = () => {
        let tempErrors = {};

        if (!formData.basicDetails.addressLine1) tempErrors.addressLine1 = "Address Line 1 is required";
        if (!formData.basicDetails.pincode) tempErrors.pincode = "Pincode is required";
        if (!formData.basicDetails.country) tempErrors.country = "Country is required";
        if (!formData.basicDetails.city) tempErrors.city = "City is required";
        if (!formData.basicDetails.state) tempErrors.state = "State is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const validateStep3 = () => {
        let tempErrors = {};

        if (!formData.paymentDetails.paymentType) tempErrors.paymentType = "Payment Type is required";
        if (!formData.paymentDetails.creditTimePeriod) tempErrors.creditTimePeriod = "Credit Time Period is required";
        if (!formData.paymentDetails.creditAmountPercentage) tempErrors.creditAmountPercentage = "Credit Amount Percentage is required";
        if (!formData.paymentDetails.creditAmount) tempErrors.creditAmount = "Credit Amount is required";
        if (!formData.paymentDetails.paymentMode) tempErrors.paymentMode = "Payment Mode is required";
        if (!formData.paymentDetails.amountPaid) tempErrors.amountPaid = "Amount Paid is required";
        if (!formData.paymentDetails.comments) tempErrors.comments = "Comments are required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleNext = () => {
        let isValid = false;
        if (currentStep === 1) {
            isValid = validateStep1();
        } else if (currentStep === 2) {
            isValid = validateStep2();
        } else if (currentStep === 3) {
            isValid = validateStep3();
        }

        if (isValid) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleGoBack = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateStep3()) return;
    
        console.log('Submitting form data:', formData); // Log the form data
    
        try {
            const response = await axios.post(`${API_BASE_URL}/customers`, formData);
            console.log(response.data);
            fetchCustomers(); // Refresh the customer list
            closeModal();
        } catch (error) {
            console.error('There was an error adding the customer!', error);
            console.error('Error response:', error.response.data); // Log the error response from the server
        }
    };
    

    const openModal = (customer = null) => {
        if (customer) {
            setFormData(customer);
        } else {
            setFormData(initialFormData);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentStep(1); // Reset currentStep when modal is closed
        setFormData(initialFormData); // Reset formData when modal is closed
        setErrors({});
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/customers/${id}`);
            fetchCustomers();
        } catch (error) {
            console.error('Failed to delete customer:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredCustomers = customers.filter((customer) =>
        customer.companyName.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <button type="button" className={styles.searchButton} onClick={fetchCustomers}>Search</button>
                </div>
                <button type="button" onClick={() => openModal()} className={styles.addCustomerButton}>+ Add Customer</button>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Add Customer Modal"
                    className={styles.modal}
                    overlayClassName={styles.overlay}
                >
                    <div className={styles.modalContent}>
                        {currentStep === 1 && (
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroupTop}>
                                    <FaAngleLeft className={styles.backIcon} onClick={closeModal} /> {/* Back icon */}
                                    <h2 className={styles.addCustomerHeading}>Add Customer</h2>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Customer Name*</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
                                    {errors.companyName && <p className={styles.error}>{errors.companyName}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>PAN Number*</label>
                                    <input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} />
                                    {errors.panNumber && <p className={styles.error}>{errors.panNumber}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Partner Type*</label>
                                    <select name="typeOfBusiness" value={formData.typeOfBusiness} onChange={handleChange}>
                                        <option value="">Select Partner Type</option>
                                        <option value="Distributor">Distributor</option>
                                        <option value="Retailer">Retailer</option>
                                        <option value="Wholesaler">Wholesaler</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Firm Type*</label>
                                    <select name="firmType" value={formData.firmType} onChange={handleChange}>
                                        <option value="">Select Firm Type</option>
                                        <option value="Sole Proprietorship">Sole Proprietorship</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="Corporation">Corporation</option>
                                    </select>
                                </div>
                                <h3>POC Details</h3>
                                <div className={styles.formGroup}>
                                    <label>Name*</label>
                                    <input type="text" name="poc.name" value={formData.poc.name} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email*</label>
                                    <input type="email" name="poc.email" value={formData.poc.email} onChange={handleChange} />
                                    {errors.pocEmail && <p className={styles.error}>{errors.pocEmail}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Phone Number*</label>
                                    <input type="tel" name="poc.phone" value={formData.poc.phone} onChange={handleChange} />
                                    {errors.pocPhone && <p className={styles.error}>{errors.pocPhone}</p>}
                                </div>
                                <div className={styles.formGroupBottom}>
                                    <button className={styles.nextButton} type="button" onClick={handleNext}>Next</button>
                                </div>
                            </form>
                        )}
                        {currentStep === 2 && (
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroupTop}>
                                    <FaAngleLeft className={styles.backIcon} onClick={handleGoBack} /> {/* Back icon */}
                                    <h2 className={styles.addCustomerHeading}>Add Address</h2>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Address Line 1*</label>
                                    <input type="text" name="basicDetails.addressLine1" value={formData.basicDetails.addressLine1} onChange={handleChange} />
                                    {errors.addressLine1 && <p className={styles.error}>{errors.addressLine1}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Address Line 2</label>
                                    <input type="text" name="basicDetails.addressLine2" value={formData.basicDetails.addressLine2} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Pincode*</label>
                                    <input type="text" name="basicDetails.pincode" value={formData.basicDetails.pincode} onChange={handleChange} />
                                    {errors.pincode && <p className={styles.error}>{errors.pincode}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Country*</label>
                                    <input type="text" name="basicDetails.country" value={formData.basicDetails.country} onChange={handleChange} />
                                    {errors.country && <p className={styles.error}>{errors.country}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>City*</label>
                                    <input type="text" name="basicDetails.city" value={formData.basicDetails.city} onChange={handleChange} />
                                    {errors.city && <p className={styles.error}>{errors.city}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>State*</label>
                                    <input type="text" name="basicDetails.state" value={formData.basicDetails.state} onChange={handleChange} />
                                    {errors.state && <p className={styles.error}>{errors.state}</p>}
                                </div>
                                <div className={styles.formGroup}>
                                    <input type="checkbox" name="hasGst" checked={formData.hasGst} onChange={handleChange} />
                                    <label>Has GST</label>
                                </div>
                                {formData.hasGst && (
                                    <div className={styles.formGroup}>
                                        <label>GST Number*</label>
                                        <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
                                        {errors.gstNumber && <p className={styles.error}>{errors.gstNumber}</p>}
                                    </div>
                                )}
                                <div className={styles.formGroupBottom}>
                                    <button className={styles.nextButton} type="button" onClick={handleNext}>Next</button>
                                </div>
                            </form>
                        )}
                        {currentStep === 3 && (
                            <form onSubmit={handleSubmit} className={styles.twoColumnForm}>
                                <div className={styles.formGroupTop}>
                                    <FaAngleLeft className={styles.backIcon} onClick={handleGoBack} /> {/* Back icon */}
                                    <h2 className={styles.addCustomerHeading}>Payment Details</h2>
                                </div>
                                <div className={styles.twoColumnRow}>
                                    <div className={styles.formGroup}>
                                        <label>Payment Type*</label>
                                        <input type="text" name="paymentDetails.paymentType" value={formData.paymentDetails.paymentType} onChange={handleChange} />
                                        {errors.paymentType && <p className={styles.error}>{errors.paymentType}</p>}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Credit Time Period*</label>
                                        <input type="text" name="paymentDetails.creditTimePeriod" value={formData.paymentDetails.creditTimePeriod} onChange={handleChange} />
                                        {errors.creditTimePeriod && <p className={styles.error}>{errors.creditTimePeriod}</p>}
                                    </div>
                                </div>
                                <div className={styles.twoColumnRow}>
                                    <div className={styles.formGroup}>
                                        <label>Credit Amount Percentage*</label>
                                        <input type="text" name="paymentDetails.creditAmountPercentage" value={formData.paymentDetails.creditAmountPercentage} onChange={handleChange} />
                                        {errors.creditAmountPercentage && <p className={styles.error}>{errors.creditAmountPercentage}</p>}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Credit Amount*</label>
                                        <input type="text" name="paymentDetails.creditAmount" value={formData.paymentDetails.creditAmount} onChange={handleChange} />
                                        {errors.creditAmount && <p className={styles.error}>{errors.creditAmount}</p>}
                                    </div>
                                </div>
                                <div className={styles.twoColumnRow}>
                                    <div className={styles.formGroup}>
                                        <label>Payment Mode*</label>
                                        <input type="text" name="paymentDetails.paymentMode" value={formData.paymentDetails.paymentMode} onChange={handleChange} />
                                        {errors.paymentMode && <p className={styles.error}>{errors.paymentMode}</p>}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Amount Paid*</label>
                                        <input type="text" name="paymentDetails.amountPaid" value={formData.paymentDetails.amountPaid} onChange={handleChange} />
                                        {errors.amountPaid && <p className={styles.error}>{errors.amountPaid}</p>}
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Comments*</label>
                                    <textarea name="paymentDetails.comments" value={formData.paymentDetails.comments} onChange={handleChange}></textarea>
                                    {errors.comments && <p className={styles.error}>{errors.comments}</p>}
                                </div>
                                <div className={styles.formGroupBottom}>
                                    <button className={styles.submitButton} type="submit">Submit</button>
                                </div>
                            </form>
                        )}
                    </div>
                </Modal>
            </div>
            <table className={styles.customerTable}>
                <thead>
                    <tr>
                        <th>Customer ID</th>
                        <th>Customer Name</th>
                        <th>POC</th>
                        <th>PAN Number</th>
                        <th>Business Type</th>
                        <th>Firm Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.map((customer) => (
                        <tr key={customer._id}>
                            <td>{customer.customerId}</td>
                            <td>{customer.companyName}</td>
                            <td>{customer.poc.name}<br></br>{customer.poc.phone}<br></br>{customer.poc.email}</td>
                            <td>{customer.panNumber}</td>
                            <td>{customer.typeOfBusiness}</td>
                            <td>{customer.firmType}</td>
                            <td>
                                <FaEdit className={styles.actionIcon} onClick={() => openModal(customer)} />
                                <FaTrash className={styles.actionIcon} onClick={() => handleDelete(customer._id)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CustomerTable;
