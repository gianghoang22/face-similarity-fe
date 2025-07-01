"use client"

import { useState } from "react"
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

  const handleImageUpload = (imageNumber, file) => {
  if (!file) return;

  const preview = URL.createObjectURL(file);
  const uploadedImage = { file, preview };

  if (imageNumber === 1) {
    if (image1?.preview) URL.revokeObjectURL(image1.preview);
    setImage1(uploadedImage);
  } else {
    if (image2?.preview) URL.revokeObjectURL(image2.preview);
    setImage2(uploadedImage);
  }

  setResult(null);
};

const handleRemoveImage = (imageNumber) => {
  if (imageNumber === 1) {
    if (image1?.preview) URL.revokeObjectURL(image1.preview);
    setImage1(null);
    setIsCropping1(false);
  } else {
    if (image2?.preview) URL.revokeObjectURL(image2.preview);
    setImage2(null);
    setIsCropping2(false);
  }
};



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

    const response = await compareFaces(image1.file, image2.file)

    if (response.success) {
      setResult(response.data)
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
        {/* GIỚI THIỆU */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">So sánh độ giống nhau giữa hai khuôn mặt</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sử dụng công nghệ AI tiên tiến để phân tích và so sánh độ tương đồng giữa hai khuôn mặt.
          </p>
        </div>

        {/* ƯU ĐIỂM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[["Nhanh chóng", Zap, "Phân tích chỉ vài giây"],
            ["Bảo mật", Shield, "Xử lý cục bộ, không lưu server"],
            ["Chính xác", CheckCircle, "Thuật toán AI trên 95%"]].map(([title, Icon, desc], i) => (
              <Card key={i}>
                <CardHeader className="text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent><p className="text-sm text-gray-600 text-center">{desc}</p></CardContent>
              </Card>
          ))}
        </div>

        {/* UPLOAD + CROP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* ẢNH 1 */}
          <Card>
  <CardHeader>
    <CardTitle className="flex items-center space-x-2">
      <Camera className="h-5 w-5" />
      <span>Hình ảnh thứ nhất</span>
    </CardTitle>
    <CardDescription>Tải lên hình ảnh đầu tiên để so sánh</CardDescription>
  </CardHeader>

  <CardContent>
    {isCropping1 && image1?.preview ? (
      <ImageCropper
        imageSrc={image1.preview}
        onCropComplete={handleCropComplete1}
        onCancel={() => setIsCropping1(false)}
      />
    ) : (
      <>
        <ImageUpload
          onImageUpload={(file) => handleImageUpload(1, file)}
          onRemoveImage={() => handleRemoveImage(1)}
          uploadedImage={image1}
          placeholder="Tải lên hình ảnh thứ nhất"
        />
        {image1 && (
          <div className="mt-3">
            <Button variant="secondary" onClick={() => setIsCropping1(true)}>
              <Scissors className="w-4 h-4 mr-2" /> Crop ảnh
            </Button>
          </div>
        )}
      </>
    )}
  </CardContent>
</Card>


          {/* ẢNH 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Hình ảnh thứ hai</span>
              </CardTitle>
              <CardDescription>Tải lên hình ảnh thứ hai để so sánh</CardDescription>
            </CardHeader>

            <CardContent>
              {isCropping2 && image2?.preview ? (
                <ImageCropper
                  imageSrc={image2.preview}
                  onCropComplete={handleCropComplete2}
                  onCancel={() => setIsCropping2(false)}
                />
              ) : (
                <>
                  <ImageUpload
                    onImageUpload={(file) => handleImageUpload(2, file)}
                    onRemoveImage={() => handleRemoveImage(2)}
                    uploadedImage={image2}
                    placeholder="Tải lên hình ảnh thứ hai"
                  />
                  {image2 && (
                    <div className="mt-3">
                      <Button variant="secondary" onClick={() => setIsCropping2(true)}>
                        <Scissors className="w-4 h-4 mr-2" /> Crop ảnh
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* BUTTON COMPARE */}
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

        {/* ĐANG PHÂN TÍCH */}
        {isComparing && (
          <Card className="mb-8">
            <CardContent className="pt-6 space-y-4 text-center">
              <h3 className="text-lg font-semibold">Đang phân tích khuôn mặt...</h3>
              <Progress value={66} className="w-full" />
              <p className="text-xs text-gray-500">Đang sử dụng AI để phân tích các đặc điểm khuôn mặt</p>
            </CardContent>
          </Card>
        )}

        {/* KẾT QUẢ */}
        {result && <ComparisonResult result={result} />}

        {/* HƯỚNG DẪN */}
        <Card className="mt-12">
          <CardHeader><CardTitle>Hướng dẫn sử dụng</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">Yêu cầu hình ảnh:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Định dạng: PNG, JPG, JPEG</li>
                  <li>Kích thước tối đa: 10MB</li>
                  <li>Khuôn mặt rõ nét, không bị che khuất</li>
                  <li>Ánh sáng đầy đủ, không quá tối</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cách thức hoạt động:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Phân tích đặc điểm khuôn mặt</li>
                  <li>So sánh độ tương đồng</li>
                  <li>Đưa ra kết luận dựa vào AI</li>
                  <li>Độ chính xác {">"} 95%</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>&copy; 2025 FaceMatch AI. Được phát triển bằng công nghệ AI tiên tiến.</p>
        </div>
      </footer>
    </div>
  )
}
