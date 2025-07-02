"use client"

import React, { useRef, useState } from "react"
import { Upload, X, ImageIcon, Camera as CameraIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import CameraCapture from "@/components/camera-capture"

export default function ImageUpload({ onImageUpload, uploadedImage, placeholder, onRemoveImage }) {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const [showCamera, setShowCamera] = useState(false)

  const validateFile = (file) => {
    const validTypes = ["image/png", "image/jpg", "image/jpeg"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(file.type)) {
      setError("Chỉ chấp nhận file PNG, JPG, JPEG")
      return false
    }

    if (file.size > maxSize) {
      setError("Kích thước file không được vượt quá 10MB")
      return false
    }

    setError(null)
    return true
  }

  const handleFiles = (files) => {
    if (!files || files.length === 0) return
    const file = files[0]
    if (validateFile(file)) {
      onImageUpload(file)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleInputChange = (e) => {
    handleFiles(e.target.files)
  }

  const removeImage = () => {
    if (uploadedImage?.preview) URL.revokeObjectURL(uploadedImage.preview)
    if (typeof onRemoveImage === "function") onRemoveImage()
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  console.log("showCamera:", showCamera, "uploadedImage:", uploadedImage);

  return (
    <div className="space-y-4">
      {showCamera ? (
        <CameraCapture
          onCapture={(file) => {
            setShowCamera(false)
            onImageUpload(file)
          }}
          onCancel={() => setShowCamera(false)}
        />
      ) : !uploadedImage ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {/* Chỉ phủ input lên vùng drag & drop */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 10 }}
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="space-y-4 relative z-20">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="h-6 w-6 text-gray-600" />
            </div>

            <div>
              <p className="text-lg font-medium text-gray-900">{placeholder}</p>
              <p className="text-sm text-gray-500 mt-1">Kéo thả file vào đây hoặc click để chọn</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Chọn từ thư viện
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCamera(true)}
              >
                <CameraIcon className="h-4 w-4 mr-2" />
                Chụp ảnh
              </Button>
            </div>

            <p className="text-xs text-gray-400">PNG, JPG, JPEG (tối đa 10MB)</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center min-h-[200px]">
            <img
              src={uploadedImage.preview || "/placeholder.svg"}
              alt="Uploaded preview"
              className="w-full max-h-96 object-contain rounded-lg"
              style={{ height: "auto", maxHeight: "400px" }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
              <Button variant="destructive" size="sm" onClick={removeImage} className="absolute top-2 right-2">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            <p className="font-medium">{uploadedImage.file?.name}</p>
            <p>
              {uploadedImage?.file
                ? `${(uploadedImage.file.size / 1024 / 1024).toFixed(2)} MB`
                : uploadedImage?.size
                ? `${(uploadedImage.size / 1024 / 1024).toFixed(2)} MB`
                : "Không rõ dung lượng"}
            </p>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

const ParentComponent = () => {
  const [uploadedImage, setUploadedImage] = useState(null)

  return (
    <ImageUpload
      uploadedImage={uploadedImage}
      onImageUpload={file => setUploadedImage({ file, preview: URL.createObjectURL(file) })}
      onRemoveImage={() => setUploadedImage(null)}
      placeholder="Tải lên hình ảnh của bạn"
    />
  )
}
