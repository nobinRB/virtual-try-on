'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'

export default function ImageUploader() {
  const [personImage, setPersonImage] = useState<File | null>(null)
  const [clothImage, setClothImage] = useState<File | null>(null)
  const [personPreview, setPersonPreview] = useState<string | null>(null)
  const [clothPreview, setClothPreview] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePersonImage = (file: File) => {
    setPersonImage(file)
    setPersonPreview(URL.createObjectURL(file))
    setResult(null)
    setError(null)
  }

  const handleClothImage = (file: File) => {
    setClothImage(file)
    setClothPreview(URL.createObjectURL(file))
    setResult(null)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!personImage || !clothImage) return

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('image', personImage)
    formData.append('clothImage', clothImage)

    try {
      const response = await fetch('/api/try-on', {  // Updated API endpoint
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process virtual try-on')
      }

      const data = await response.json()
      setResult(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Person Image Upload */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Upload Person Image</h3>
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handlePersonImage(e.target.files[0])}
              className="hidden"
              id="person-upload"
            />
            <label htmlFor="person-upload" className="cursor-pointer block">
              {personPreview ? (
                <Image
                  src={personPreview}
                  alt="Person Preview"
                  width={300}
                  height={400}
                  className="mx-auto object-contain"
                />
              ) : (
                <div className="py-8">
                  <p>Upload full body photo</p>
                  <p className="text-sm text-gray-500 mt-1">Click to browse</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Cloth Image Upload */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Upload Clothing Image</h3>
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleClothImage(e.target.files[0])}
              className="hidden"
              id="cloth-upload"
            />
            <label htmlFor="cloth-upload" className="cursor-pointer block">
              {clothPreview ? (
                <Image
                  src={clothPreview}
                  alt="Cloth Preview"
                  width={300}
                  height={400}
                  className="mx-auto object-contain"
                />
              ) : (
                <div className="py-8">
                  <p>Upload clothing photo</p>
                  <p className="text-sm text-gray-500 mt-1">Click to browse</p>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Result Display */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2"></h3>
        <div className="border-2 rounded-lg p-4">
          {result ? (
            <img
              src={result}
              alt="Virtual Try-on Result"
              className="max-w-full h-auto mx-auto"
            />
          ) : (
            <div className="py-8 text-center text-gray-500">
              Virtual try-on result will appear here
            </div>
          )}
        </div>
      </div>

      {personImage && clothImage && !loading && !result && (
        <button
          onClick={handleSubmit}
          className="mt-4 bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 w-full"
        >
          Try On
        </button>
      )}

      {loading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600 text-center">
          {error}
        </div>
      )}
    </div>
  )
}