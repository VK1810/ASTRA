"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Check, X, MapPin, Clock, AlertTriangle, User, Camera, Navigation } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Mock data for failed attendance attempts
const mockFailedAttempts = [
  {
    id: "fa1",
    eventId: "1",
    eventTitle: "Annual Conference 2023",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    userImage: "/placeholder.svg?height=200&width=200&text=Unknown+User",
    reason: "face_not_recognized",
    location: {
      lat: 40.7128,
      lng: -74.006,
      address: "123 Main St, New York, NY",
    },
    deviceInfo: "iPhone 14 Pro - Safari",
    status: "pending",
  },
  {
    id: "fa2",
    eventId: "1",
    eventTitle: "Annual Conference 2023",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    userImage: "/placeholder.svg?height=200&width=200&text=Jane+Doe",
    reason: "outside_perimeter",
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: "456 Broadway, New York, NY",
    },
    deviceInfo: "Samsung Galaxy S23 - Chrome",
    status: "pending",
  },
  {
    id: "fa3",
    eventId: "2",
    eventTitle: "Team Building Workshop",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    userImage: "/placeholder.svg?height=200&width=200&text=John+Smith",
    reason: "face_not_recognized",
    location: {
      lat: 40.7505,
      lng: -73.9934,
      address: "789 Park Ave, New York, NY",
    },
    deviceInfo: "MacBook Pro - Chrome",
    status: "approved",
  },
  {
    id: "fa4",
    eventId: "1",
    eventTitle: "Annual Conference 2023",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    userImage: "/placeholder.svg?height=200&width=200&text=Mike+Wilson",
    reason: "poor_image_quality",
    location: {
      lat: 40.7614,
      lng: -73.9776,
      address: "321 5th Ave, New York, NY",
    },
    deviceInfo: "iPad Air - Safari",
    status: "declined",
  },
]

const mockEvents = [
  { id: "1", title: "Annual Conference 2023" },
  { id: "2", title: "Team Building Workshop" },
  { id: "3", title: "Product Launch" },
]

const reasonLabels = {
  face_not_recognized: "Face Not Recognized",
  outside_perimeter: "Outside Event Perimeter",
  poor_image_quality: "Poor Image Quality",
  duplicate_attempt: "Duplicate Attempt",
}

const reasonColors = {
  face_not_recognized: "destructive",
  outside_perimeter: "secondary",
  poor_image_quality: "outline",
  duplicate_attempt: "default",
} as const

export default function FailedAttemptsPage() {
  const [failedAttempts, setFailedAttempts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true"

    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    // Simulate API fetch
    setTimeout(() => {
      setFailedAttempts(mockFailedAttempts)
      setLoading(false)
    }, 1000)
  }, [router])

  const filteredAttempts = failedAttempts.filter((attempt) => {
    const eventMatch = selectedEvent === "all" || attempt.eventId === selectedEvent
    const statusMatch = selectedStatus === "all" || attempt.status === selectedStatus
    return eventMatch && statusMatch
  })

  const handleApprove = (attemptId: string) => {
    setFailedAttempts((attempts) =>
      attempts.map((attempt) => (attempt.id === attemptId ? { ...attempt, status: "approved" } : attempt)),
    )
    toast({
      title: "Attempt Approved",
      description: "The attendance attempt has been approved and recorded",
    })
  }

  const handleDecline = (attemptId: string) => {
    setFailedAttempts((attempts) =>
      attempts.map((attempt) => (attempt.id === attemptId ? { ...attempt, status: "declined" } : attempt)),
    )
    toast({
      title: "Attempt Declined",
      description: "The attendance attempt has been declined",
      variant: "destructive",
    })
  }

  const pendingCount = failedAttempts.filter((a) => a.status === "pending").length
  const approvedCount = failedAttempts.filter((a) => a.status === "approved").length
  const declinedCount = failedAttempts.filter((a) => a.status === "declined").length

  return (
    <div className="container py-8 px-4">
      <Button variant="ghost" asChild className="mb-4 -ml-4">
        <Link href="/admin/dashboard">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Failed Attendance Attempts</h1>
          <p className="text-muted-foreground">Review and manage failed attendance registrations</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedAttempts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Declined</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{declinedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {mockEvents.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Failed Attempts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading failed attempts...</p>
            </div>
          </div>
        ) : filteredAttempts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No failed attempts found</p>
            </CardContent>
          </Card>
        ) : (
          filteredAttempts.map((attempt) => (
            <Card key={attempt.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-3">
                  {/* User Image and Basic Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={attempt.userImage || "/placeholder.svg"} alt="User" />
                        <AvatarFallback>
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{attempt.eventTitle}</h3>
                        <p className="text-sm text-muted-foreground">{new Date(attempt.timestamp).toLocaleString()}</p>
                        <Badge variant={reasonColors[attempt.reason as keyof typeof reasonColors]} className="mt-1">
                          {reasonLabels[attempt.reason as keyof typeof reasonLabels]}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Attempt Details */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">{attempt.location.address}</p>
                        <p className="text-xs text-muted-foreground">
                          {attempt.location.lat.toFixed(4)}, {attempt.location.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Navigation className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Device</p>
                        <p className="text-muted-foreground">{attempt.deviceInfo}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Status</p>
                        <Badge
                          variant={
                            attempt.status === "approved"
                              ? "default"
                              : attempt.status === "declined"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {attempt.status === "pending" ? (
                      <>
                        <Button onClick={() => handleApprove(attempt.id)} className="w-full" size="sm">
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleDecline(attempt.id)}
                          variant="destructive"
                          className="w-full"
                          size="sm"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <Badge variant={attempt.status === "approved" ? "default" : "destructive"} className="text-sm">
                          {attempt.status === "approved" ? "✓ Approved" : "✗ Declined"}
                        </Badge>
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Camera className="h-4 w-4 mr-2" />
                      View Full Image
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
