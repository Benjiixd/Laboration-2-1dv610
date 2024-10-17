import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";


export default function ItemCard({ data }) {
    console.log("hello" + data);
    return (
        <Card>
            <CardHeader>
                <CardTitle>hello</CardTitle>
                <CardDescription>world</CardDescription>
            </CardHeader>
            <CardContent>
                <Image
                    src={`http://localhost:3020/images/${data}`}
                    width={200}
                    height={200}
                    alt={data}
                />
            </CardContent>
            <CardFooter>
                <p>first</p>
            </CardFooter>
        </Card>
    );
}
