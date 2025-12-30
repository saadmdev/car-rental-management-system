'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

export default function ImageUrlInput({ label, value = [], onChange, error, required = false }) {
  const [newImageUrl, setNewImageUrl] = useState('')

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      onChange({ target: { name: 'images', value: [...value, newImageUrl.trim()] } })
      setNewImageUrl('')
    }
  }

  const handleRemoveImage = (index) => {
    const updated = value.filter((_, i) => i !== index)
    onChange({ target: { name: 'images', value: updated } })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddImage()
    }
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Add Image URL Input */}
      <div className="flex gap-2 mb-3">
        <input
          type="url"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleAddImage}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add</span>
        </button>
      </div>

      {/* Image URLs List */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((url, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{url}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="text-red-500 hover:text-red-700 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <p className="text-xs text-gray-500 mt-2">
        Add image URLs one at a time. First image will be used as the main image.
      </p>
    </div>
  )
}

