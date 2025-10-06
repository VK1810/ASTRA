"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Download, LogOut, Calendar, Users, Clock, Database, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Mock data - would be fetched from API in a real app
const mockEvents = [
  {
    id: "1",
    title: "Annual Conference 2023",
    description: "The annual tech conference",
    startTime: new Date(Date.now() + 3600000).toISOString(),
    endTime: new Date(Date.now() + 7200000).toISOString(),
    location: "Main Hall",
    attendees: 24,
  },
  {
    id: "2",
    title: "Team Building Workshop",
    description: "Interactive team building session",
    startTime: new Date(Date.now() + 86400000).toISOString(),
    endTime: new Date(Date.now() + 93600000).toISOString(),
    location: "Conference Room B",
    attendees: 12,
  },
  {
    id: "3",
    title: "Product Launch",
    description: "Launch of our new product line",
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 79200000).toISOString(),
    location: "Exhibition Center",
    attendees: 56,
  },
  {
    id: "4",
    title: "Quarterly Review",
    description: "Q3 2023 Review Meeting",
    startTime: new Date(Date.now() - 604800000).toISOString(),
    endTime: new Date(Date.now() - 597600000).toISOString(),
    location: "Main Conference Room",
    attendees: 18,
  },
]

export default function AdminDashboard() {
  const [activeEvents, setActiveEvents] = useState<any[]>([])
  const [pastEvents, setPastEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [faceCount, setFaceCount] = useState(0)
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
      const now = new Date()
      const active = mockEvents.filter((event) => new Date(event.endTime) > now)
      const past = mockEvents.filter((event) => new Date(event.endTime) <= now)

      setActiveEvents(active)
      setPastEvents(past)
      setFaceCount(5) // Mock face count
      setLoading(false)
    }, 1000)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    router.push("/")
  }

  const handleDownloadAttendance = (eventId: string) => {
    // In a real app, this would trigger a download of attendance data
    toast({
      title: "Download Started",
      description: "Attendance data is being downloaded",
    })
  }

  return (
    <div className="container py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage events and view attendance</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/events/create">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Event
            </Link>
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{mockEvents.length}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{activeEvents.length}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{mockEvents.reduce((sum, event) => sum + event.attendees, 0)}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
          <Link href="/admin/faces">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Face Database</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Database className="h-5 w-5 text-primary mr-2" />
                <div className="text-2xl font-bold">{faceCount} faces</div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer border-orange-200">
          <Link href="/admin/failed-attempts">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                <div className="text-2xl font-bold text-orange-600">3 pending</div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="justify-start bg-transparent">
              <Link href="/admin/events/create">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Event
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start bg-transparent">
              <Link href="/admin/faces">
                <Database className="h-4 w-4 mr-2" />
                Manage Face Database
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start bg-transparent">
              <Link href="/admin/failed-attempts">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Review Failed Attempts
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="rounded-md border">
            <div className="p-4 bg-muted/50">
              <div className="grid grid-cols-12 gap-4 font-medium">
                <div className="col-span-5 md:col-span-4">Event Name</div>
                <div className="col-span-4 md:col-span-3 hidden md:block">Date & Time</div>
                <div className="col-span-3 md:col-span-2">Attendees</div>
                <div className="col-span-4 md:col-span-3 text-right">Actions</div>
              </div>
            </div>

            {activeEvents.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No active events found</div>
            ) : (
              activeEvents.map((event) => (
                <div key={event.id} className="p-4 border-t grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5 md:col-span-4 font-medium">{event.title}</div>
                  <div className="col-span-4 md:col-span-3 text-sm text-muted-foreground hidden md:block">
                    {new Date(event.startTime).toLocaleDateString()} •
                    {new Date(event.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-3 flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownloadAttendance(event.id)}>
                      <Download className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-2">Download</span>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/events/${event.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="rounded-md border">
            <div className="p-4 bg-muted/50">
              <div className="grid grid-cols-12 gap-4 font-medium">
                <div className="col-span-5 md:col-span-4">Event Name</div>
                <div className="col-span-4 md:col-span-3 hidden md:block">Date & Time</div>
                <div className="col-span-3 md:col-span-2">Attendees</div>
                <div className="col-span-4 md:col-span-3 text-right">Actions</div>
              </div>
            </div>

            {pastEvents.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No past events found</div>
            ) : (
              pastEvents.map((event) => (
                <div key={event.id} className="p-4 border-t grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5 md:col-span-4 font-medium">{event.title}</div>
                  <div className="col-span-4 md:col-span-3 text-sm text-muted-foreground hidden md:block">
                    {new Date(event.startTime).toLocaleDateString()} •
                    {new Date(event.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-3 flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownloadAttendance(event.id)}>
                      <Download className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-2">Download</span>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/events/${event.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
