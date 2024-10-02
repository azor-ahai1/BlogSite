import React, { useState, useEffect } from "react";
import authService from "../../appwrite/auth";
import service from "../../appwrite/config";
import { Link } from "react-router-dom";
import { Button, Input } from '../index';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function User({ user }) {
    const [posts, setPosts] = useState([]);
    const [blogsCount, setBlogsCount] = useState(0);
    const [edit, setEdit] = useState(false);

    const authUser = useSelector(state => state.auth.userData);
    const [userData, setUserData] = useState(null);
    const [authUserData, setAuthUserData] = useState(null);

    useEffect(() => {
        if (authUser) {
            authService.getUserData(authUser.$id)
                .then(data => setAuthUserData(data))
                .catch(error => console.error("Error fetching user data:", error));
        }
    }, [authUser]);
    
    
    // useEffect(()=>{
        //     if(!isOwnProfile){
    //         setUserData(user);
    //     }
    // })
    
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

    const navigate = useNavigate();
    
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

    console.log(authUser)
    console.log(user)
    console.log(authUserData)

    return (  
        edit ? (
            <form onSubmit={handleSubmit(submit)} className="flex flex-wrap w-full p-6 min-h-fit bg-gray-500">
                <div className="w-full flex flex-row p-4 justify-end">
                    <button onClick={() => (navigate("/all-users"))} className="bg-red-500 text-white p-2 mx-4 rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                        All Users
                    </button>
                    {isOwnProfile && (
                        <button onClick={toggleEdit} className="bg-red-500 text-white p-2 rounded-lg shadow-md mx-4 transition-transform duration-200 hover:scale-105">
                            Cancel
                        </button>
                    )}
                </div>
                <div className="flex w-4/5 flex-col items-center md:flex-row md:items-start md:w-full md:space-x-8">
                    <div className="md:w-1/3 p-4 flex flex-col items-center">
                        <div className="w-fit flex flex-col items-center">
                            <div className="w-48 h-48 mb-4 flex flex-col items-center rounded-full overflow-hidden shadow-md">
                                {userData?.profilePic ? (
                                    <img
                                        src={authService.getFilePreview(userData.profilePic)}
                                        alt={`${userData.username}'s Profile Pic`}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="bg-gray-200 w-full h-full flex items-center justify-center rounded-full">
                                        <span className="text-gray-500">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="w-fit">
                                <Input type="file" className="mb-4" accept="image/*" {...register("image")} />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-semibold text-gray-800">{userData?.username}</p>
                                <p className="text-gray-600">{userData?.email}</p>
                                <p className="text-gray-600">{userData?.name}</p>
                            </div>
                            <div className="w-2/3">
                                <Input className="mt-4 mb-4 bg-gray-500 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" {...register("userQuote")} />
                            </div>
                            <div className="mt-4 text-center">
                                <p className="font-semibold text-gray-800">
                                    Total Blogs: <span className="text-blue-500">{blogsCount}</span>
                                </p>
                            </div>
                            <Button type="submit" bgColor="bg-green-500" className="w-fit mt-4 py-2 rounded-lg text-white font-semibold transition-transform duration-200 hover:scale-105">
                                Submit
                            </Button>
                        </div>
                    </div>
                    <div className="mt-8 md:mt-0 md:w-2/3">
                        <BlogPosts posts={posts} />
                    </div>
                </div>
            </form>
        ) : (
            <div className="flex flex-wrap w-full min-h-fit bg-gray-500 ">
                <div className="w-full flex flex-row p-4 justify-end">
                    <button onClick={() => (navigate("/all-users"))} className="bg-red-500 text-white p-2 mx-4 rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
                        All Users
                    </button>
                    {isOwnProfile && (
                        <button onClick={toggleEdit} className="bg-red-500 text-white p-2 rounded-lg shadow-md mx-4 transition-transform duration-200 hover:scale-105">
                            Edit
                        </button>
                    )}
                </div>
                <div className="flex flex-col items-center md:flex-row md:items-start md:w-full md:space-x-8">
                    <div className="md:w-1/3 p-4 flex flex-col  items-center" >
                        <div className="shadow-sm p-12 shadow-black w-fit">
                            <div className="w-48 h-48 mb-4 text-center rounded-full overflow-hidden shadow-md">
                                {userData?.profilePic ? (
                                    <img
                                        src={authService.getFilePreview(userData.profilePic)}
                                        alt={`${userData.username}'s Profile Pic`}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="bg-gray-500 w-full h-full flex items-center justify-center rounded-full">
                                        <span className="text-gray-500">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-gray-800">{userData?.username}</h1>
                                <p className="text-gray-600">{userData?.email}</p>
                                <p className="text-gray-600">{userData?.name}</p>
                            </div>
                            <div className="mt-4 text-center">
                                <blockquote className="italic text-yellow-400">"{userData?.userQuote}"</blockquote>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="font-semibold text-gray-800">
                                    Total Blogs: <span className="text-blue-800">{blogsCount}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 md:mt-0 md:w-2/3">
                        <BlogPosts posts={posts} />
                    </div>
                </div>
            </div>
        )              
    );
}

function BlogPosts({ posts }) {
    return (
        <div className="md:w-2/3 p-4 w-full">
            <h2 className="text-xl font-semibold w-full mb-4">Recent Blog Posts</h2>
            <div className="flex flex-wrap w-full">
                {posts.map(post => (
                    <div key={post.$id} className="w-full md:w-1/3 p-2 hover:scale-105">
                        <Link to={`/post/${post.$id}`} className="block bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img
                                src={service.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="h-40 w-full object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-bold">{post.title}</h3>
                                <p className="text-gray-600">
                                    Posted on {post.dateCreated} at {post.timeCreated}
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default User;