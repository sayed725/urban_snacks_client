"use client"

import { Filter } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useRouter, useSearchParams } from "next/navigation"
import { ICategory } from "@/types/category.type"

interface ProductsSidebarProps {
  categories: ICategory[]
}

export default function ProductsSidebar({ categories }: ProductsSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const selectedCategory = searchParams.get("category") || ""
  const isSpicy = searchParams.get("isSpicy") === "true"

  const updateCategory = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id) {
      params.set("category", id)
    } else {
      params.delete("category")
    }
    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  const toggleSpicy = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    if (checked) {
      params.set("isSpicy", "true")
    } else {
      params.delete("isSpicy")
    }
    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="w-full lg:w-64 shrink-0 space-y-4">
      <div className="p-5 bg-card border rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4 font-semibold text-lg border-b pb-2">
          <Filter className="w-5 h-5" /> Filters
        </div>

        <div className="space-y-2">
          <div>
            <h3 className="font-medium mb-3 text-sm text-muted-foreground">Category</h3>
            <div className="space-y-1 grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-0 overflow-x-auto">
              <div
                className={`cursor-pointer px-3 py-2 rounded-md transition-colors text-sm min-w-fit ${
                  selectedCategory === "" 
                    ? "bg-primary text-secondary font-medium" 
                    : "hover:bg-muted"
                }`}
                onClick={() => updateCategory("")}
              >
                All Snacks
              </div>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`cursor-pointer px-3 py-2 rounded-md transition-colors text-sm min-w-fit  ${
                    selectedCategory === cat.id 
                      ? "bg-primary text-secondary font-medium" 
                      : "hover:bg-muted"
                  }`}
                  onClick={() => updateCategory(cat.id)}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3 text-sm text-muted-foreground">Preferences</h3>
            <div className="flex items-center justify-between">
              <label className="text-sm cursor-pointer flex items-center gap-2" htmlFor="spicy-mode">
                <span className="text-lg">🌶️</span> Spicy Only
              </label>
              <Switch 
                id="spicy-mode" 
                checked={isSpicy} 
                onCheckedChange={toggleSpicy} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
