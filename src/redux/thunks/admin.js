import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "../../constants/config";
import axios from "axios";

const adminLogin = createAsyncThunk("admin/login", async (secretKey) => {

    try {
        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        }

        const { data } = await axios.post(`${server}/api/v1/admin/verify`, { secretKey }, config);
        
        return data.message
    } catch (error) {
        throw error.response?.data?.message
    }
})

const getAdminData = createAsyncThunk("admin/getadmindata", async() => {
    try {
        const config = {
            withCredentials: true,
        }

        const { data } = await axios.get(`${server}/api/v1/admin/`, config);
        
        return data.admin
    } catch (error) {
        throw error.response?.data?.message
    }
})

const adminLogout = createAsyncThunk("admin/logout", async() => {
    try {
        const config = {
            withCredentials: true,
        }

        const { data } = await axios.get(`${server}/api/v1/admin/logout`, config);
        
        return data.message
    } catch (error) {
        throw error.response?.data?.message
    }
})

export { 
    adminLogin,
    getAdminData,
    adminLogout
}