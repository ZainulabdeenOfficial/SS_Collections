import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    name: "Men's Fashion",
    image: "/placeholder.svg?height=300&width=400",
    href: "/products?category=men",
  },
  {
    name: "Women's Fashion",
    image: "/placeholder.svg?height=300&width=400",
    href: "/products?category=women",
  },
]

export function CategorySection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
