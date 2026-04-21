import React from 'react'

const ProductsDetailsLoadingSkeleton = () => {
  return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 pt-8 pb-20">
          <div className="h-6 bg-muted rounded w-32 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-24 space-y-4 animate-pulse">
              <div className="aspect-square bg-muted rounded-3xl" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-20 h-20 bg-muted rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-6 animate-pulse pt-4">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-12 bg-muted rounded w-3/4" />
              <div className="h-5 bg-muted rounded w-2/3" />
              <div className="h-10 bg-muted rounded w-40" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-muted rounded-2xl" />
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-32" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </div>
              <div className="h-px bg-muted w-full" />
              <div className="flex items-center gap-4">
                <div className="h-11 bg-muted rounded-xl w-36" />
                <div className="h-6 bg-muted rounded w-32 ml-auto" />
              </div>
              <div className="h-14 bg-muted rounded-2xl w-full" />
            </div>
          </div>
        </div>
      </div>
  )
}

export default ProductsDetailsLoadingSkeleton