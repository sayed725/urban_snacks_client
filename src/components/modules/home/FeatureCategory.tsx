import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const FeatureCategory = ({catsLoading, categories}: {catsLoading: boolean, categories: any[]}) => {
  return (
    <div className='bg-muted/30'>
       <section className="py-10  container w-11/12 mx-auto">
        <div className="flex justify-between items-end mb-10">
           <div>
              <h2 className="text-3xl md:text-5xl font-black mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent hover:from-amber-600 hover:to-orange-700 transition-all">Shop by Category</h2>
              <p className="text-muted-foreground">Find exactly what you're craving today.</p>
           </div>
           <Button asChild variant="ghost" className="hidden sm:flex bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white hover:text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 font-semibold  border-0">
              <Link href="/products">View All <ArrowRight className="w-4 h-4 ml-2" /></Link>
           </Button>
        </div>

        {catsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
               {[1,2,3,4,5].map(i => <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />)}
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
               {categories.map((cat, idx) => (
                  <Link href={`/products?category=${cat.id}`} key={cat.id} className="group relative overflow-hidden rounded-2xl h-40 bg-secondary border hover:shadow-lg transition-all">
                     {cat.image && <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" alt={cat.name} />}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                        <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                        <p className="text-white/80 text-xs">{cat._count?.items || 0} items</p>
                     </div>
                  </Link>
               ))}
            </div>
        )}
      </section>
    </div>
  )
}

export default FeatureCategory