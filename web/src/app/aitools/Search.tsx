'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Search({ initialSearchTerm, initialCategory, categories }: {
  initialSearchTerm: string,
  initialCategory: string,
  categories: string[]
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [category, setCategory] = useState(initialCategory)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const searchParams = new URLSearchParams()
    if (searchTerm) searchParams.set('q', searchTerm)
    if (category) searchParams.set('category', category)
    router.push(`/aitools?${searchParams.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="搜索 AI 工具..."
        className="p-2 border rounded mr-2 text-black"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 border rounded mr-2 text-black"
      >
        <option value="">所有类别</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">搜索</button>
    </form>
  )
}

