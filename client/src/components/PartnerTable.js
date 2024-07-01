import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaAngleLeft, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import styles from './CustomerTable.module.css';

function PartnerTable() {
  const [partners, setPartners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    entityName: '',
    panNumber: '',
    partnerType: '',
    firmType: '',
    pocName: '',
    email: '',
    phoneNumber: '',
    gstNumber: '',
    paymentDetails: '',
    hasGst: false,
  });
  const [editingPartner, setEditingPartner] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


  useEffect(() => {
    fetchPartners();
  }, [searchQuery]);

  const fetchPartners = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Partners`, {
        params: { search: searchQuery }
      });
      setPartners(response.data);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateStep1 = () => {
    let tempErrors = {};
    let errorMessage = '';

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!formData.entityName) tempErrors.entityName = 'Entity Name is required';
    if (!formData.panNumber || !panRegex.test(formData.panNumber)) tempErrors.panNumber = 'Valid PAN Number is required';
    if (!formData.partnerType) tempErrors.partnerType = 'Partner Type is required';
    if (!formData.firmType) tempErrors.firmType = 'Firm Type is required';
    if (!formData.email || !emailRegex.test(formData.email)) tempErrors.email = 'Valid Email is required';
    if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) tempErrors.phoneNumber = 'Valid Phone Number is required';
    if (!formData.pocName) tempErrors.pocName = 'POC Name is required';

    if (Object.keys(tempErrors).length > 0) {
      errorMessage = 'Please fill all required fields correctly.';
    }

    setErrors(tempErrors);
    setFormError(errorMessage);
    return Object.keys(tempErrors).length === 0;
  };

  const validateStep2 = () => {
    let tempErrors = {};
    let errorMessage = '';

    if (!formData.gstNumber && formData.hasGst) tempErrors.gstNumber = 'GST Number is required';
    if (!formData.paymentDetails) tempErrors.paymentDetails = 'Payment Details are required';

    if (Object.keys(tempErrors).length > 0) {
      errorMessage = 'Please fill all required fields correctly.';
    }

    setErrors(tempErrors);
    setFormError(errorMessage);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(currentStep + 1);
      setFormError('');
    }
  };

  const handleGoBack = () => setCurrentStep(currentStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep === 2 && !validateStep2()) return;

    try {
      if (editingPartner) {
        const response = await axios.put(`${API_BASE_URL}/Partners/${editingPartner._id}`, formData);

        `${API_BASE_URL}/Partners`
        console.log('Partner updated:', response.data);
      } else {
        const response = await axios.post(`${API_BASE_URL}/Partners`, formData);
        console.log('Partner added:', response.data);
      }
      fetchPartners();
      closeModal();
    } catch (error) {
      console.error('Failed to save partner:', error);
    }
  };

  const openModal = (partner = null) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData(partner);
    } else {
      setEditingPartner(null);
      setFormData({
        entityName: '',
        panNumber: '',
        partnerType: '',
        firmType: '',
        pocName: '',
        email: '',
        phoneNumber: '',
        gstNumber: '',
        paymentDetails: '',
        hasGst: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStep(1);
    setEditingPartner(null);
    setErrors({});
    setFormError('');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/partners/${id}`);
      await axios.delete(`${API_BASE_URL}/Partners/${id}`);
      fetchPartners();
    } catch (error) {
      console.error('Failed to delete partner:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPartners = partners.filter(partner =>
    partner.entityName.toLowerCase().includes(searchQuery.toLowerCase())
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
        <button type="button" onClick={() => openModal()} className={styles.addCustomerButton}>+ Add Partner</button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Partner ID</th>
            <th>Partner Name</th>
            <th>Partner Type</th>
            <th>PAN Number</th>
            <th>Phone Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPartners.map((partner) => (
            <tr key={partner._id}>
              <td>{partner.partnerId}</td>
              <td>{partner.entityName}</td>
              <td>{partner.partnerType}</td>
              <td>{partner.panNumber}</td>
              <td>{partner.phoneNumber}</td>
              <td>
                <FaEdit className={styles.actionIcon} onClick={() => openModal(partner)} />
                <FaTrash className={styles.actionIcon} onClick={() => handleDelete(partner._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Partner Modal"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalContent}>
          {formError && <div className={styles.formError}>{formError}</div>}
          {currentStep === 1 && (
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroupTop}>
                <FaAngleLeft className={styles.backIcon} onClick={closeModal} />
                <h2 className={styles.addCustomerHeading}>{editingPartner ? 'Edit Partner' : 'Add Partner'}</h2>
              </div>
              <div className={styles.formGroup}>
                <label>Entity Name*</label>
                <input type="text" name="entityName" value={formData.entityName} onChange={handleChange} className={errors.entityName ? styles.errorInput : ''} />
                {errors.entityName && <p className={styles.error}>{errors.entityName}</p>}
              </div>
              <div className={styles.formGroup}>
                <label>PAN No.*</label>
                <input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} className={errors.panNumber ? styles.errorInput : ''} />
                {errors.panNumber && <p className={styles.error}>{errors.panNumber}</p>}
              </div>
              <div className={styles.formGroup}>
                <label>Type of Partner*</label>
                <input type="text" name="partnerType" value={formData.partnerType} onChange={handleChange} className={errors.partnerType ? styles.errorInput : ''} />
                {errors.partnerType && <p className={styles.error}>{errors.partnerType}</p>}
              </div>
              <div className={styles.formGroup}>
                <label>Type of Firm*</label>
                <input type="text" name="firmType" value={formData.firmType} onChange={handleChange} className={errors.firmType ? styles.errorInput : ''} />
                {errors.firmType && <p className={styles.error}>{errors.firmType}</p>}
              </div>
              <div className={styles.formGroup}>
                <label>Has GST*</label>
                <input type="checkbox" name="hasGst" checked={formData.hasGst} onChange={handleChange} />
              </div>
              <h3>POC Details</h3>
              <div className={styles.formGroup}>
                <label>Name*</label>
                <input type="text" name="pocName" value={formData.pocName} onChange={handleChange} className={errors.pocName ? styles.errorInput : ''} />
                {errors.pocName && <p className={styles.error}>{errors.pocName}</p>}
              </div>
              <div className={styles.formGroup}>
                <label>Email Id*</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? styles.errorInput : ''} />
                {errors.email && <p className={styles.error}>{errors.email}</p>}
              </div>
              <div className={styles.formGroup}>
                <label>Phone Number*</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={errors.phoneNumber ? styles.errorInput : ''} />
                {errors.phoneNumber && <p className={styles.error}>{errors.phoneNumber}</p>}
              </div>
              <div className={styles.formGroupBottom}>
                <button type="button" onClick={handleNext} className={styles.nextButton}>Next</button>
              </div>
            </form>
          )}

          {currentStep === 2 && (
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroupTop}>
                <FaAngleLeft className={styles.backIcon} onClick={handleGoBack} />
                <h2 className={styles.addCustomerHeading}>{editingPartner ? 'Edit Partner' : 'Add Partner'}</h2>
              </div>
              <div className={styles.formGroup}>
                <label>GST No.*</label>
                <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} className={errors.gstNumber ? styles.errorInput : ''} />
                {errors.gstNumber && <p className={styles.error}>{errors.gstNumber}</p>}
              </div>
              <div className={styles.formGroup}>
                <label>Payment Details*</label>
                <textarea name="paymentDetails" value={formData.paymentDetails} onChange={handleChange} className={errors.paymentDetails ? styles.errorInput : ''}></textarea>
                {errors.paymentDetails && <p className={styles.error}>{errors.paymentDetails}</p>}
              </div>
              <div className={styles.formGroupBottom}>
                <button type="button" onClick={handleGoBack} className={styles.backButton}>Back</button>
                <button type="submit" className={styles.submitButton}>{editingPartner ? 'Update' : 'Submit'}</button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default PartnerTable;
