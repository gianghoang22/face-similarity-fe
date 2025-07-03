// components/image-cropper.jsx
"use client"

import "../styles/cropper.css"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import Cropper from "react-cropper"

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }) {
  const cropperRef = useRef(null)

  const handleDone = () => {
    const cropper = cropperRef.current.cropper
    cropper.getCroppedCanvas().toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `cropped-${Date.now()}.jpg`, { type: blob.type })
        onCropComplete(file)
      }
    }, "image/jpeg")
  }

  return (
    <div className="space-y-4">
      <div className="w-full max-h-[500px]">
        <Cropper
          src={imageSrc}
          style={{ height: 400, width: "100%" }}
          aspectRatio={NaN} // Cho phép resize tự do
          guides={true}
          ref={cropperRef}
          viewMode={1}
          dragMode="move"
          cropBoxResizable={true}
          cropBoxMovable={true}
          responsive={true}
          checkOrientation={false}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleDone}>Cắt</Button>
        <Button variant="secondary" onClick={onCancel}>Huỷ</Button>
      </div>
    </div>
  )
}
