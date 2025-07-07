"use client"

import React from "react"
import {
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Shield,
  Minus,
  Maximize2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function ComparisonResult({ result }) {
  const [minimized, setMinimized] = React.useState(false)

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
    similarity,
    distance,
    verified,
    model_used,
  } = result

  const similarityValue = similarity_percentage ?? (similarity * 100) ?? 0
  const similarityDisplay = Number(similarityValue).toFixed(2)
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
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-base text-gray-700">Kết quả so sánh</span>
        <button
          className="p-2 rounded hover:bg-blue-100 transition"
          onClick={() => setMinimized(!minimized)}
          aria-label={minimized ? "Mở rộng" : "Thu nhỏ"}
        >
          {minimized ? <Maximize2 className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
        </button>
      </div>

      {!minimized && (
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <CardDescription>Độ tương đồng giữa hai khuôn mặt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className={`text-5xl font-bold ${getResultColor(similarityDisplay)} mb-2`}>
                {similarityDisplay}%
              </div>
              <Progress value={similarityDisplay} className="w-full mt-2 h-3" />
              <div className="text-sm text-gray-500 mt-2 space-y-1">
                <div>
                  Mô hình sử dụng: <Badge variant="outline">{model_used}</Badge>
                </div>
                {typeof distance !== "undefined" && (
                  <div>
                    Khoảng cách đặc trưng: <span className="font-semibold">{distance.toFixed(4)}</span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex justify-center">{getResultBadge(isRelated)}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border flex items-start">
                {isRelated ? (
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600 mt-1" />
                ) : (
                  <XCircle className="h-5 w-5 mr-2 text-red-600 mt-1" />
                )}
                <div>
                  <div className={`text-lg font-semibold ${isRelated ? "text-green-600" : "text-red-600"}`}>
                    {isRelated ? "Có liên quan" : "Không liên quan"}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Mối quan hệ huyết thống tiềm năng</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <h4 className="font-semibold mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Phân tích chi tiết
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {getDetailedAnalysis(similarityDisplay)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border mt-2">
              <h4 className="font-semibold mb-3 text-gray-800 text-base flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-400" />
                Đặc điểm được phân tích
              </h4>
              <ul className="text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                <li>• Khoảng cách giữa hai mắt</li>
                <li>• Hình dạng & kích thước mắt</li>
                <li>• Đường nét khuôn mặt</li>
                <li>• Hình dạng mũi & miệng</li>
                <li>• Cấu trúc xương hàm</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent>
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
