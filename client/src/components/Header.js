import { useState } from "react";
import Modal from 'react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell } from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.css";
//import logo from "../assets/Logo.png";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    admin: true,
    dashboard: false,
    customer: true,
    partner: false,
    selectAll: false,
  });

  const onProfileClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openAccessModal = () => {
    setIsAccessModalOpen(true);
  };

  const openProfileModal = () => {
    setIsAccessModalOpen(false);
  };

  const closeAccessModal = () => {
    setIsAccessModalOpen(false);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    if (name === "selectAll") {
      setCheckboxes({
        admin: checked,
        dashboard: checked,
        customer: checked,
        partner: checked,
        selectAll: checked,
      });
    } else {
      setCheckboxes({
        ...checkboxes,
        [name]: checked,
      });
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>
          {/*<img src={logo} className={styles.logoImg} alt="Logo"/>*/}
          <h4>Management System</h4>
        </div>
        <div className={`${styles.headerContainer} ${styles.headerContainerData}`}>
          <div className={styles.notification}>
            <FontAwesomeIcon icon={faBell} className={styles.notificationIcon} />
          </div>
          <div className={styles.profileName}>Admin</div>
          <div className={styles.profile} onClick={onProfileClick}>
            <FontAwesomeIcon icon={faUser} className={styles.profileIcon} />
          </div>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Edit Profile Modal"
            className={styles.modal}
            overlayClassName={styles.overlay}
          >
            <div className={styles.modalContent}>
              <div className={styles.modalContentHeader}>
                <h2>Edit Profile</h2>
                <div className={styles.modalContentHeaderInfo}>
                  <div className={styles.modalContentHeaderInfoBtn}>
                    Your Info
                  </div>
                  <div className={styles.modalContentHeaderInfoBtn} onClick={openAccessModal}>
                    Access
                  </div>
                </div>
              </div>
              <div className={styles.userImage}>
                <img className={styles.userProfile} src="people.png" alt="User" />
              </div>
              <form className={styles.form}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Nitin Singh" />
                <label htmlFor="phone">Phone no.</label>
                <input type="tel" id="phone" placeholder="6202105424" />
                <label htmlFor="email">Email Id.</label>
                <input type="email" id="email" placeholder="nitinsxngh@gmail.com" />
                <label htmlFor="department">Department</label>
                <select id="department">
                  <option value="product_designer">Product Designer</option>
                  <option value="development">Development</option>
                </select>
                <label htmlFor="designation">Designation</label>
                <select id="designation">
                  <option value="product_designer">Product Designer</option>
                  <option value="developer">Developer</option>
                </select>
              </form>
              <div className={styles.modalContentBottom}>
                <button className={styles.saveButton}>Edit</button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <Modal
        isOpen={isAccessModalOpen}
        onRequestClose={closeAccessModal}
        contentLabel="Access Modal"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.accessModalContent}>
          <div className={styles.modalContentHeader}>
            <h2>Edit Profile</h2>
            <div className={styles.modalContentHeaderInfo}>
              <div className={styles.modalContentHeaderInfoBtn} onClick={openProfileModal}>
                Your Info
              </div>
              <div className={styles.modalContentHeaderInfoBtn}>
                Access
              </div>
            </div>
          </div>
          <table>
            <thead>

            </thead>
            <tbody>
              <tr>
                <td></td>
                <td><strong>Editor</strong></td>
                <td>Viewer</td>
              </tr>
              <tr>
                <td><strong>Admin</strong></td>
                <td>
                  <input
                    type="checkbox"
                    name="admin"
                    checked={checkboxes.admin}
                    onChange={handleCheckboxChange}
                    disabled={true}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="admin-viewer"
                    checked={checkboxes['admin-viewer']}
                    onChange={handleCheckboxChange}
                    disabled={true}
                  />
                </td>
              </tr>
              <tr>
                <td>Dashboard</td>
                <td>
                  <input
                    type="checkbox"
                    name="dashboard"
                    checked={checkboxes.dashboard}
                    onChange={handleCheckboxChange}
                    disabled={true}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="dashboard-viewer"
                    checked={checkboxes['dashboard-viewer']}
                    onChange={handleCheckboxChange}
                    disabled={true}
                  />
                </td>
              </tr>
              <tr>
                <td>Customer</td>
                <td>
                  <input
                    type="checkbox"
                    name="customer"
                    checked={checkboxes.customer}
                    onChange={handleCheckboxChange}
                    disabled={true}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="customer-viewer"
                    checked={checkboxes['customer-viewer']}
                    onChange={handleCheckboxChange}
                    disabled={true}
                  />
                </td>
              </tr>
              <tr>
                <td>Partner</td>
                <td>
                  <input
                    type="checkbox"
                    name="partner"
                    checked={checkboxes.partner}
                    onChange={handleCheckboxChange}
                    disabled={true}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="partner-viewer"
                    checked={checkboxes['partner-viewer']}
                    onChange={handleCheckboxChange}
                    disabled={true}
                  />
                </td>
              </tr>
              <tr>
                <td>Select All</td>
                <td>
                  <input
                    type="checkbox"
                    name="selectAll"
                    checked={checkboxes.selectAll}
                    onChange={handleCheckboxChange}
                    disabled={true}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="selectAll-viewer"
                    checked={checkboxes['selectAll-viewer']}
                    onChange={handleCheckboxChange}
                    disabled={true}
                  />
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
};

export default Header;
