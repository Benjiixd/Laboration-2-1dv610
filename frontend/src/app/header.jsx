'use client'

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import Cookies from "js-cookie";
import { useNameFromToken } from "@/lib/tokenReader";

export default function Header() {
    const pathname = usePathname() === '/' ? 'Home' : usePathname().charAt(1).toUpperCase() + usePathname().slice(2);
    const [username, setUsername] = useState(null); // Store the username
    useEffect(() => {
        const authStatus = Cookies.get('auth-status');
        if (authStatus) 
            try {
                setUsername(useNameFromToken(authStatus)); // Set the username in the state                
            } catch (error) {
                console.error('Error parsing auth-status cookie:', error);
            }        
    }, []);
    return (
        <header className="flex items-center justify-between w-full p-8 bg-#e5e7eb">
            <Link href="/upload">
                <h1 className="text-2xl font-bold">UPLOAD</h1>
            </Link>           
            <nav className="flex gap-4">
                <Link href="/">
                    <p className="text-2xl font-bold cursor-pointer">{pathname}</p> {}
                </Link>
            </nav>
            <Link href={username ? "/account" : "/account"}>
                <h1 className="text-2xl font-bold">{username ? `Welcome, ${username}` : "LOGIN"}</h1>
            </Link>
        </header>
    );
}
