import { ShoppingBag, Star, Zap } from "lucide-react";

const FeatureCard = () => {
  return (
      <section className="bg-secondary text-secondary-foreground py-8 border-y">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-border">
               <div className="px-4">
                  <div className="flex justify-center mb-2 text-primary"><ShoppingBag className="w-8 h-8" /></div>
                  <h3 className="font-bold">Premium Snacks</h3>
                  <p className="text-sm text-muted-foreground mt-1">Curated quality</p>
               </div>
               <div className="px-4">
                  <div className="flex justify-center mb-2 text-primary"><Zap className="w-8 h-8" /></div>
                  <h3 className="font-bold">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground mt-1">Right to your door</p>
               </div>
               <div className="px-4">
                  <div className="flex justify-center mb-2 text-primary"><Star className="w-8 h-8" /></div>
                  <h3 className="font-bold">Top Rated</h3>
                  <p className="text-sm text-muted-foreground mt-1">Loved by thousands</p>
               </div>
               <div className="px-4">
                  <div className="flex justify-center mb-2 text-primary"><span className="text-3xl">🛡️</span></div>
                  <h3 className="font-bold">Secure Checkout</h3>
                  <p className="text-sm text-muted-foreground mt-1">100% protected</p>
               </div>
            </div>
         </div>
      </section>
  )
}

export default FeatureCard