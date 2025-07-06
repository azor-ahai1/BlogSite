import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-8 px-4">
            <Container>
                <div className="w-full mb-6">
                    <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
                        alt={post.title}
                        className="w-full max-h-[500px] object-cover rounded-xl shadow-lg"
                    />
                    {isAuthor && (
                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="mr-2">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" className="w-fit" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                        {post.title}
                    </h1>
                </div>

                <div className="prose max-w-none prose-lg prose-slate dark:prose-invert">
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : null;
}