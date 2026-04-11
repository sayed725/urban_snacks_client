import { Badge } from "../ui/badge"


const SectionHeader = ({title, description, badge}: {title: string, description: string, badge?: string}) => {
  return (
    <div>
      {badge && <Badge className="mb-2 bg-amber-500 text-white border-none py-1 px-3">{badge}</Badge>}
      <h2 className="text-3xl md:text-5xl font-black mb-2 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent hover:from-amber-600 hover:to-orange-700 transition-all">{title}</h2>
      <p className="text-muted-foreground text-lg">{description}</p>
    </div>
  )
}

export default SectionHeader