"use client"

import { Filter } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { ICategory } from "@/types/category.type"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProductsSidebarProps {
  categories: ICategory[]
}

export default function ProductsSidebar({ categories }: ProductsSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedCategory = searchParams.get("category") || ""
  const isSpicy = searchParams.get("isSpicy") === "true"

  const currentSort = searchParams.get("sortBy") || "createdAt"
  const currentOrder = searchParams.get("sortOrder") || "desc"
  const currentSortOption = `${currentSort}-${currentOrder}`

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-")
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", sortBy)
    params.set("sortOrder", sortOrder)
    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  const updateCategory = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id) {
      params.set("category", id)
    } else {
      params.delete("category")
    }
    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  const handleReset = () => {
    router.push("/products", { scroll: false })
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
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Filter className="w-5 h-5" /> Filters
          </div>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleReset} 
            className="h-8 px-2 tbg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white hover:text-white rounded-md transition-all duration-300 font-semibold border-0 text-xs"
          >
            Reset
          </Button>
        </div>

        <div className="space-y-4">
          <div className="lg:hidden">
            <h3 className="font-medium mb-3 text-sm text-muted-foreground">Sort By</h3>
            <Select value={currentSortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full bg-background border-slate-200 dark:border-slate-800 focus:ring-orange-500/20">
                <SelectValue placeholder="Sort snacks..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest Arrivals</SelectItem>
                <SelectItem value="createdAt-asc">Oldest Arrivals</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 lg:border-t-0 lg:pt-0">
            <h3 className="font-medium mb-3 text-sm text-muted-foreground">Category</h3>
            <div className="space-y-1 grid lg:grid-cols-1 gap-2 lg:gap-0">
              <div
                className={`cursor-pointer px-3 py-2 rounded-md transition-colors text-sm min-w-fit ${selectedCategory === ""
                  ? "bg-primary text-secondary dark:text-white font-medium"
                  : "hover:bg-muted"
                  }`}
                onClick={() => updateCategory("")}
              >
                All Snacks
              </div>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`cursor-pointer px-3 py-2 rounded-md transition-colors text-sm min-w-fit  ${selectedCategory === cat.id
                      ? "bg-primary text-secondary font-medium dark:text-white"
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
