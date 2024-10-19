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

    // Function to handle status change
    const handleStatusChange = async () => {
        if (!metadata || !metadata.id) {
            console.error('Metadata or metadata.id is missing');
            return;
        }
        try {
            const response = await fetch('http://localhost:3020/images/changeIsDirty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: metadata.id }),
            });
            if (response.ok) {
                // Toggle the isDirty status in the state
                setMetadata((prevMetadata) => ({
                    ...prevMetadata,
                    isDirty: !prevMetadata.isDirty,
                }));
                console.log('Status changed successfully');
            } else {
                console.error('Failed to change status:', response.statusText);
            }
        } catch (error) {
            console.error('Error changing status:', error);
        }
    };

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
                <Button
                    onClick={handleStatusChange}
                    className={metadata?.isDirty ? 'bg-red-500' : 'bg-green-500'}
                >
                    {metadata?.isDirty ? 'Dirty' : 'Clean'}
                </Button>
            </CardFooter>
        </Card>
    );
}
