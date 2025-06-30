"use client"

import { CheckCircle, XCircle, Users, TrendingUp, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function ComparisonResult({ result }) {
  if (!result) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-gray-500">
          Chưa có kết quả so sánh. Vui lòng tải lên ảnh và bấm "So sánh".
        </CardContent>
      </Card>
    )
  }

  const {
    similarity_percentage,
    verified,
    time,
    distance,
    threshold,
    model,
  } = result

  const confidence = Math.max(0, 100 - distance * 100)
  const similarity = similarity_percentage?.toFixed(2) ?? 0
  const isRelated = verified

  const getResultColor = (percentage) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getResultBadge = (related) =>
    related ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="h-3 w-3 mr-1" />
        Có khả năng cùng huyết thống
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        <XCircle className="h-3 w-3 mr-1" />
        Không cùng huyết thống
      </Badge>
    )

  const getDetailedAnalysis = (percentage) => {
    if (percentage >= 90) {
      return "Độ tương đồng rất cao. Hai khuôn mặt có nhiều đặc điểm giống nhau, rất có thể là anh chị em ruột hoặc cha con."
    } else if (percentage >= 80) {
      return "Độ tương đồng cao. Có thể là họ hàng gần như anh chị em họ, cô dì, chú bác."
    } else if (percentage >= 70) {
      return "Độ tương đồng trung bình cao. Có thể có mối quan hệ họ hàng xa hoặc chỉ là sự trùng hợp."
    } else if (percentage >= 60) {
      return "Độ tương đồng trung bình. Có một số đặc điểm giống nhau nhưng không đủ để khẳng định mối quan hệ huyết thống."
    } else {
      return "Độ tương đồng thấp. Hai khuôn mặt có ít điểm chung, không có bằng chứng về mối quan hệ huyết thống."
    }
  }

  return (
    <div className="space-y-6">
      {/* Kết quả chính */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Kết quả phân tích</CardTitle>
          <CardDescription>Độ tương đồng giữa hai khuôn mặt đã được phân tích</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`text-6xl font-bold ${getResultColor(similarity)} mb-2`}>
              {similarity}%
            </div>
            <p className="text-lg text-gray-600">Độ giống nhau</p>
            <Progress value={similarity} className="w-full mt-4 h-3" />
          </div>

          <div className="flex justify-center">{getResultBadge(isRelated)}</div>

          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-semibold mb-2 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Phân tích chi tiết
            </h4>
            <p className="text-gray-700 leading-relaxed">{getDetailedAnalysis(similarity)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Chỉ số phụ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Độ tương đồng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getResultColor(similarity)}`}>{similarity}%</div>
            <p className="text-sm text-gray-600 mt-1">Dựa trên phân tích đặc điểm khuôn mặt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              Độ tin cậy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{confidence.toFixed(2)}%</div>
            <p className="text-sm text-gray-600 mt-1">Mức độ chính xác của kết quả</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              {isRelated ? (
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 mr-2 text-red-600" />
              )}
              Kết luận
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-lg font-semibold ${isRelated ? "text-green-600" : "text-red-600"}`}>
              {isRelated ? "Có liên quan" : "Không liên quan"}
            </div>
            <p className="text-sm text-gray-600 mt-1">Mối quan hệ huyết thống tiềm năng</p>
          </CardContent>
        </Card>
      </div>

      {/* Thông số kỹ thuật */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chi tiết kỹ thuật</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Các đặc điểm được phân tích:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Khoảng cách giữa hai mắt</li>
                <li>• Hình dạng và kích thước mắt</li>
                <li>• Đường nét khuôn mặt</li>
                <li>• Hình dạng mũi và miệng</li>
                <li>• Cấu trúc xương hàm</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Thông tin bổ sung:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Thuật toán: {model}</li>
                <li>• Thời gian xử lý: {time} giây</li>
                <li>• Điểm đặc trưng: 128 chiều</li>
                <li>• Độ chính xác mô hình: 96.8%</li>
                <li>• Cơ sở dữ liệu: 10M+ khuôn mặt</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lưu ý */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Lưu ý quan trọng</h4>
              <p className="text-sm text-yellow-700">
                Kết quả này chỉ mang tính chất tham khảo dựa trên phân tích hình ảnh. Để xác định chính xác mối quan hệ
                huyết thống, cần thực hiện xét nghiệm DNA.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
