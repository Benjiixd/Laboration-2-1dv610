import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image";


export default function ItemCard({ item }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>green hoodie</CardTitle>
                <CardDescription>hoodie</CardDescription>
            </CardHeader>
            <CardContent>
                <Image src={'/hoodieImage.jpg'}
                    width={500}
                    height={500}
                    alt="Picture of the author"></Image>
            </CardContent>
            <CardFooter>
                <p>DIRTY</p>
            </CardFooter>
        </Card>
    );
    }