import React from "react";
import { Link } from 'react-router-dom';
import authService from "../appwrite/auth";

function UserCard({ $id, username, name, profilePic, userQuote }) {
    return (
        <Link to={`/user/${username}`}>
            <div className="w-full bg-gray-100 rounded-xl p-4 flex items-center space-x-4 transform hover:scale-105 transition duration-300">
                
                {/* Circular Profile Picture */}
                <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex justify-center items-center">
                    {profilePic ? (
                        <img
                            src={authService.getFilePreview(profilePic)}
                            alt={username}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="text-gray-500">No Image</div>
                    )}
                </div>

                {/* User Information */}
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold">{username}</h2>
                    <h6 className="text-gray-600">{name}</h6>
                    <p className="italic text-gray-500">{userQuote}</p>
                </div>
            </div>
        </Link>
    );
}

export default UserCard;
