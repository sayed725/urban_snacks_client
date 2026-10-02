"use client"

import { useEffect, useState } from "react"
import { Filter, Sparkles, Tag } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

  const selectedCategoryName = searchParams.get("categoryName") || ""
  const selectedCategoryId = searchParams.get("category") || ""
  const isSpicy = searchParams.get("isSpicy") === "true"
  const isFeatured = searchParams.get("isFeatured") === "true"
  const searchTerm = searchParams.get("searchTerm") || ""

  const urlMinPrice = searchParams.get("minPrice") || ""
  const urlMaxPrice = searchParams.get("maxPrice") || ""

  const [minPrice, setMinPrice] = useState(urlMinPrice)
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice)

  useEffect(() => {
    setMinPrice(urlMinPrice)
    setMaxPrice(urlMaxPrice)
  }, [urlMinPrice, urlMaxPrice])

  const currentSort = searchParams.get("sortBy") || "createdAt"
  const currentOrder = searchParams.get("sortOrder") || "desc"
  const currentSortOption = `${currentSort}-${currentOrder}`

  const hasFilters = 
    selectedCategoryName !== "" || 
    selectedCategoryId !== "" || 
    isSpicy || 
    isFeatured || 
    urlMinPrice !== "" || 
    urlMaxPrice !== "" || 
    currentSort !== "createdAt" || 
    currentOrder !== "desc" || 
    searchTerm !== ""

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-")
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", sortBy)
    params.set("sortOrder", sortOrder)
    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  const updateCategory = (cat?: ICategory) => {
    const params = new URLSearchParams(searchParams.toString())
    if (cat) {
      params.set("categoryName", cat.name)
      params.set("category", cat.id)
    } else {
      params.delete("categoryName")
      params.delete("category")
    }
    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  const handleReset = () => {
    setMinPrice("")
    setMaxPrice("")
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

  const toggleFeatured = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    if (checked) {
      params.set("isFeatured", "true")
    } else {
      params.delete("isFeatured")
    }
    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  const handleApplyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (minPrice) {
      params.set("minPrice", minPrice)
    } else {
      params.delete("minPrice")
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice)
    } else {
      params.delete("maxPrice")
    }
    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="w-full lg:w-64 shrink-0 space-y-4">
      <div className="p-5 bg-card border rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Filter className="w-5 h-5 text-orange-500" /> Filters
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset} 
            disabled={!hasFilters}
            className="h-8 px-3 text-xs font-medium"
          >
            Reset
          </Button>
        </div>

        <div className="space-y-5">
          {/* Mobile Sort */}
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

          {/* Price Range Filter (On top of Category) */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 lg:border-t-0 lg:pt-0">
            <h3 className="font-medium mb-3 text-sm text-muted-foreground flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-orange-500" /> Price Range (৳)
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyPriceFilter()}
                  className="h-9 text-xs"
                />
                <span className="text-muted-foreground text-xs">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyPriceFilter()}
                  className="h-9 text-xs"
                />
              </div>
              <Button
                size="sm"
                onClick={handleApplyPriceFilter}
                className="w-full h-8 text-xs bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg"
              >
                Apply Price Filter
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <h3 className="font-medium mb-3 text-sm text-muted-foreground">Category</h3>
            <div className="space-y-1 grid lg:grid-cols-1 gap-2 lg:gap-0">
              <div
                className={`cursor-pointer px-3 py-2 rounded-md transition-colors text-sm min-w-fit ${
                  selectedCategoryName === "" && selectedCategoryId === ""
                    ? "bg-primary text-secondary dark:text-white font-medium"
                    : "hover:bg-muted"
                }`}
                onClick={() => updateCategory()}
              >
                All Snacks
              </div>
              {categories.map((cat) => {
                const isSelected =
                  (selectedCategoryId && cat.id === selectedCategoryId) ||
                  (selectedCategoryName && cat.name === selectedCategoryName)

                return (
                  <div
                    key={cat.id}
                    className={`cursor-pointer px-3 py-2 rounded-md transition-colors text-sm min-w-fit ${
                      isSelected
                        ? "bg-primary text-secondary font-medium dark:text-white"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => updateCategory(cat)}
                  >
                    {cat.name}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Preferences Filter */}
          <div className="border-t pt-4 border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="font-medium mb-3 text-sm text-muted-foreground">Preferences</h3>
            
            <div className="flex items-center justify-between">
              <label className="text-sm cursor-pointer flex items-center gap-2" htmlFor="featured-mode">
                <Sparkles className="w-4 h-4 text-amber-500" /> Featured Only
              </label>
              <Switch
                id="featured-mode"
                checked={isFeatured}
                onCheckedChange={toggleFeatured}
              />
            </div>

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
