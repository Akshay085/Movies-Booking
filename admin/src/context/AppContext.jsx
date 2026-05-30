import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const navigate = useNavigate()
    const [adminToken, setAdminToken] = useState(
        localStorage.getItem("adminToken") || ""
    )
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
        !!localStorage.getItem("adminToken")
    )

    useEffect(() => {
        if (adminToken) {
            axios.defaults.headers.common['token'] = adminToken;
        } else {
            delete axios.defaults.headers.common['token'];
        }
    }, [adminToken])

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
    const currency = import.meta.env.VITE_CURRENCY || '₹';

    const loginAdmin = async (email, password) => {
        try {
            const { data } = await axios.post('/api/admin/login', { email, password });
            if (data.success) {
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