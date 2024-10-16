'use client'

import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'

export default function Header() {
    let pathname = usePathname();
    pathname = pathname === '/' ? 'Home' : pathname.charAt(1).toUpperCase() + pathname.slice(2);

    return (
        <header className="flex items-center justify-between w-full p-8 bg-#e5e7eb">
            <h1 className="text-2xl font-bold">mAI gym</h1>
            <nav className="flex gap-4">
                <Link href="/test">
                    <p className="text-2xl font-bold cursor-pointer">{pathname}</p> {/* Changed to an <a> tag inside Link */}
                </Link>
            </nav>
            <Link href="/account">
            <h1 className="text-2xl font-bold">LOGIN</h1>
            </Link>
        </header>
    );
}