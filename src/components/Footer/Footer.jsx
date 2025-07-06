import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../index";
import { FaGithub } from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-gray-300 py-2 mt-10">
            <div className="max-w-7xl mx-auto px-4 flex flex-col gap-6 md:flex-row md:justify-between md:items-center">

                {/* Logo and Copyright */}
                <div className="flex flex-col items-center justify-center text-center">
                    <Logo width="120px" height="70px" />
                    <span className="text-sm text-gray-700 mt-2">© BlogSite 2024. All rights reserved.</span>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col md:flex-row items-center justify-center text-center gap-2 md:gap-6">
                    <Link to="/" className="text-gray-800 hover:text-gray-600 font-medium">Home</Link>
                    <Link to="/all-posts" className="text-gray-800 hover:text-gray-600 font-medium">All Posts</Link>
                </div>

                {/* Connect With Us */}
                <div className="flex flex-col items-center justify-center text-center gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-medium">Connect with us:</span>
                        <a
                            href="https://github.com/azor-ahai1/BlogSite"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-800 hover:text-black text-xl"
                            aria-label="GitHub"
                        >
                            <FaGithub />
                        </a>
                    </div>
                    <span className="text-sm text-gray-700">Made with ❤️ by Aashish Shukla.</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
