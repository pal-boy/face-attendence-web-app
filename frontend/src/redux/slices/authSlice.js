import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";

const initialState = {
    isLoggedIn : localStorage.getItem('isLoggedIn') || false,
    role : localStorage.getItem('role') || "",
    // data: localStorage.getItem('data') != '' ? JSON.parse(localStorage.getItem('data')) : {}
};

export const createAccount = createAsyncThunk("/auth/signup", async(data)=>{
    try {
        console.log("Request Payload:", data);
        const res = axios.post(
            'http://localhost:5000/api/auth/register',data);
        toast.promise(res,{
            loading: "Wait! Creating your account",
            success : (data)=>{
                return data?.data?.message;
            },
            error: "Failed to create account"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createAccount.fulfilled, (state, response) => {
            console.log("Response Payload:", response?.payload);
            // localStorage.setItem("data", JSON.stringify(response?.payload?.data));
            localStorage.setItem("token", response?.payload?.token);
            localStorage.setItem("userId", response?.payload?.newUser?._id);
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", response?.payload?.newUser?.role);
            state.isLoggedIn = true;
            state.data = response?.payload?.newUser;
            state.role = response?.payload?.newUser?.role
        })
    }
});

export default authSlice.reducer;