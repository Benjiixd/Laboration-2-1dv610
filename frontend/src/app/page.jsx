import Image from "next/image";
import ItemCard from "@/components/itemComponent/itemCard";

class HomeController {
  constructor() {
    this.items = []
  }

  addItem(item) {
    this.items.push(item)
  }

  removeItem(item) {
    this.items = this.items.filter(i => i !== item)
  }

  async getItemsFromApi(username) {
    console.log("getItemsFromApi")
    try {
      const formData = new FormData();
      formData.append("username", username);
      const response = await fetch("http://localhost:3020/users/images", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("response ok")
        const result = await response.json();
        console.log("users images:", result);
        return result
      } else {
        console.error("Server error:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  getItems() {
    return this.items
  }

}

export default function Home() {
  

    const controller = new HomeController()
    const items = controller.getItemsFromApi("admin")
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
