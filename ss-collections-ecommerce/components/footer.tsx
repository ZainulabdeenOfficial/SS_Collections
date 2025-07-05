import Link from "next/link"

export function Footer() {
  return (
    <footer className="backdrop-blur bg-white/80 dark:bg-zinc-900/80 border-t border-border dark:border-zinc-800 py-8 mt-16 transition-all">
      <div className="container mx-auto px-6 text-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">SS Collections</h3>
            <p className="text-gray-400 mb-4">Your premier destination for fashion-forward clothing.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Twitter
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=men" className="text-gray-400 hover:text-white transition-colors">
                  Men's Fashion
                </Link>
              </li>
              <li>
                <Link href="/products?category=women" className="text-gray-400 hover:text-white transition-colors">
                  Women's Fashion
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="text-gray-400 hover:text-white transition-colors">
                  Featured Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-400">
              <p>123 Fashion Street</p>
              <p>New York, NY 10001</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@sscollections.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SS Collections. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
