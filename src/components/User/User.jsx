import React, { useState, useEffect } from "react";
import authService from "../../appwrite/auth";
import service from "../../appwrite/config";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from '../index';
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

function User({ user }) {
    const [posts, setPosts] = useState([]);
    const [blogsCount, setBlogsCount] = useState(0);
    const [edit, setEdit] = useState(false);
    const authUser = useSelector(state => state.auth.userData);
    const [userData, setUserData] = useState(null);
    const [authUserData, setAuthUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (authUser) {
            authService.getUserData(authUser.$id)
                .then(data => setAuthUserData(data))
                .catch(error => console.error("Error fetching user data:", error));
        }
    }, [authUser]);

    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            username: user?.username,
            profilePic: user?.profilePic || null,
            userQuote: user?.userQuote || '',
        },
    });

    useEffect(() => {
        if (user) {
            setValue("userQuote", user.userQuote || '');
            setUserData(user);
        }
    }, [user, setValue]);

    const isOwnProfile = user?.username === authUserData?.username;

    const submit = async (data) => {
        let file = null;
        if (data.image?.[0]) {
            file = await authService.uploadFile(data.image[0]);
        }

        const updatedUser = {
            ...data,
            profilePic: file ? file.$id : user.profilePic,
        };

        if (user?.profilePic && file) {
            await authService.deleteFile(user.profilePic);
        }

        const dbUser = await authService.updateUserData(user.$id, updatedUser);
        if (dbUser) {
            setEdit(false);
            setUserData(dbUser);
            navigate(`/user/${dbUser.username}`);
        }
    };

    const toggleEdit = () => setEdit(!edit);

    useEffect(() => {
        if (userData) {
            service.getPosts([]).then(posts => {
                const userPosts = posts.documents.filter(post => post.userId === userData.$id);
                setPosts(userPosts);
                setBlogsCount(userPosts.length);
            }).catch(error => console.error("Error fetching posts:", error));
        }
    }, [userData]);

    return edit ? (
        <form onSubmit={handleSubmit(submit)} className="flex flex-col w-full p-6 min-h-fit bg-gray-500 gap-6">
            <div className="flex justify-end gap-4">
                <button onClick={() => navigate("/all-users")} className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform">
                    All Users
                </button>
                {isOwnProfile && (
                    <button onClick={toggleEdit} className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform">
                        Cancel
                    </button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-6 w-full">
                <div className="md:w-1/3 w-full flex flex-col items-center bg-gray-400 rounded-lg shadow-md p-4">
                    <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
                        {userData?.profilePic ? (
                            <img src={authService.getFilePreview(userData.profilePic)} alt="Profile Pic" className="w-full h-full object-cover" />
                        ) : (
                            <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                        )}
                    </div>
                    <Input type="file" className="w-full mb-4" accept="image/*" {...register("image")} />
                    <div className="text-center">
                        <p className="font-semibold">{userData?.username}</p>
                        <p>{userData?.email}</p>
                        <p>{userData?.name}</p>
                    </div>
                    <Input className="mt-4 w-full p-2 rounded-lg" {...register("userQuote")} />
                    <p className="mt-4">Total Blogs: <span className="text-blue-600 font-semibold">{blogsCount}</span></p>
                    <Button type="submit" bgColor="bg-green-500" className="w-full mt-4">Submit</Button>
                </div>
                <div className="md:w-2/3 w-full">
                    <BlogPosts posts={posts} />
                </div>
            </div>
        </form>
    ) : (
        <div className="flex flex-col w-full min-h-fit bg-gray-500 p-6 gap-6">
            <div className="flex justify-end gap-4">
                <button onClick={() => navigate("/all-users")} className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform">
                    All Users
                </button>
                {isOwnProfile && (
                    <button onClick={toggleEdit} className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform">
                        Edit
                    </button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-6 w-full">
                <div className="md:w-1/4 w-full bg-gray-400 p-6 rounded-lg shadow-md text-center">
                    <div className="w-40 h-40 mb-4 rounded-full overflow-hidden mx-auto">
                        {userData?.profilePic ? (
                            <img src={authService.getFilePreview(userData.profilePic)} alt="Profile Pic" className="w-full h-full object-cover" />
                        ) : (
                            <div className="bg-gray-500 w-full h-full flex items-center justify-center text-white">No Image</div>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{userData?.username}</h2>
                    <p className="text-gray-700">{userData?.email}</p>
                    <p className="text-gray-700">{userData?.name}</p>
                    {userData?.userQuote && <blockquote className="italic text-yellow-300 mt-4">"{userData?.userQuote}"</blockquote>}
                    <p className="mt-4">Total Blogs: <span className="text-blue-600 font-semibold">{blogsCount}</span></p>
                </div>
                <div className="md:w-2/3 w-full">
                    <BlogPosts posts={posts} />
                </div>
            </div>
        </div>
    );
}

function BlogPosts({ posts }) {
    return (
        <div className="w-full p-4">
            <h2 className="text-xl font-semibold mb-4">Recent Blog Posts</h2>
            <div className="flex flex-wrap gap-4">
                {posts.map(post => (
                    <div key={post.$id} className="w-full md:w-1/3">
                        <Link to={`/post/${post.$id}`} className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                            <img
                                src={service.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-bold">{post.title}</h3>
                                <p className="text-sm text-gray-600">{post.dateCreated} | {post.timeCreated}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default User;
