import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Container, PostCard, Button } from "../components/index";

function Home() {
    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        appwriteService.getPosts([]).then((res) => {
            if (res?.documents) {
                setPosts(res.documents.slice(0, 3)); // limit to 3 posts
            }
        });
    }, []);

    if (!authStatus) {
        return (
            <div className="w-full min-h-[80vh] px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="animate-fade-in-up">
                    <h1 className="text-6xl sm:text-7xl font-extrabold text-gray-900 drop-shadow mb-4">
                        Blog<span className="text-blue-900">Site</span>
                    </h1>
                    <p className="text-xl sm:text-2xl text-black max-w-2xl mx-auto mb-8">
                        Where thoughts turn into stories and stories into inspiration.
                    </p>
                    <Button
                        onClick={() => navigate("/login")}
                        className="px-10 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg shadow-lg transition duration-200"
                    >
                        Login to Continue
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full pt-10 min-h-[85vh]">
            <Container>
                <div className="text-center mb-12">
                    <h1 className="text-6xl sm:text-7xl font-extrabold text-gray-900 mb-3 tracking-tight drop-shadow-sm">
                        Blog<span className="text-blue-900">Site</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-black mb-4">
                        Where thoughts turn into stories and stories into inspiration.
                    </p>
                    {userData?.name && (
                        <h2 className="text-xl sm:text-2xl font-semibold text-green-900">
                            Welcome, <span className="text-amber-900">{userData.name}</span>
                        </h2>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <PostCard
                                key={post.$id}
                                $id={post.$id}
                                title={post.title}
                                featuredImage={post.featuredImage}
                                dateCreated={post.dateCreated}
                                timeCreated={post.timeCreated}
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-600 text-lg">
                            No recent posts available.
                        </p>
                    )}
                </div>

                <div className="text-center">
                    <Button
                        onClick={() => navigate("/all-posts")}
                        className="px-10 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium shadow-md"
                    >
                        View All Blogs
                    </Button>
                </div>
            </Container>
        </div>
    );

}

export default Home;
