import React, { useState, useEffect } from "react";
import { User as UserComponent } from "../components/index";
import { useParams } from "react-router-dom";
import authService from "../appwrite/auth";
import appwriteService from "../appwrite/config";

function User() {
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [curUser, setCurUser] = useState(null);
    const { username } = useParams(); // Get the username from the URL

    useEffect(() => {
        if (username) {
            // Fetch user data using the username (instead of getCurrentUser)
            authService.getUserDataByUsername(username).then(
                (data) => setUserData(data) // Use the fetched data
            ).catch(
                () => setUserData(null)
            );

            appwriteService.getPosts([]).then((posts) => {
                if (posts) {
                    setPosts(posts.documents);
                }
            });
        }
    }, [username]); // Add username to the dependency array

    return (
        <div className="py-8">
            <UserComponent user={userData} />
        </div>
    );
}

export default User;






// import React, {useState, useEffect} from "react";
// import { User as UserComponent } from "../components/index";
// import authService from "../appwrite/auth";
// import appwriteService from "../appwrite/config";


// function User(){
//     const [userData, setUserData] = useState(null);
    

//     const [posts, setPosts] = useState([]);
//     const [curUser, setCurUser] = useState(null);

//     useEffect(() => {
//         authService.getCurrentUser()
//             .then(user => {
//                 setCurUser(user);
//                 if(user){
//                     authService.getUserData(user.$id).then(
//                         data => setUserData(data)
//                     ).catch(
//                         () => setUserData(null)
//                     );
//                 }
//             }).catch(error => {
//                 setCurUser(null);
//                 console.error("Error fetching current user:", error);
//             }
//         );
//         appwriteService.getPosts([]).then((posts)=>{
//             if(posts){
//                 setPosts(posts.documents)
//             }
//         });
//     }, []);

    
//     return(
//         <div className="py-8">
//             <UserComponent user={userData} />
//         </div>
//     )
// }

// export default User





// useEffect(() => {
    //     if (curUser) {
    //         appwriteService.getPosts([]).then(
    //             (posts) => {
    //                 const userPosts = posts.documents.filter(post => post.userId === curUser.$id);
    //                 setPosts(userPosts);
    //             }).catch(error => {
    //                 console.error("Error fetching posts:", error);
    //             }
    //         );
    //     }
    //     console.log(posts);
    // }, [curUser]);

    // useEffect(() => {
    //         authService.getCurrentUser().then((user)=>{
    //             setCurUser(user);
    //         }).catch(error=>{
    //             setCurUser(null);
    //         });
    //         if(curUser){
    //             appwriteService.getPosts([]).then((posts)=>{
    //                 if(posts.$id === curUser.$id){
    //                     setPosts(posts.documents)
    //                 }
    //             });
    //         }
    // }, []);

    // useEffect(() => {
    //     authService.getCurrentUser().then((user)=>{
    //         if(user){
    //             authService.getUserData(user.$id).then((data) => {
    //                 setUserData(data);
    //             }).catch(() => {
    //                 setUserData(null); 
    //             });
    //         }
    //     }).catch(error=>{
    //         throw error;
    //     });
    // }, []);














































// Befor adding edit button

// import React, {useState, useEffect} from "react";
// import { User as UserComponent } from "../components/index";
// import authService from "../appwrite/auth";
// import appwriteService from "../appwrite/config";


// function User(){
//     const [userData, setUserData] = useState(null);
    

//     const [posts, setPosts] = useState([]);
//     const [curUser, setCurUser] = useState(null);

//     useEffect(() => {
//         authService.getCurrentUser()
//             .then(user => {
//                 setCurUser(user);
//                 if(user){
//                     authService.getUserData(user.$id).then(
//                         data => setUserData(data)
//                     ).catch(
//                         () => setUserData(null)
//                     );
//                 }
//             }).catch(error => {
//                 setCurUser(null);
//                 console.error("Error fetching current user:", error);
//             }
//         );
//         appwriteService.getPosts([]).then((posts)=>{
//             if(posts){
//                 setPosts(posts.documents)
//             }
//         });
//     }, []);

//     // useEffect(() => {
//     //     if (curUser) {
//     //         appwriteService.getPosts([]).then(
//     //             (posts) => {
//     //                 const userPosts = posts.documents.filter(post => post.userId === curUser.$id);
//     //                 setPosts(userPosts);
//     //             }).catch(error => {
//     //                 console.error("Error fetching posts:", error);
//     //             }
//     //         );
//     //     }
//     //     console.log(posts);
//     // }, [curUser]);

//     // useEffect(() => {
//     //         authService.getCurrentUser().then((user)=>{
//     //             setCurUser(user);
//     //         }).catch(error=>{
//     //             setCurUser(null);
//     //         });
//     //         if(curUser){
//     //             appwriteService.getPosts([]).then((posts)=>{
//     //                 if(posts.$id === curUser.$id){
//     //                     setPosts(posts.documents)
//     //                 }
//     //             });
//     //         }
//     // }, []);

//     // useEffect(() => {
//     //     authService.getCurrentUser().then((user)=>{
//     //         if(user){
//     //             authService.getUserData(user.$id).then((data) => {
//     //                 setUserData(data);
//     //             }).catch(() => {
//     //                 setUserData(null); 
//     //             });
//     //         }
//     //     }).catch(error=>{
//     //         throw error;
//     //     });
//     // }, []);

//     return(
//         <div className="py-8">
//             <UserComponent {...userData} />
//         </div>
//     )
// }

// export default User