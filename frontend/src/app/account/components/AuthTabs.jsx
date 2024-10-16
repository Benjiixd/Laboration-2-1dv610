'use client'

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "@/app/account/components/SignInForm";
import CreateAccountForm from "@/app/account/components/CreateAccountForm";


export default function AuthTabs({ currentTab, setCurrentTab, onSignIn, signInForm, onCreate, createForm, loginFailed }) {
    return (
        <Tabs defaultValue="signIn" className="w-[400px]" onValueChange={value => setCurrentTab(value)}>
            <TabsList>
                <TabsTrigger value="signIn">Sign in</TabsTrigger>
                <TabsTrigger value="Create">Create</TabsTrigger>
            </TabsList>
            <TabsContent value="signIn">
                {loginFailed}
                <SignInForm onSignIn={onSignIn} signInForm={signInForm} />
            </TabsContent>
            <TabsContent value="Create">
                <CreateAccountForm onCreate={onCreate} createForm={createForm} />
            </TabsContent>
        </Tabs>
    );
}
