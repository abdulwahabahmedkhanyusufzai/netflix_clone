import {create} from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
export const useAuthStore = create((set)=> ({
    user:null,
    isSignUp:false,
    isLoggingOut:true,
    signup: async (credentials) => {
        set({isSignUp : true})
        try {
            const response = await axios.post("/api/auth/signup",credentials);
            set({user:response.data.user,isSignUp:false});
            toast.success("Sign Up Successful");
        } catch (error) {
            toast.error(error.response.data.message || "Sign Up Failed");
            set({isSignUp:false,user:null});
        }
    },
    login: async (credentials) => {
        try {
            const response = await axios.post("/api/auth/login",credentials);
            set({user: response.data.user, isLoggingOut:false})
            toast.success("Login Successfully");
        } catch (error) {
            set({isLoggingOut:false,user:null});
            toast.error(error.response.data.message || "Login failed")
        }
    },
    logout: async () => {
        set({isLoggingOut:true})
        try {
            await axios.post("/api/auth/logout")
            set({user:null, isLoggingOut:false})
        } catch (error) {
            set({isLoggingOut:false});
            toast.error(error.response.data.message || "Logout failed");
        }
    },
    authCheck: async() => {
        set({isCheckingAuth:true});
        try {
            const response = await axios.get("/api/auth/authCheck");
            set({user: response.data.user, isCheckingAuth:false});
        } catch (error) {
            set({isCheckingAuth:false});
            toast.error(error.response.data.message || "An error Occured");
        }
    },
}))