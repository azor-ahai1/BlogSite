import React from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";

function PostCard({ $id, title, featuredImage, dateCreated, timeCreated }) {
    return (
        <Link to={`/post/${$id}`} className="block">
            <div className="w-full bg-white rounded-xl p-4 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition duration-300">
                <div className="w-full aspect-video bg-gray-200 rounded-xl overflow-hidden mb-4">
                    {featuredImage ? (
                        <img
                            src={appwriteService.getFilePreview(featuredImage)}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-500">
                            No Image Available
                        </div>
                    )}
                </div>
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{title}</h2>
                    <p className="text-sm text-gray-500">📅 {dateCreated}</p>
                    <p className="text-sm text-gray-500">⏰ {timeCreated}</p>
                </div>
            </div>
        </Link>
    );
}

export default PostCard;
