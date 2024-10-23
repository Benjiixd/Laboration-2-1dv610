import React from "react";
import { Button } from "@/components/ui/button";

export default function StatusButton({ metadata, setMetadata }) {
    const handleStatusChange = async () => {
        try {
            const response = await fetch('http://localhost:3020/images/changeIsDirty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: metadata.id }),
            });
            if (response.ok) {
                setMetadata((prevMetadata) => ({
                    ...prevMetadata,
                    isDirty: !prevMetadata.isDirty,
                }));
            } else {
                console.error('Failed to change status:', response.statusText);
            }
        } catch (error) {
            console.error('Error changing status:', error);
        }
    };

    return (
        <Button
            onClick={handleStatusChange}
            className={metadata?.isDirty ? 'bg-red-500' : 'bg-green-500'}
        >
            {metadata?.isDirty ? 'Dirty' : 'Clean'}
        </Button>
    );
}
