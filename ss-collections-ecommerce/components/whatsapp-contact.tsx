"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"

export function WhatsAppContact() {
  return <WhatsAppFloatingButton />
}

export function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false)

  const handleWhatsAppClick = () => {
    const phoneNumber = "+923297533820" // Updated WhatsApp number
    const message = "Hi! I'm interested in your products from SS Collections."
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 shadow-lg"
          size="sm"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </div>

      {/* WhatsApp Contact Card */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border p-4 w-80">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">SS Collections Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Typically replies instantly</p>
            </div>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Hi there! 👋 How can we help you today? Feel free to ask about our products, shipping, or any other
            questions you might have.
          </p>

          <Button onClick={handleWhatsAppClick} className="w-full bg-green-500 hover:bg-green-600">
            <MessageCircle className="w-4 h-4 mr-2" />
            Start Chat on WhatsApp
          </Button>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">We'll respond as soon as possible</p>
        </div>
      )}
    </>
  )
}
