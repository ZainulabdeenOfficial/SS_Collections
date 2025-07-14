import { Resend } from "resend"

const resend = new Resend("re_DBJvp37i_VyGh9EwWuBARnCaGGaLni99N")

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "SS Collections <zu4425@gmail.com>",
      to: [email],
      subject: "Welcome to SS Collections!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Welcome to SS Collections!</h1>
            <p style="color: #666; font-size: 16px;">Thank you for joining our community</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #333; margin-bottom: 15px;">Hello ${name}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We're excited to have you as part of the SS Collections family. You now have access to:
            </p>
            <ul style="color: #666; line-height: 1.8; margin-left: 20px;">
              <li>Exclusive product collections</li>
              <li>Special member discounts</li>
              <li>Early access to new arrivals</li>
              <li>Personalized recommendations</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/products" 
               style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Start Shopping
            </a>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 14px;">
            <p>If you have any questions, feel free to contact us.</p>
            <p>Best regards,<br>The SS Collections Team</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Failed to send welcome email:", error)
    throw error
  }
}

export const sendPasswordResetEmail = async (email: string, resetToken: string, name: string) => {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`

    const { data, error } = await resend.emails.send({
      from: "SS Collections <zu4425@gmail.com>",
      to: [email],
      subject: "Reset Your Password - SS Collections",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Password Reset Request</h1>
            <p style="color: #666; font-size: 16px;">SS Collections</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #333; margin-bottom: 15px;">Hello ${name}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We received a request to reset your password for your SS Collections account. 
              Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; font-size: 14px;">
              This link will expire in 1 hour for security reasons. If you didn't request this password reset, 
              please ignore this email and your password will remain unchanged.
            </p>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 14px;">
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
            <p style="margin-top: 20px;">Best regards,<br>The SS Collections Team</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Failed to send password reset email:", error)
    throw error
  }
}

export const sendNewProductNotification = async (subscribers: string[], product: any) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "SS Collections <zu4425@gmail.com>",
      to: subscribers,
      subject: `New Product Alert: ${product.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">New Product Alert!</h1>
            <p style="color: #666; font-size: 16px;">SS Collections</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #333; margin-bottom: 15px;">${product.name}</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              ${product.description}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="font-size: 24px; font-weight: bold; color: #007bff; margin-bottom: 20px;">
                $${product.price}
              </p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/products/${product.id}" 
                 style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                View Product
              </a>
            </div>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 14px;">
            <p>Don't want to receive these notifications? 
               <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/unsubscribe" style="color: #007bff;">Unsubscribe</a>
            </p>
            <p>Best regards,<br>The SS Collections Team</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Failed to send product notification:", error)
    throw error
  }
}
