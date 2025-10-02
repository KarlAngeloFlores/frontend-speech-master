import axios from "axios";
import api from "./api.service"


const API_URL = import.meta.env.VITE_API_URL;

const authService = {
    login: async (email, password) => {
        try {
            
            const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
            return data;

        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg); 
        }
    },

    register: async (email, first_name, last_name, middle_name) => {
        try {
            
            const { data } = await axios.post(`${API_URL}/auth/register`, { email, first_name, last_name, middle_name });
            return data;

        } catch (error) {
            console.log(error);
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg); 
        }
    },

    registerAndVerify: async (token, password, code) => {
        try {
            
            const { data } = await axios.post(`${API_URL}/auth/verify`, { token, password, code });
            return data;

        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg); 
        }
    },

    logout: async () => {
        try {

            const { data } = await axios.post(`${API_URL}/auth/logout`);
            localStorage.removeItem('accessToken');
            return data;

        } catch (error) {
                    const msg = error.response?.data?.message || error.message;
        throw new Error(msg); 
        }
    },

    me: async () => {
        try {
            const { data } = await api.get('/auth/me');
            return data;
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg); 
        }
    },

    forgotPassword: async (email) => {
        try {

            const { data } = await axios.post(`${API_URL}/auth/forgot_password`, { email });
            return data;

        } catch (error) {
                    const msg = error.response?.data?.message || error.message;
        throw new Error(msg); 
        }
    },

    verifyResetPassword: async (email, code) => {
        try {

            const { data } = await axios.post(`${API_URL}/auth/verify_forgot_password`, { email, code });
            return data;

        } catch (error) {
                    const msg = error.response?.data?.message || error.message;
        throw new Error(msg); 
        }
    },

    confirmNewPassword: async (email, newPassword, confirmPassword) => {
        try {

            const { data } = await axios.post(`${API_URL}/auth/confirm_new_password`, { email, newPassword, confirmPassword });
            return data;

        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg); 
        }
    },

    resendVerification: async (email, purpose) => {
        try {
            
            const { data } = await axios.post(`${API_URL}/auth/resend_code`, { email, purpose });
            return data;

        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg); 
        }
    }

    

    
}

export default authService;