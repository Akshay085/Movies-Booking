import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

// Initialize header synchronously on startup if token exists in localStorage
const savedToken = localStorage.getItem("adminToken");
if (savedToken) {
    axios.defaults.headers.common['token'] = savedToken;
}

export const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const navigate = useNavigate()
    const [adminToken, setAdminToken] = useState(savedToken || "")
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!savedToken)

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
    const currency = import.meta.env.VITE_CURRENCY || '₹';

    const loginAdmin = async (email, password) => {
        try {
            const { data } = await axios.post('/api/admin/login', { email, password });
            if (data.success) {
                // Set the header synchronously before triggering state updates
                axios.defaults.headers.common['token'] = data.token;
                
                localStorage.setItem("adminToken", data.token);
                setAdminToken(data.token);
                setIsAdminAuthenticated(true);
                toast.success("Welcome back, Admin!");
                navigate("/");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const logoutAdmin = () => {
        localStorage.removeItem("adminToken");
        // Clear header synchronously
        delete axios.defaults.headers.common['token'];
        setAdminToken("");
        setIsAdminAuthenticated(false);
        toast.success("Logged out successfully");
        navigate("/");
    };

    const value = {
        axios,
        navigate,
        image_base_url,
        currency,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin
    }

    return (
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)