"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

export default function CameraCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error("Lỗi truy cập camera:", error)
      }
    }

    startCamera()

    return () => {
      // Stop camera when unmount
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      const file = new File([blob], "captured.png", { type: "image/png" })
      onCapture(file)
    }, "image/png")
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full max-w-md rounded-md border"
      />
      <div className="flex gap-2">
        <Button onClick={capturePhoto}>📸 Chụp</Button>
        <Button variant="secondary" onClick={onCancel}>Huỷ</Button>
      </div>
    </div>
  )
}
