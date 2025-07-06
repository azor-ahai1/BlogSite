import React from "react";
import { Link } from 'react-router-dom';
import authService from "../appwrite/auth";

function UserCard({ $id, username, name, profilePic, userQuote }) {
    return (
        <Link to={`/user/${username}`}>
            <div className="w-full bg-white rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-md hover:shadow-lg transition-transform hover:scale-[1.02] duration-300">
                
                {/* Circular Profile Picture */}
                <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-full overflow-hidden ring-2 ring-gray-300 shadow">
                    {profilePic ? (
                        <img
                            src={authService.getFilePreview(profilePic)}
                            alt={username}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                            No Image
                        </div>
                    )}
                </div>

                {/* User Info */}
                <div className="text-center sm:text-left w-full">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{username}</h2>
                    <h6 className="text-sm text-gray-500">{name}</h6>
                    <p className="mt-1 text-sm italic text-gray-600 line-clamp-2">{userQuote}</p>
                </div>
            </div>
        </Link>
    );
}

export default UserCard;
