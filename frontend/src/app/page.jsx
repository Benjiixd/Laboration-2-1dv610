"use client";

import { useNameFromToken } from "@/lib/tokenReader";
import { useEffect, useState } from "react";
import ItemCard from "@/components/itemComponent/itemCard";
import Cookies from "js-cookie";

export default function Home() {
  const [items, setItems] = useState([]);
  const getItemsFromApi = async (username) => {
    try {
      const response = await fetch("http://localhost:3020/users/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Setting the correct content type for JSON
        },
        body: JSON.stringify({ username }), // Send JSON payload
      });
      if (response.ok) {
        const result = await response.json(); // Parse JSON response
        setItems(result); // Update state with fetched items
      } else {
        console.error("Server error:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }; 

  useEffect(() => {
    const authStatus = Cookies.get("auth-status");
    const username = useNameFromToken(authStatus);
    getItemsFromApi(username);
  }, []);
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {items.map((item, index) => (
            <ItemCard key={index} imageId={item} />
          ))}
        </div>
      </main>
    </div>
  );
}
