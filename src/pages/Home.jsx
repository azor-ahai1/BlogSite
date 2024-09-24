import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components/index";
import appwriteService from "../appwrite/config";
import { useSelector } from "react-redux";
import authService from "../appwrite/auth";

function AllPosts() {
    const authStatus = useSelector((state) => state.auth.status);
    const [posts, setPosts] = useState([]);
    const [curUser, setCurUser] = useState(null);


    useEffect(() => {
            authService.getCurrentUser().then((user)=>{
                setCurUser(user);
            }).catch(error=>{
                setCurUser(null);
            });
            appwriteService.getPosts([]).then((posts)=>{
                if(posts){
                    setPosts(posts.documents)
                }
            });
    }, []);

    if (!authStatus) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className='w-full py-8'>
            <div className="text-center">
                {curUser && <div>{curUser.email}</div>}
            </div>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;






// import React, {useState, useEffect} from "react";
// import { Container, PostCard } from "../components/index";
// import appwriteService from "../appwrite/config"
// import { useSelector } from "react-redux";
// import authService from "../appwrite/auth";

// function AllPosts(){
//     const authStatus = useSelector((state) => state.auth.status);
//     const [posts, setPosts] = useState([]);
//     const curUser = authService.getCurrentUser();

//     useEffect(() => {
//         appwriteService.getPosts([]).then((posts) => {
//             if(posts){
//                 setPosts(posts.documents)
//             }
//         })
//     }, [])

//     if (!authStatus || posts.length === 0) {
//         return (
//             <div className="w-full py-8 mt-4 text-center">
//                 <Container>
//                     <div className="flex flex-wrap">
//                         <div className="p-2 w-full">
//                             <h1 className="text-2xl font-bold hover:text-gray-500">
//                                 Login to read posts
//                             </h1>
//                         </div>
//                     </div>
//                 </Container>
//             </div>
//         )
//     }
//     return (
//         <div className='w-full py-8'>
//             <div className="text-center">
//                 {authStatus && (
//                     <div>
//                         {curUser ? curUser.email : null} 
//                     </div>
//                 )}
//             </div>
//             <Container>
//                 <div className='flex flex-wrap'>
//                     {posts.map((post) => (
//                         <div key={post.$id} className='p-2 w-1/4'>
//                             <PostCard {...post} />
//                         </div>
//                     ))}
//                 </div>
//             </Container>
//         </div>
//     )
// }

// export default AllPosts