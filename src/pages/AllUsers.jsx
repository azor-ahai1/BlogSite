import React, {useState, useEffect} from "react";
import { Container, UserCard } from "../components/index";
import authService from "../appwrite/auth"

function AllUsers(){

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

    return(
        <div className="w-full py-8">
            <Container>
                <div className="flex flex-col items-center">
                    {users.map((user) => (
                        <div key={user.$id} className="p-3 w-3/5"> 
                                <UserCard {...user} />
                        </div> 
                    ))}
                </div>    
            </Container>
        </div>
    )
}

export default AllUsers