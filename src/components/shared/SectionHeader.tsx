import { Badge } from "../ui/badge"


const SectionHeader = ({title, description, badge}: {title: string, description?: string, badge?: string}) => {
  return (
    <div>
      {badge && <Badge className="mb-2 bg-amber-600 text-white border-none py-1 px-3 font-bold text-xs tracking-wider">{badge}</Badge>}
      <h2 className="text-3xl md:text-5xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent hover:from-amber-600 hover:to-orange-700 transition-all">{title}</h2>
      {description && <p className="text-muted-foreground text-lg leading-relaxed">{description}</p>}
    </div>
  )
}

export default SectionHeader