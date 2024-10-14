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

class ItemCardController {
    constructor() {
        this.Image
        this.Name
        this.Description
        this.Status
    }

    setStatus(status) {
        this.Status = status
    }
}

export default function ItemCard({ item }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>green hoodie</CardTitle>
                <CardDescription>hoodie</CardDescription>
            </CardHeader>
            <CardContent>
                <Image src={'/hoodieImage.jpg'}
                    width={200}
                    height={200}
                    alt="Picture of the author"></Image>
            </CardContent>
            <CardFooter>
                <p>DIRTY</p>
            </CardFooter>
        </Card>
    );
    }