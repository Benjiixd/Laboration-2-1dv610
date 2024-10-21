import React from "react";

export default function ImageDisplay({ imageSrc, description }) {
    return (
        <>
            {imageSrc ? (
                <img
                    src={imageSrc}
                    width={200}
                    height={200}
                    alt={description || 'Image'}
                />
            ) : (
                <p>Loading image...</p>
            )}
        </>
    );
}
