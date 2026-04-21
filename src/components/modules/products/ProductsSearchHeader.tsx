"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProductsSearchHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentSearch = searchParams.get("searchTerm") || ""
  const currentSort = searchParams.get("sortBy") || "createdAt"
  const currentOrder = searchParams.get("sortOrder") || "desc"
  const currentSortOption = `${currentSort}-${currentOrder}`

  const [searchTerm, setSearchTerm] = useState(currentSearch)

  // Debounced search update
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== currentSearch) {
        const params = new URLSearchParams(searchParams.toString())
        if (searchTerm) {
          params.set("searchTerm", searchTerm)
        } else {
          params.delete("searchTerm")
        }
        router.push(`/products?${params.toString()}`, { scroll: false })
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, searchParams, router, currentSearch])

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-")
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", sortBy)
    params.set("sortOrder", sortOrder)
    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl md:text-5xl font-black mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent hover:from-amber-600 hover:to-orange-700 transition-all">
          Our Snacks
        </h1>
        <p className="text-muted-foreground mt-2">Find the perfectly curated snacks for your cravings</p>
      </div>

      <div className="flex w-full md:w-auto items-center gap-3 relative flex-wrap sm:flex-nowrap">
        <div className="relative w-full sm:w-[250px] md:w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search snacks..."
            className="pl-9 w-full bg-background border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-[180px]">
          <Select value={currentSortOption} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full bg-background border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Sort by" />
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
      </div>
    </div>
  )
}
