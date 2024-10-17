import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

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
                    // Access response headers
                    const metadataHeader = response.headers.get('metadata');
                    console.log('Headers:', metadataHeader);

                    // Extract metadata from headers
                    const parsedMetadata = metadataHeader ? JSON.parse(metadataHeader) : {};
                    console.log('Metadata:', parsedMetadata);

                    if (isMounted) {
                        setMetadata(parsedMetadata);
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
    }, [imageId]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{metadata?.title || 'Title'}</CardTitle>
                <CardDescription>{metadata?.description || 'Description'}</CardDescription>
            </CardHeader>
            <CardContent>
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        width={200}
                        height={200}
                        alt={metadata?.description || 'Image'}
                    />
                ) : (
                    <p>Loading image...</p>
                )}
            </CardContent>
            <CardFooter>
                <p>Status: {metadata?.isDirty ? 'Dirty' : 'Clean'}</p>
                {metadata && (
                    <div>
                        <p>Content-Type: {metadata.mimetype}</p>
                        {/* Display more metadata as needed */}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
