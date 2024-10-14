import Image from "next/image";
import ItemCard from "@/components/itemComponent/itemCard";

export default function Home() {
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

    getItemsFromApi(username) {
      //Get items from API
    }

    getItems() {
      return this.items
    }

    }
  

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <p>Hello world</p>
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
