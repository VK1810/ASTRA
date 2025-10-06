"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarIcon, Clock, MapPin, ArrowLeft } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

// Mock data - would be fetched from API in a real app
const mockEvents = [
  {
    id: "1",
    title: "Annual Conference 2023",
    description: "The annual tech conference",
    startTime: new Date(Date.now() + 3600000).toISOString(),
    endTime: new Date(Date.now() + 7200000).toISOString(),
    location: "Main Hall",
  },
  {
    id: "2",
    title: "Team Building Workshop",
    description: "Interactive team building session",
    startTime: new Date(Date.now() + 86400000).toISOString(),
    endTime: new Date(Date.now() + 93600000).toISOString(),
    location: "Conference Room B",
  },
  {
    id: "3",
    title: "Product Launch",
    description: "Launch of our new product line",
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 79200000).toISOString(),
    location: "Exhibition Center",
  },
]

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setEvents(mockEvents)
      setLoading(false)
    }, 1000)
  }, [])

  const handleSelectEvent = (eventId: string) => {
    router.push(`/events/${eventId}/register`)
  }

  return (
    <div className="container max-w-4xl py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4 -ml-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Available Events</h1>
        <p className="text-muted-foreground mt-2">Select an event to register your attendance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {loading
          ? // Loading skeletons
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))
          : events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(new Date(event.startTime))}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(event.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -
                      {new Date(event.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleSelectEvent(event.id)}
                    className="w-full"
                    disabled={new Date(event.endTime) < new Date()}
                  >
                    {new Date(event.endTime) < new Date() ? "Event Ended" : "Register Attendance"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
      </div>
    </div>
  )
}
