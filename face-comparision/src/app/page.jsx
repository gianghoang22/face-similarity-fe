"use client"

import { useState } from "react"
import { Camera, Users, Zap, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import ImageUpload from "@/components/image-upload"
import ComparisonResult from "@/components/comparision-result"
import { compareFaces } from "@/api/api"

export default function FaceComparisonApp() {
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [isComparing, setIsComparing] = useState(false)
  const [result, setResult] = useState(null)

  const handleImageUpload = (imageNumber, file) => {
    const preview = URL.createObjectURL(file)
    const uploadedImage = { file, preview }

    if (imageNumber === 1) {
      setImage1(uploadedImage)
    } else {
      setImage2(uploadedImage)
    }

    setResult(null)
  }

  const handleCompare = async () => {
    if (!image1 || !image2) return

    setIsComparing(true)
    setResult(null)

    const response = await compareFaces(image1.file, image2.file)

    if (response.success) {
      setResult(response.data)
        console.log("Kết quả so sánh:", response.data)
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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">So sánh độ giống nhau giữa hai khuôn mặt</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sử dụng công nghệ AI tiên tiến để phân tích và so sánh độ tương đồng giữa hai khuôn mặt, giúp xác định mối
            quan hệ huyết thống tiềm năng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Nhanh chóng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">Phân tích và so sánh trong vài giây với độ chính xác cao</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Bảo mật</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">Hình ảnh được xử lý cục bộ, không lưu trữ trên server</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Chính xác</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">Sử dụng thuật toán AI tiên tiến với độ chính xác trên 95%</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Hình ảnh thứ nhất</span>
              </CardTitle>
              <CardDescription>Tải lên hình ảnh đầu tiên để so sánh (PNG, JPG)</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload onImageUpload={(file) => handleImageUpload(1, file)} uploadedImage={image1} placeholder="Tải lên hình ảnh thứ nhất" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Hình ảnh thứ hai</span>
              </CardTitle>
              <CardDescription>Tải lên hình ảnh thứ hai để so sánh (PNG, JPG)</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload onImageUpload={(file) => handleImageUpload(2, file)} uploadedImage={image2} placeholder="Tải lên hình ảnh thứ hai" />
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-8">
          <Button onClick={handleCompare} disabled={!image1 || !image2 || isComparing} size="lg" className="px-8 py-3 text-lg">
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
          {(!image1 || !image2) && <p className="text-sm text-gray-500 mt-2">Vui lòng tải lên cả hai hình ảnh để bắt đầu so sánh</p>}
        </div>

        {isComparing && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Đang phân tích khuôn mặt...</h3>
                  <p className="text-sm text-gray-600">Vui lòng chờ trong giây lát</p>
                </div>
                <Progress value={66} className="w-full" />
                <div className="text-xs text-gray-500 text-center">Đang sử dụng AI để phân tích các đặc điểm khuôn mặt</div>
              </div>
            </CardContent>
          </Card>
        )}

        {result && <ComparisonResult result={result} />}

        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Hướng dẫn sử dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Yêu cầu hình ảnh:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Định dạng: PNG, JPG, JPEG</li>
                  <li>• Kích thước tối đa: 10MB</li>
                  <li>• Khuôn mặt rõ nét, không bị che khuất</li>
                  <li>• Ánh sáng đầy đủ, không quá tối</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cách thức hoạt động:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Phân tích các đặc điểm khuôn mặt</li>
                  <li>• So sánh độ tương đồng</li>
                  <li>• Đưa ra kết luận dựa trên thuật toán AI</li>
                  <li>• Độ chính xác: 95%+</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 FaceMatch AI. Được phát triển với công nghệ AI tiên tiến.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
