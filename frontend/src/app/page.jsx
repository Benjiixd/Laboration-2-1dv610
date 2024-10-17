"use client"

import Image from "next/image";
import ItemCard from "@/components/itemComponent/itemCard";



export default async function Home() {
  
  class HomeController {
    constructor() {
      this.items = [];
    }

    addItem(item) {
      this.items.push(item);
    }

    removeItem(item) {
      this.items = this.items.filter(i => i !== item);
    }

    async getItemsFromApi(username) {
      console.log("getItemsFromApi");
      try {
        const response = await fetch("http://localhost:3020/users/images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Setting the correct content type for JSON
          },
          body: JSON.stringify({ username }), // Send JSON payload instead of FormData
        });
        if (response.ok) {
          console.log("response ok");
          const result = await response.json(); // Parse JSON response
          console.log("users images:", result); // Logging response
          return result; // Return the result
        } else {
          console.error("Server error:", response.statusText);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    }
  }

    const controller = new HomeController()
    const items = await controller.getItemsFromApi("admin")
    console.log(items)
  

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <p>Hello waorld</p>
        <ItemCard></ItemCard>
        <ItemCard></ItemCard>
        <ItemCard></ItemCard>
        <ItemCard></ItemCard>
        <ItemCard></ItemCard>
        <ItemCard></ItemCard>
        <ItemCard></ItemCard>
      </main>

      
    </div>
  );
}
