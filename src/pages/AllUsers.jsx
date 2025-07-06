import React, { useState, useEffect } from "react";
import { Container, UserCard } from "../components";
import authService from "../appwrite/auth";

function AllUsers() {
    const [users, setUsers] = useState([]);

    // useEffect(() => {}, [])

    // appwriteService.getPosts([]).then((posts) => {
    //     if(posts){
    //         setPosts(posts.documents)
    //     }
    // })

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await authService.getUsers([]);
            if (fetchedUsers) {
                setUsers(fetchedUsers.documents);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="w-full py-8">
            <Container>
                <div className="grid gap-6 grid-cols-1 place-items-center">
                    {users.map((user) => (
                        <div key={user.$id} className="w-full max-w-sm">
                            <UserCard {...user} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default AllUsers;
