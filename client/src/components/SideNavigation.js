import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faUser, faCog, faHandshake, faTruck, faSignOutAlt, faBook } from "@fortawesome/free-solid-svg-icons";
import styles from "./SideNavigation.module.css";

const SideNavigation = () => {
  const navigate = useNavigate();

  const onDashboardClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onCustomerTextClick = useCallback(() => {
    navigate("/customers");
  }, [navigate]);

  const onAdminTextClick = useCallback(() => {
    navigate("/admin");
  }, [navigate]);

  const onPartnersTextClick = useCallback(() => {
    navigate("/partner");
  }, [navigate]);

  const onTransportTextClick = useCallback(() => {
    navigate("/transport");
  }, [navigate]);

  const onBoqTextClick = useCallback(() => {
    navigate("/boq");
  }, [navigate]);

  const onLogoutClick = useCallback(() => {
    localStorage.removeItem('token'); // Remove token
    navigate("/login"); // Redirect to login page
  }, [navigate]);

  return (
    <div className={styles.sidebarParent}>
      <div className={styles.sidebar} />
      <div className={styles.item} onClick={onDashboardClick}>
        <FontAwesomeIcon icon={faTachometerAlt} className={styles.icon} />
        Dashboard
      </div>
      <div className={styles.item} onClick={onCustomerTextClick}>
        <FontAwesomeIcon icon={faUser} className={styles.icon} />
        Customer
      </div>
      <div className={styles.item} onClick={onAdminTextClick}>
        <FontAwesomeIcon icon={faCog} className={styles.icon} />
        Admin
      </div>
      <div className={styles.item} onClick={onPartnersTextClick}>
        <FontAwesomeIcon icon={faHandshake} className={styles.icon} />
        Partners
      </div>
      <div className={styles.item} onClick={onTransportTextClick}>
        <FontAwesomeIcon icon={faTruck} className={styles.icon} />
        Transports
      </div>
      <div className={styles.item} onClick={onBoqTextClick}>
        <FontAwesomeIcon icon={faBook} className={styles.icon} />
        Boq
      </div>
      <div className={styles.logoutItem}>
        <button className={styles.logout} onClick={onLogoutClick}>
          <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
          Logout
        </button>
      </div>
      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} Vive Housebanao Technologies PVT LTD
      </div>
    </div>
  );
};

export default SideNavigation;
