// components/ImageCropper.js
"use client"

import Cropper from "react-easy-crop"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import getCroppedImg from "@/utils/cropImage"

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleDone = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
    onCropComplete(croppedImage)
  }

  return (
    <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
      />
      <div className="absolute bottom-4 left-4 flex gap-2">
        <Button onClick={handleDone}>Cắt</Button>
        <Button variant="secondary" onClick={onCancel}>Huỷ</Button>
      </div>
    </div>
  )
}
