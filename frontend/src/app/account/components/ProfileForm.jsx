"use client";

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import AuthTabs from "@/app/account/components/AuthTabs";


const schemas = {
    signInSchema: z.object({
        username: z.string().min(2, { message: "Username must be at least 2 characters." }),
        password: z.string().min(2, { message: "Password must be at least 2 characters." }),
    }),
    createSchema: z.object({
        username: z.string().min(2, { message: "Username must be at least 2 characters." }),
        password: z.string().min(2, { message: "Password must be at least 2 characters." }),
    }),
};

export default function ProfileForm() {
    const router = useRouter();
    const [loginFailed, setLoginFailed] = useState(false);
    const [currentTab, setCurrentTab] = useState('signIn');

    const signInForm = useForm({
        resolver: zodResolver(schemas.signInSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    });

    const createForm = useForm({
        resolver: zodResolver(schemas.createSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    });

    const onSignIn = async (data) => {
        try {
            const response = await fetch('http://localhost:3020/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const responseData = await response.json();
            Cookies.set('token', responseData.token);
            router.push('/');
            setLoginFailed(false);
        } catch (error) {
            setLoginFailed(true);
        }
    };

    const onCreate = async (data) => {
        try {
            const response = await fetch('http://localhost:3020/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = response.status
            console.log(result)
            if (result.ok){
                window.location.reload();
            }
            
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <main className="flex h-[770px] w-screen flex-col items-center">
            <Card>
                <CardHeader>
                    <CardTitle>{currentTab === 'signIn' ? 'Sign In' : 'Create Account'}</CardTitle>
                    <CardDescription>{currentTab === 'signIn' ? 'Sign In to your' : 'Create a new'} mAI gym account</CardDescription>
                </CardHeader>
                <CardContent>
                    <AuthTabs
                        currentTab={currentTab}
                        setCurrentTab={setCurrentTab}
                        onSignIn={onSignIn}
                        signInForm={signInForm}
                        onCreate={onCreate}
                        createForm={createForm}
                        loginFailed={loginFailed}
                    />
                </CardContent>
                <CardFooter>
                    <p>Terms of service</p>
                </CardFooter>
            </Card>
        </main>
    );
}
