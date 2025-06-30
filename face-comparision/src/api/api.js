// src/api/api.js

const BASE_URL = "http://localhost:3000"

export async function compareFaces(image1, image2) {
  const formData = new FormData()
  formData.append("img1", image1)
  formData.append("img2", image2)

  try {
    const response = await fetch(`${BASE_URL}/compare`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Server không phản hồi")

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("API Error:", error)
    return { success: false, error: error.message }
  }
}
