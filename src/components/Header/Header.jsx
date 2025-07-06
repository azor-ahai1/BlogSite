import React, { useState, useEffect } from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import authService from "../../appwrite/auth";

function Header() {
    const authStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();
    const [curUser, setCurUser] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        authService.getCurrentUser()
            .then((user) => {
                setCurUser(user);
                if (user) {
                    authService.getUserData(user.$id)
                        .then((data) => {
                            setUserData(data);
                        })
                        .catch(() => {
                            setUserData(null);
                        });
                }
            })
            .catch(error => {
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
    ];

    return (
        <header className="py-3 shadow bg-gray-300">
            <Container>
                <nav className="flex flex-col md:flex-row items-center md:justify-between gap-4">
                    <div className="flex items-center justify-between w-full md:w-auto">
                        <Link to="/">
                            <Logo width="70px" height="50px"/>
                        </Link>
                    </div>

                    <ul className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 w-full md:w-auto text-center">
                        {navItems.map((item) =>
                            item.active ? (
                                <li key={item.name}>
                                    <button
                                        onClick={() => {
                                            // console.log(`Navigating to: ${item.slug}`);
                                            navigate(item.slug);
                                        }}
                                        className="inline-block px-5 py-2 rounded-full text-black hover:bg-blue-200 transition duration-200"
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ) : null
                        )}
                        {authStatus && (
                            <li>
                                <LogoutBtn />
                            </li>
                        )}
                    </ul>
                </nav>
            </Container>
        </header>
    );
}

export default Header;