import React, {useState, useEffect} from "react";
import {Container, Logo, LogoutBtn} from "../index"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";

function Header(){

    const authStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();
    const [curUser, setCurUser] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        authService.getCurrentUser().then((user)=>{
            setCurUser(user);
            if(user){
                authService.getUserData(user.$id).then((data) => {
                    setUserData(data);
                }).catch(() => {
                    setUserData(null); 
                });
            }
        }).catch(error=>{
            // console.log(error);
            setCurUser(null);
        });
    }, []);

    const navItems = [
        {
            name: 'Home',
            slug: "/",
            active: true
        }, 
        {
            name: "Login",
            slug: "/login",
            active: !authStatus,
        },
        {
            name: "Signup",
            slug: "/signup",
            active: !authStatus,
        },
        {
            name: "All Posts",
            slug: "/all-posts",
            active: authStatus,
        },
        {
            name: "Add Post",
            slug: "/add-post",
            active: authStatus,
        },
        {
            name: "User",
            slug: userData ? `/user/${userData.username}` : "/",
            active: authStatus,
        }
    ]

    return(
        <header className='py-3 shadow bg-gray-300'>
            <Container>
                <nav className="flex">
                    <div className="mr-4">
                        <Link to='/'>
                            <Logo width="70px" />
                        </Link>
                    </div>
                    <ul className="flex ml-auto">
                        {navItems.map((item) => 
                            item.active ? (
                                <li key={item.name}>
                                    <button onClick={() =>{
                                        // console.log(`Navigating to: ${item.slug}`);
                                        navigate(item.slug);
                                    }} className="inline-block px-6 py-2 duration-200 hover:bg-blue-400 rounded-full">
                                        {item.name}
                                    </button>
                                </li>
                            ) : null )
                        }
                    </ul>
                    {authStatus && (
                        <li>
                            <LogoutBtn />
                        </li>
                    )}
                </nav>
            </Container>
        </header>
    )
}

export default Header