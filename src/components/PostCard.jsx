import React from "react";
import { Link } from 'react-router-dom';
import appwriteService from "../appwrite/config";
import { useNavigate } from "react-router-dom";

function PostCard({ $id, title, featuredImage, dateCreated, timeCreated}) {
    const navigate = useNavigate();
    return (
        <Link to={`/post/${$id}`}>
            {/* navigate(`/post/${$id}`) */}
            <div className="w-full bg-gray-100 rounded-xl p-4 transform hover:scale-105 transition duration-300">
                <div className="w-full h-64 bg-gray-200 rounded-xl mb-4 flex justify-center items-center">
                    {featuredImage ? (
                        <img
                            src={appwriteService.getFilePreview(featuredImage)}
                            alt={title}
                            className="rounded-xl object-fill h-full w-full"
                        />
                    ) : (
                        <div className="text-gray-500">No Image Available</div>
                    )}
                </div>
                <h2 className="text-xl font-bold">{title}</h2>
                {/* <br> */}
                <h6>Date Created : {dateCreated} </h6>
                <h6>Time Created : {timeCreated} </h6>
            </div>
        </Link>
    );
}

export default PostCard;
