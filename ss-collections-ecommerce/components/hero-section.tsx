"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const slides = [
  {
    id: 1,
    title: "New Spring Collection",
    subtitle: "Fresh styles for the season",
    description:
      "Discover our latest spring arrivals featuring contemporary designs and premium fabrics perfect for the warmer months ahead.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
    cta: "Shop Now",
    link: "/products?filter=new",
  },
  {
    id: 2,
    title: "Premium Quality",
    subtitle: "Crafted with excellence",
    description:
      "Every piece in our collection is carefully selected and crafted using the finest materials and attention to detail.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=600&fit=crop",
    cta: "Explore",
    link: "/products",
  },
  {
    id: 3,
    title: "Spring Sale - Up to 40% Off",
    subtitle: "Limited time offer",
    description:
      "Don't miss our biggest sale of the season. Premium fashion at unbeatable prices for a limited time only.",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop",
    cta: "Shop Sale",
    link: "/products?filter=sale",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-transform duration-700 ease-in-out",
            index === currentSlide ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full",
          )}
        >
          <div className="relative h-full w-full">
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl px-4">
                <h2 className="text-sm md:text-base font-medium mb-2 opacity-90">{slide.subtitle}</h2>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">{slide.title}</h1>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">{slide.description}</p>
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href={slide.link}>{slide.cta}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn("w-3 h-3 rounded-full transition-all", index === currentSlide ? "bg-white" : "bg-white/50")}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Static Content */}
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to SS Collections</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Discover the latest trends in fashion with our premium quality clothing for men and women.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Shop Now
            </Button>
          </Link>
          <Link href="/products?featured=true">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              Featured Items
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
