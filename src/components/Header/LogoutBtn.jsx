import React from "react";
import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";

function LogoutBtn() {
    const dispatch = useDispatch();

    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout());
        });
    };

    return (
        <button
            onClick={logoutHandler}
            className="inline-block px-6 py-2 bg-red-500 text-white font-semibold rounded-full shadow-sm hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
            Logout
        </button>
    );
}

export default LogoutBtn;
