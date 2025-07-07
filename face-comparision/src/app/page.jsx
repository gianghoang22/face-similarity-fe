"use client"

import { useState, useRef } from "react"
import { Camera, Users, Zap, Shield, CheckCircle, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import ImageUpload from "@/components/image-upload"
import ComparisonResult from "@/components/comparision-result"
import ImageCropper from "@/components/image-cropper"
import { compareFaces } from "@/api/api"

export default function FaceComparisonApp() {
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [isCropping1, setIsCropping1] = useState(false)
  const [isCropping2, setIsCropping2] = useState(false)
  const [isComparing, setIsComparing] = useState(false)
  const [result, setResult] = useState(null)
  const [compareMethod, setCompareMethod] = useState("face")
  const resultRef = useRef(null)

  const handleImageUpload = (imageNumber, file) => {
    if (!file) return
    const preview = URL.createObjectURL(file)
    const uploadedImage = { file, preview }

    if (imageNumber === 1) {
      if (image1?.preview) URL.revokeObjectURL(image1.preview)
      setImage1(uploadedImage)
    } else {
      if (image2?.preview) URL.revokeObjectURL(image2.preview)
      setImage2(uploadedImage)
    }

    setResult(null)
  }

  const handleRemoveImage = (imageNumber) => {
    if (imageNumber === 1) {
      if (image1?.preview) URL.revokeObjectURL(image1.preview)
      setImage1(null)
      setIsCropping1(false)
    } else {
      if (image2?.preview) URL.revokeObjectURL(image2.preview)
      setImage2(null)
      setIsCropping2(false)
    }
  }

  const handleCropComplete1 = (croppedFile) => {
    if (image1?.preview) URL.revokeObjectURL(image1.preview)
    const preview = URL.createObjectURL(croppedFile)
    setImage1({ file: croppedFile, preview })
    setIsCropping1(false)
  }

  const handleCropComplete2 = (croppedFile) => {
    if (image2?.preview) URL.revokeObjectURL(image2.preview)
    const preview = URL.createObjectURL(croppedFile)
    setImage2({ file: croppedFile, preview })
    setIsCropping2(false)
  }

  const handleCompare = async () => {
    if (!image1 || !image2) return
    setIsComparing(true)
    setResult(null)

    const response = await compareFaces(image1.file, image2.file, compareMethod)

    if (response.success) {
      setResult(response.data)
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 500)
    } else {
      alert("Lỗi khi phân tích: " + response.error)
    }

    setIsComparing(false)
  }

  const resetComparison = () => {
    setImage1(null)
    setImage2(null)
    setResult(null)
    setIsComparing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FaceMatch AI</h1>
                <p className="text-sm text-gray-500">Kiểm tra độ giống nhau khuôn mặt</p>
              </div>
            </div>
            <Button variant="outline" onClick={resetComparison}>Làm mới</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">So sánh độ giống nhau giữa hai khuôn mặt</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sử dụng công nghệ AI tiên tiến để phân tích và so sánh độ tương đồng giữa hai khuôn mặt hoặc quan hệ huyết thống.
          </p>
        </div>

        {/* PHƯƠNG PHÁP SO SÁNH */}
        <div className="text-center mb-6 mt-6">
          <div className="inline-flex items-center space-x-4">
            <label className="font-medium text-gray-700">Chế độ so sánh:</label>
            <select
              value={compareMethod}
              onChange={(e) => setCompareMethod(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none"
            >
              <option value="face">Độ giống khuôn mặt (DeepFace)</option>
              <option value="kinship">Quan hệ huyết thống (Kinship)</option>
            </select>
          </div>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {[1, 2].map((index) => {
            const image = index === 1 ? image1 : image2
            const isCropping = index === 1 ? isCropping1 : isCropping2
            const setIsCropping = index === 1 ? setIsCropping1 : setIsCropping2
            const handleCrop = index === 1 ? handleCropComplete1 : handleCropComplete2

            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="h-5 w-5" />
                    <span>Hình ảnh thứ {index}</span>
                  </CardTitle>
                  <CardDescription>Tải lên hình ảnh thứ {index} để so sánh</CardDescription>
                </CardHeader>
                <CardContent>
                  {isCropping && image?.preview ? (
                    <ImageCropper
                      imageSrc={image.preview}
                      onCropComplete={handleCrop}
                      onCancel={() => setIsCropping(false)}
                    />
                  ) : (
                    <>
                      <ImageUpload
                        onImageUpload={(file) => handleImageUpload(index, file)}
                        onRemoveImage={() => handleRemoveImage(index)}
                        uploadedImage={image}
                        placeholder={`Tải lên hình ảnh thứ ${index}`}
                      />
                      {image && (
                        <div className="mt-3">
                          <Button variant="secondary" onClick={() => setIsCropping(true)}>
                            <Scissors className="w-4 h-4 mr-2" /> Crop ảnh
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* NÚT SO SÁNH */}
        <div className="text-center mb-8">
          <Button
            onClick={handleCompare}
            disabled={!image1 || !image2 || isComparing}
            size="lg"
            className="px-8 py-3 text-lg"
          >
            {isComparing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang phân tích...
              </>
            ) : (
              <>
                <Users className="h-5 w-5 mr-2" />
                So sánh khuôn mặt
              </>
            )}
          </Button>
        </div>

        {/* PHÂN TÍCH */}
        {isComparing && (
          <Card className="mb-8">
            <CardContent className="pt-6 space-y-4 text-center">
              <h3 className="text-lg font-semibold">Đang phân tích...</h3>
              <Progress value={66} className="w-full" />
              <p className="text-xs text-gray-500">Sử dụng AI để phân tích đặc điểm khuôn mặt</p>
            </CardContent>
          </Card>
        )}

        {/* KẾT QUẢ */}
        {result && (
          <div ref={resultRef}>
            <Card className="p-4">
              <CardContent className="pt-0">
                <div className="text-sm text-gray-500 italic mb-2">
                  Phương pháp: {compareMethod === "kinship" ? "Quan hệ huyết thống (Kinship)" : "So sánh khuôn mặt (DeepFace)"}
                </div>
                <ComparisonResult result={result} />
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>&copy; 2025 Microbox. Được phát triển bằng công nghệ AI tiên tiến.</p>
        </div>
      </footer>
    </div>
  )
}
