"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Package, Clock, CheckCircle } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"

export function WhatsAppOrderCard() {
  const { items, total, clearCart } = useCart()
  const { toast } = useToast()
  const [isOrdering, setIsOrdering] = useState(false)

  const whatsappNumber = "+923297533820"
  const companyName = "SS Collections"

  const generateOrderMessage = () => {
    const orderNumber = `SS${Date.now().toString().slice(-6)}`
    let message = `🛍️ *New Order from ${companyName}*\n`
    message += `📋 Order #: ${orderNumber}\n`
    message += `📅 Date: ${new Date().toLocaleDateString()}\n\n`

    message += `📦 *Order Details:*\n`
    message += `${"─".repeat(30)}\n`

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`
      message += `   💰 Price: Rs ${item.price.toFixed(0)}\n`
      message += `   📊 Quantity: ${item.quantity}\n`
      if (item.size) message += `   📏 Size: ${item.size}\n`
      if (item.color) message += `   🎨 Color: ${item.color}\n`
      message += `   💵 Subtotal: Rs ${(item.price * item.quantity).toFixed(0)}\n\n`
    })

    message += `${"─".repeat(30)}\n`
    message += `💰 *Total Amount: Rs ${total.toFixed(0)}*\n\n`

    message += `📝 *Next Steps:*\n`
    message += `✅ Please confirm this order\n`
    message += `📍 Provide shipping address\n`
    message += `💳 Discuss payment method\n`
    message += `🚚 Get shipping cost & delivery time\n\n`

    message += `📞 Thank you for choosing ${companyName}!\n`
    message += `We'll respond with confirmation shortly. 😊`

    return encodeURIComponent(message)
  }

  const handleWhatsAppOrder = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before ordering",
        variant: "destructive",
      })
      return
    }

    setIsOrdering(true)

    try {
      const message = generateOrderMessage()
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace("+", "")}?text=${message}`

      // Open WhatsApp
      const newWindow = window.open(whatsappUrl, "_blank")

      if (newWindow) {
        // Clear cart after successful WhatsApp order
        setTimeout(() => {
          clearCart()
          toast({
            title: "Order Sent! 🎉",
            description: "Your order has been sent via WhatsApp. We'll confirm shortly!",
          })
        }, 2000)
      } else {
        toast({
          title: "Please allow popups",
          description: "Enable popups to open WhatsApp automatically",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process WhatsApp order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsOrdering(false)
    }
  }

  if (items.length === 0) {
    return (
      <Card className="border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-orange-600" />
            <div>
              <h3 className="font-semibold text-orange-800 dark:text-orange-200">Your cart is empty</h3>
              <p className="text-sm text-orange-600 dark:text-orange-300">
                Add some items to start your WhatsApp order
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-200">
          <MessageCircle className="h-6 w-6" />
          <span>WhatsApp Order Summary</span>
          <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
            Instant Response
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Summary */}
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Items:</span>
            <Badge variant="outline">{items.reduce((sum, item) => sum + item.quantity, 0)}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Order Value:</span>
            <span className="text-lg font-bold text-green-600">Rs ${total.toFixed(0)}</span>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            <span>Instant confirmation</span>
          </div>
          <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
            <Clock className="h-4 w-4" />
            <span>Real-time support</span>
          </div>
          <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
            <Package className="h-4 w-4" />
            <span>Custom packaging</span>
          </div>
          <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
            <MessageCircle className="h-4 w-4" />
            <span>Direct communication</span>
          </div>
        </div>

        {/* Order Button */}
        <Button
          onClick={handleWhatsAppOrder}
          disabled={isOrdering}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          {isOrdering ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>Opening WhatsApp...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Complete Order via WhatsApp</span>
            </div>
          )}
        </Button>

        {/* Trust Indicators */}
        <div className="text-center text-xs text-green-600 dark:text-green-400 space-y-1">
          <p>🔒 Secure • 📱 Mobile Friendly • 🚀 Fast Response</p>
          <p className="opacity-80">Average response time: &lt; 5 minutes</p>
        </div>
      </CardContent>
    </Card>
  )
}
