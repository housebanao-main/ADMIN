import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaAngleLeft } from 'react-icons/fa';
import styles from './CustomerTable.module.css';
import axios from 'axios';

function TransportTable() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '',
        panNumber: '',
        typeOfBusiness: '',
        firmType: '',  // Ensure firmType is part of the initial state
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
        vehicleDetails: [{
            vehicleNumber: '',
            vehicleType: '',
            capacity: 0,
            documents: ''
        }],
        driverInformation: {
            driversName: '',
            licenseNumber: '',
            operationsDocuments: ''
        }
    });

    const [transports, setTransports] = useState([]);
    const [error, setError] = useState('');

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        fetchTransports();
    }, []);

    const fetchTransports = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/transports`);
            setTransports(response.data);
        } catch (error) {
            console.error('Error fetching transports:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const isCheckbox = type === 'checkbox';

        if (name.includes('.')) {
            const keys = name.split('.');
            setFormData(prevData => {
                const updatedData = { ...prevData };
                let nestedData = updatedData;

                for (let i = 0; i < keys.length - 1; i++) {
                    nestedData = nestedData[keys[i]];
                }

                nestedData[keys[keys.length - 1]] = isCheckbox ? checked : value;

                return updatedData;
            });
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: isCheckbox ? checked : value
            }));
        }
    };

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };

    const handleGoBack = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous error
    
        // Client-side validation
        if (!formData.poc.phone) {
            setError('POC phone number is required.');
            return;
        }
    
        try {
            const response = await axios.post(`${API_BASE_URL}/transports`, formData);
            console.log(response.data);
            fetchTransports(); // Refresh the transport list
            closeModal();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                console.error('There was an error adding the transport!', error);
            }
        }
    };
    

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentStep(1); // Reset currentStep when modal is closed
        setError(''); // Clear error message
    };

    return (
        <div className={styles.tableContainer}>
            <div className={styles.layoutBar}>
                <div className={styles.searchBar}>
                    <input type="text" className={styles.searchInput} placeholder="Search here" />
                    <button type="button" className={styles.searchButton}>Search</button>
                </div>
                <button type="button" onClick={openModal} className={styles.addTransportButton}>+ Add Transport</button>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Add Transport Modal"
                    className={styles.modal}
                    overlayClassName={styles.overlay}
                >
                    <div className={styles.modalContent}>
                        {error && <div className={styles.error}>{error}</div>}
                        {currentStep === 1 && (
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroupTop}>
                                    <FaAngleLeft className={styles.backIcon} onClick={closeModal} /> {/* Back icon */}
                                    <h2 className={styles.addTransportHeading}>Add Transport</h2>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Entity Name*</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Pan No.*</label>
                                    <input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Type of Business*</label>
                                    <input type="text" name="typeOfBusiness" value={formData.typeOfBusiness} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Type of Firm*</label>
                                    <input type="text" name="firmType" value={formData.firmType} onChange={handleChange} /> {/* Make sure firmType field is present */}
                                </div>
                                <h3>POC Details</h3>
                                <div className={styles.formGroup}>
                                    <label>Name*</label>
                                    <input type="text" name="poc.name" value={formData.poc.name} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email Id*</label>
                                    <input type="email" name="poc.email" value={formData.poc.email} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Phone Number*</label>
                                    <input type="tel" name="poc.phone" value={formData.poc.phone} onChange={handleChange} />
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
                                    <h2 className={styles.addTransportHeading}>Add Address</h2>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Address Line 1*</label>
                                    <input type="text" name="basicDetails.addressLine1" value={formData.basicDetails.addressLine1} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Address Line 2</label>
                                    <input type="text" name="basicDetails.addressLine2" value={formData.basicDetails.addressLine2} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Pincode*</label>
                                    <input type="text" name="basicDetails.pincode" value={formData.basicDetails.pincode} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Country*</label>
                                    <input type="text" name="basicDetails.country" value={formData.basicDetails.country} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>City*</label>
                                    <input type="text" name="basicDetails.city" value={formData.basicDetails.city} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>State*</label>
                                    <input type="text" name="basicDetails.state" value={formData.basicDetails.state} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <input type="checkbox" name="hasGst" checked={formData.hasGst} onChange={handleChange} />
                                    <label>Gst Number</label>
                                </div>
                                {formData.hasGst && (
                                    <div className={styles.formGroup}>
                                        <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
                                    </div>
                                )}
                                <div className={styles.formGroupBottom}>
                                    <button className={styles.nextButton} type="button" onClick={handleNext}>Next</button>
                                </div>
                            </form>
                        )}
                        {currentStep === 3 && (
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroupTop}>
                                    <FaAngleLeft className={styles.backIcon} onClick={handleGoBack} /> {/* Back icon */}
                                    <h2 className={styles.addTransportHeading}>Add Vehicle Details</h2>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Vehicle Number*</label>
                                    <input type="text" name="vehicleDetails.0.vehicleNumber" value={formData.vehicleDetails[0].vehicleNumber} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Vehicle Type*</label>
                                    <input type="text" name="vehicleDetails.0.vehicleType" value={formData.vehicleDetails[0].vehicleType} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Capacity*</label>
                                    <input type="number" name="vehicleDetails.0.capacity" value={formData.vehicleDetails[0].capacity} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Documents*</label>
                                    <input type="text" name="vehicleDetails.0.documents" value={formData.vehicleDetails[0].documents} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroupBottom}>
                                    <button className={styles.nextButton} type="button" onClick={handleNext}>Next</button>
                                </div>
                            </form>
                        )}
                        {currentStep === 4 && (
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroupTop}>
                                    <FaAngleLeft className={styles.backIcon} onClick={handleGoBack} /> {/* Back icon */}
                                    <h2 className={styles.addTransportHeading}>Add Driver Information</h2>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Driver's Name*</label>
                                    <input type="text" name="driverInformation.driversName" value={formData.driverInformation.driversName} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>License Number*</label>
                                    <input type="text" name="driverInformation.licenseNumber" value={formData.driverInformation.licenseNumber} onChange={handleChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Operations Documents*</label>
                                    <input type="text" name="driverInformation.operationsDocuments" value={formData.driverInformation.operationsDocuments} onChange={handleChange} />
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
                        <th>Transportation ID</th>
                        <th>Company Name</th>
                        <th>POC</th>
                        <th>Pan No.</th>
                        <th>Location</th>
                        <th>Vehicle Details</th>
                        <th>Driver Info</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {transports.map((transport) => (
                        <tr key={transport._id}>
                            <td>{transport._id}</td>
                            <td>{transport.companyName}</td>
                            <td>{transport.poc.name}</td>
                            <td>{transport.panNumber}</td>
                            <td>{`${transport.basicDetails.city}, ${transport.basicDetails.state}`}</td>
                            <td>{`${transport.vehicleDetails[0].vehicleNumber} - ${transport.vehicleDetails[0].vehicleType}`}</td>
                            <td>{transport.driverInformation.driversName}</td>
                            <td>{transport.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransportTable;
