import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function ItemCard({ data }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [metadata, setMetadata] = useState(null);

    useEffect(() => {
        let isMounted = true;
        let objectUrl;

        async function fetchImage() {
            try {
                const response = await fetch(`http://localhost:3020/images/${data}`);
                if (response.ok) {
                    // Access response headers
                    const headers = response.headers;

                    // Extract metadata from headers
                    const metadata = {
                        contentType: headers.get('Content-Type'),
                        customHeader: headers.get('X-Custom-Header'),
                        // Add more headers as needed
                    };

                    if (isMounted) {
                        setMetadata(metadata);
                    }

                    // Get image blob
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

        // Cleanup function to revoke the object URL
        return () => {
            isMounted = false;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [data.id]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{data.name || 'Title'}</CardTitle>
                <CardDescription>{data.description || 'Description'}</CardDescription>
            </CardHeader>
            <CardContent>
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        width={200}
                        height={200}
                        alt={data.alt || 'Image'}
                    />
                ) : (
                    <p>Loading image...</p>
                )}
            </CardContent>
            <CardFooter>
                <p>Status: {data.status || 'Status'}</p>
                {metadata && (
                    <div>
                        <p>Content-Type: {metadata.contentType}</p>
                        <p>Custom Header: {metadata.customHeader}</p>
                        {/* Display more metadata as needed */}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
