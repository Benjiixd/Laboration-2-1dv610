import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ImageDisplay from "./ImageDisplay";
import StatusButton from "./StatusButton";

export default function ItemCard({ imageId }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [metadata, setMetadata] = useState(null);

    useEffect(() => {
        let isMounted = true;
        let objectUrl;

        async function fetchImage() {
            try {
                const response = await fetch(`http://localhost:3020/images/${imageId}`);
                if (response.ok) {
                    const metadataHeader = response.headers.get('metadata');
                    const parsedMetadata = metadataHeader ? JSON.parse(metadataHeader) : {};
                    if (isMounted) {
                        setMetadata(parsedMetadata);
                    }
                    const blob = await response.blob();
                    objectUrl = URL.createObjectURL(blob);
                    if (isMounted) {
                        setImageSrc(objectUrl);
                    }
                } else {
                    console.error('Image fetch failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        }

        fetchImage();
        return () => {
            isMounted = false;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [imageId]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{metadata?.title || 'Title'}</CardTitle>
                <CardDescription>{metadata?.description || 'Description'}</CardDescription>
            </CardHeader>
            <CardContent>
                <ImageDisplay imageSrc={imageSrc} description={metadata?.description} />
            </CardContent>
            <CardFooter>
                <StatusButton metadata={metadata} setMetadata={setMetadata} />
            </CardFooter>
        </Card>
    );
}
