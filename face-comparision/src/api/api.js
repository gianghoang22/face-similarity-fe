// src/api/api.js

const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function compareFaces(image1, image2, method = "face") {
  const formData = new FormData()
  formData.append("img1", image1)
  formData.append("img2", image2)

  const url =
    method === "kinship"
      ? `${BASE_URL}/compare?method=kinship`
      : `${BASE_URL}/compare`

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Server không phản hồi")
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("API Error:", error)
    return { success: false, error: error.message }
  }
}
