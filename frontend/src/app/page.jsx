"use client";

import { useEffect, useState } from "react";
import ItemCard from "@/components/itemComponent/itemCard";
// COMMENT THIS BENEATH IS MAINLY WRITTEN BY CHATGPT BECAUSE IT WAS FUCKED
export default function Home() {
  const [items, setItems] = useState([]);

  // Function to fetch items from API
  const getItemsFromApi = async (username) => {
    console.log("getItemsFromApi");
    try {
      const response = await fetch("http://localhost:3020/users/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Setting the correct content type for JSON
        },
        body: JSON.stringify({ username }), // Send JSON payload
      });
      if (response.ok) {
        console.log("response ok");
        const result = await response.json(); // Parse JSON response
        console.log("users images:", result); // Logging response
        setItems(result); // Update state with fetched items
      } else {
        console.error("Server error:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  // Function to fetch a single image (if needed)
  const getImage = async (imageId) => {
    try {
      const response = await fetch(`http://localhost:3020/images/${imageId}`);
      if (response.ok) {
        const result = await response.blob(); // Assuming you're getting an image blob
        return result;
      } else {
        console.error("Server error:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  // useEffect to fetch items when the component mounts
  useEffect(() => {
    getItemsFromApi("admin");
  }, []); // Empty dependency array ensures this runs once after component mounts

  console.log("items2:", items);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <p>Hello world</p>
        {items.map((item, index) => (
          <ItemCard key={index} imageId={item} />
        ))}
      </main>
    </div>
  );
}
