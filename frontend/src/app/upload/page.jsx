"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Page() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("file", file);
        try {
            const response = await fetch("http://localhost:3020/images", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                const result = await response.json();
                console.log("Data submitted successfully", result.data_id);
            } else {
                console.error("Server error:", response.statusText);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid w-full max-w-sm gap-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <Label htmlFor="picture">Picture</Label>
                <Input
                    id="picture"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                />
            </div>
            <Button type="submit">Submit</Button>
        </form>
    );
}
