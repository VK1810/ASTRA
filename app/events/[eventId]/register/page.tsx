"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, MapPin, Loader2, Check, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

export default function RegisterAttendance({ params }: { params: { eventId: string } }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [photoTaken, setPhotoTaken] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(50)
  const router = useRouter()
  const { toast } = useToast()

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }

  // Take photo
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        setPhotoTaken(true)
        stopCamera()
      }
    }
  }

  // Retake photo
  const retakePhoto = () => {
    setPhotoTaken(false)
    startCamera()
  }

  // Get location
  const getLocation = () => {
    setLocationLoading(true)
    setLocationError("")

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      setLocationLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocationLoading(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        setLocationError("Could not get your location. Please check permissions.")
        setLocationLoading(false)
      },
    )
  }

  // Next step
  const nextStep = () => {
    if (step === 1 && !photoTaken) {
      toast({
        title: "Photo Required",
        description: "Please take a selfie to continue",
        variant: "destructive",
      })
      return
    }

    if (step < 2) {
      setStep(step + 1)
      setProgress(100)
    }
  }

  // Previous step
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      setProgress(50)
    }
  }

  // Submit attendance
  const submitAttendance = async () => {
    if (!photoTaken || !location) {
      toast({
        title: "Missing Information",
        description: "Please complete all steps before submitting",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      // Get image data from canvas
      const imageData = canvasRef.current?.toDataURL("image/jpeg")

      // In a real app, you would send this data to your server for facial recognition
      // await fetch('/api/attendance', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     eventId: params.eventId,
      //     photo: imageData,
      //     location
      //   })
      // })

      // Simulate API call and facial recognition processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Attendance Registered",
        description: "Your attendance has been successfully recorded",
        variant: "default",
      })

      // Redirect to confirmation page
      router.push(`/events/${params.eventId}/confirmation`)
    } catch (error) {
      console.error("Error submitting attendance:", error)
      toast({
        title: "Submission Error",
        description: "There was a problem registering your attendance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  // Initialize camera when reaching step 1
  useEffect(() => {
    if (step === 1 && !cameraActive && !photoTaken) {
      startCamera()
    }
  }, [step, cameraActive, photoTaken])

  return (
    <div className="container max-w-md py-8 px-4">
      <Button variant="ghost" asChild className="mb-4 -ml-4">
        <Link href="/events">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Register Attendance</h1>
        <p className="text-muted-foreground mt-1">Complete all steps to mark your attendance</p>
      </div>

      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span className={step >= 1 ? "font-medium text-primary" : ""}>Take Selfie</span>
          <span className={step >= 2 ? "font-medium text-primary" : ""}>Confirm Location</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Take a Selfie"}
            {step === 2 && "Confirm Location"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Take a selfie for facial recognition"}
            {step === 2 && "Confirm your current location"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="border rounded-md overflow-hidden bg-muted">
                {!cameraActive && !photoTaken ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">Starting camera...</p>
                  </div>
                ) : null}

                {cameraActive && !photoTaken ? (
                  <div className="relative">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <Button onClick={takePhoto} variant="secondary">
                        <Camera className="h-4 w-4 mr-2" />
                        Capture
                      </Button>
                    </div>
                  </div>
                ) : null}

                {photoTaken ? (
                  <div className="relative">
                    <canvas ref={canvasRef} className="w-full h-auto" />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <Button onClick={retakePhoto} variant="secondary" size="sm">
                        Retake
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="rounded-lg bg-muted/50 p-4 text-sm text-center">
                <p>Your face will be used to identify you in our system.</p>
                <p className="mt-1 text-muted-foreground">No need to enter personal details.</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {!location ? (
                <div className="flex flex-col items-center gap-4 py-6">
                  <MapPin className="h-12 w-12 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">We need your location to verify your attendance</p>
                  <Button onClick={getLocation} disabled={locationLoading} className="w-full">
                    {locationLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 mr-2" />
                        Get Current Location
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="rounded-full bg-green-100 p-3">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-center font-medium">Location captured successfully</p>
                  <div className="text-sm text-muted-foreground text-center">
                    <p>Latitude: {location.lat.toFixed(6)}</p>
                    <p>Longitude: {location.lng.toFixed(6)}</p>
                  </div>
                </div>
              )}

              {locationError && <p className="text-sm text-destructive mt-1">{locationError}</p>}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep}>
              Previous
            </Button>
          ) : (
            <div></div>
          )}

          {step < 2 ? (
            <Button onClick={nextStep} disabled={!photoTaken}>
              Next
            </Button>
          ) : (
            <Button onClick={submitAttendance} disabled={submitting || !location}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
