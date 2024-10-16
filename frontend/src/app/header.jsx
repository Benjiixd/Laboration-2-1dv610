'use client'

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import Cookies from "js-cookie";

export default function Header() {
    const pathname = usePathname() === '/' ? 'Home' : usePathname().charAt(1).toUpperCase() + usePathname().slice(2);

    const [username, setUsername] = useState(null); // Store the username

    useEffect(() => {
        // Fetch the auth-status cookie when the component mounts
        const authStatus = Cookies.get('auth-status');

        if (authStatus) {
            try {
                const parsedAuthStatus = JSON.parse(authStatus); // Parse the JSON string
                if (parsedAuthStatus && parsedAuthStatus.username) {
                    setUsername(parsedAuthStatus.username); // Set the username in the state
                }
            } catch (error) {
                console.error('Error parsing auth-status cookie:', error);
            }
        }
    }, []);

    return (
        <header className="flex items-center justify-between w-full p-8 bg-#e5e7eb">
            <Link href="/upload">
                <h1 className="text-2xl font-bold">UPLOAD</h1>
            </Link>
            
            <nav className="flex gap-4">
                <Link href="/test">
                    <p className="text-2xl font-bold cursor-pointer">{pathname}</p> {/* Changed to an <a> tag inside Link */}
                </Link>
            </nav>
            <Link href={username ? "/profile" : "/account"}>
                <h1 className="text-2xl font-bold">{username ? `Welcome, ${username}` : "LOGIN"}</h1>
            </Link>
        </header>
    );
}
