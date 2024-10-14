"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React, { useState } from 'react';
import Cookies from 'js-cookie' // Import js-cookie for handling cookies
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation' // Import useRouter for client-side navigation
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { AlertCircle } from "lucide-react"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

const signInSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
})
const createSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
})

export function FailedLogin() {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                Error during login.
            </AlertDescription>
        </Alert>
    )
}

export default function ProfileForm() {
    const router = useRouter(); // Initialize the router
    const signInForm = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    });
    const createForm = useForm({
        resolver: zodResolver(createSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    });
    const [loginFailed, setLoginFailed] = useState(false);
    const [currentTab, setCurrentTab] = useState('signIn');

    const onSignIn = async (data) => {
        try {
            console.log("Sign In", data);
            const response = await fetch('http://localhost:3020/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (response.ok){
                const responseData = await response.json(); // Process the JSON response
                console.log("Response Data:", responseData);
                console.log("success")
                Cookies.set('token', responseData.token); // Save the token in the cookies
                
                router.push('/') // Use router.push for client-side navigation
                
            }
            console.log(response);
            setLoginFailed(false); // Reset the login failed state on successful login
            
        } catch (error) {
            console.error('Fetch failed:', error);
            setLoginFailed(true); // Set the login failed state on error
        }
    }

    const onCreate = (data) => {
        console.log("Create", data);
        const response = fetch('http://localhost:3020/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            router.push('/login')
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    return (
        <main className="flex h-[770px] w-screen flex-col items-center">
            <Card>
                <CardHeader>
                    <CardTitle>{currentTab === 'signIn' ? 'Sign In' : 'Create Account'}</CardTitle>
                    <CardDescription>{currentTab === 'signIn' ? 'Sign In to your' : 'Create a new'} mAI gym account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="signIn" className="w-[400px]" onValueChange={value => setCurrentTab(value)}>
                        <TabsList>
                            <TabsTrigger value="signIn">Sign in</TabsTrigger>
                            <TabsTrigger value="Create">Create</TabsTrigger>
                        </TabsList>
                        <TabsContent value="signIn">
                            {loginFailed && <FailedLogin />}
                            <Form {...signInForm}>
                                <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-8">
                                    <FormField
                                        control={signInForm.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="username" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This is your public display name.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signInForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Password" type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Sign in</Button>
                                </form>
                            </Form>
                        </TabsContent>
                        <TabsContent value="Create">
                            <Form {...createForm}>
                                <form onSubmit={createForm.handleSubmit(onCreate)} className="space-y-8">
                                    <FormField
                                        control={createForm.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="username" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This is your public display name.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={createForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Password" type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Create</Button>
                                </form>
                            </Form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter>
                    <p>Terms of service</p>
                </CardFooter>
            </Card>
        </main>
    )
}
