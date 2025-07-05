"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, ThumbsUp, MessageSquare, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Review {
  id: number
  rating: number
  title?: string
  comment?: string
  user_full_name?: string
  user_avatar_url?: string
  helpful_count: number
  verified_purchase: boolean
  created_at: string
}

interface ProductReviewsProps {
  productId: number
  productName: string
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
  })
  const [submittingReview, setSubmittingReview] = useState(false)

  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    loadReviews()
  }, [productId])

  const loadReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error("Error loading reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const submitReview = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to submit a review",
        variant: "destructive",
      })
      return
    }

    if (!reviewForm.rating || reviewForm.rating < 1 || reviewForm.rating > 5) {
      toast({
        title: "Invalid rating",
        description: "Please select a rating between 1 and 5 stars",
        variant: "destructive",
      })
      return
    }

    setSubmittingReview(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          ...reviewForm,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Review submitted!",
          description: "Thank you for your review. It will appear after approval.",
        })
        setShowReviewForm(false)
        setReviewForm({ rating: 5, title: "", comment: "" })
        loadReviews() // Reload reviews
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit review",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const markHelpful = async (reviewId: number, isHelpful: boolean) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to mark reviews as helpful",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHelpful }),
      })

      if (response.ok) {
        loadReviews() // Reload to get updated helpful count
        toast({
          title: "Thank you!",
          description: "Your feedback has been recorded",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      })
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
            disabled={!interactive}
          >
            <Star className={`h-5 w-5 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          </button>
        ))}
      </div>
    )
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review) => review.rating === star).length,
    percentage:
      reviews.length > 0 ? (reviews.filter((review) => review.rating === star).length / reviews.length) * 100 : 0,
  }))

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Reviews</span>
            <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Write Review
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                  <DialogDescription>Share your experience with {productName}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label>Rating</Label>
                    {renderStars(reviewForm.rating, true, (rating) => setReviewForm((prev) => ({ ...prev, rating })))}
                  </div>

                  <div>
                    <Label htmlFor="review-title">Title (optional)</Label>
                    <Input
                      id="review-title"
                      placeholder="Summarize your review"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="review-comment">Review</Label>
                    <Textarea
                      id="review-comment"
                      placeholder="Tell others about your experience with this product"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={submitReview} disabled={submittingReview}>
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-500 mb-4">Be the first to review this product!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
                {renderStars(Math.round(averageRating))}
                <p className="text-sm text-gray-500 mt-2">
                  Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="md:col-span-2 space-y-2">
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-sm w-12">
                      <span>{star}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={review.user_avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{review.user_full_name || "Anonymous"}</span>
                          {review.verified_purchase && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {review.title && <h4 className="font-medium text-gray-900">{review.title}</h4>}

                    {review.comment && <p className="text-gray-700 leading-relaxed">{review.comment}</p>}

                    <div className="flex items-center space-x-4 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markHelpful(review.id, true)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful ({review.helpful_count})
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
