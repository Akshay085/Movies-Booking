import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const navigate = useNavigate()

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
    const currency = import.meta.env.VITE_CURRENCY || '₹';

    const value = {
        axios,
        navigate,
        image_base_url,
        currency
    }

    return (
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)