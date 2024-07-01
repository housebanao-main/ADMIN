import { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Customers from "./pages/Customers";
import Admin from "./pages/Admin";
import Setting from "./pages/Setting";
import Partner from "./pages/Partner";
import Profile from "./pages/Profile";
import Form from "./pages/Form";
import Transport from "./pages/Transport";
import Boq from "./pages/Boq";

function PrivateRoute({ element: Component }) {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return token ? <Component /> : null;
}

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "Dashboard";
        metaDescription = "Dashboard page";
        break;
      case "/login":
        title = "Login";
        metaDescription = "Login page";
        break;
      case "/customers":
        title = "Customers";
        metaDescription = "Customers page";
        break;
      case "/admin":
        title = "Admin";
        metaDescription = "Admin page";
        break;
      case "/setting":
        title = "Settings";
        metaDescription = "Settings page";
        break;
      case "/partner":
        title = "Partners";
        metaDescription = "Partners page";
        break;
      case "/profile":
        title = "Profile";
        metaDescription = "Profile page";
        break;
      case "/form":
        title = "Form";
        metaDescription = "Form page";
        break;
      case "/transport":
        title = "Transport";
        metaDescription = "Transport page";
        break;
      case "/boq":
          title = "Boq";
          metaDescription = "Boq Page";
          break;
      default:
        title = "App";
        metaDescription = "App page";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<PrivateRoute element={Dashboard} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/customers" element={<PrivateRoute element={Customers} />} />
      <Route path="/setting" element={<PrivateRoute element={Setting} />} />
      <Route path="/admin" element={<PrivateRoute element={Admin} />} />
      <Route path="/partner" element={<PrivateRoute element={Partner} />} />
      <Route path="/profile" element={<PrivateRoute element={Profile} />} />
      <Route path="/form" element={<PrivateRoute element={Form} />} />
      <Route path="/transport" element={<PrivateRoute element={Transport} />} />
      <Route path="/boq" element={<PrivateRoute element={Boq} />} />
    </Routes>
  );
}

export default App;
