import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("");

    const login = async (data) => {
        setError("");
        try {
            const session = await authService.login(data);
            if (session) {
                const userData = await authService.getCurrentUser();
                if (userData) {
                    dispatch(authLogin(userData));
                }
                navigate("/");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-10">
                <div className="mb-4 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>

                <h2 className="text-center text-2xl font-bold text-gray-800">
                    Sign in to your account
                </h2>

                <p className="mt-2 text-center text-sm text-gray-600">
                    Don&apos;t have an account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>

                {error && (
                    <p className="text-red-600 mt-4 text-center text-sm">{error}</p>
                )}

                <form onSubmit={handleSubmit(login)} className="mt-6">
                    <div className="space-y-5">
                        <Input
                            label="Email:"
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                },
                            })}
                        />
                        <Input
                            label="Password:"
                            placeholder="Enter your password"
                            type="password"
                            {...register("password", { required: true })}
                        />
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
