import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import {Button, Input, Logo} from "./index";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";


function Signup(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit} = useForm();
    const [error, setError] = useState("");

    const create = async(data) => {
        setError("")
        try{
            const userData = await authService.createAccount(data)
            if(userData){
                const userData = await authService.getCurrentUser()
                if(userData){
                    dispatch(login(userData))
                }
                // else{
                //     setError("Error creating account")
                //     console.log(error)
                // }
                navigate("/")
            }
        } catch(error) {
            setError(error.message);
            console.log(error.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-xl p-6 sm:p-10 shadow-md">
                <div className="mb-4 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold text-gray-800">Sign up to create account</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && (
                    <p className="text-red-600 mt-4 text-center text-sm">{error}</p>
                )}
                <form onSubmit={handleSubmit(create)} className="mt-6">
                    <div className="space-y-5">
                        <Input
                            label="Full Name:"
                            placeholder="Enter your full name"
                            {...register("name", { required: true })}
                        />
                        <Input
                            label="Email:"
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be valid",
                                },
                            })}
                        />
                        <Input
                            label="Username:"
                            placeholder="Enter your username"
                            {...register("username", { required: true })}
                        />
                        <Input
                            label="Password:"
                            placeholder="Enter your password"
                            type="password"
                            {...register("password", { required: true })}
                        />
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;