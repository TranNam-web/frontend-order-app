'use client'

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Props {
  onSearch: (value: string) => void
}

export default function SearchDish({ onSearch }: Props) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Search className="w-5 h-5 text-gray-500" />

      <Input
        placeholder="Tìm món ăn..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}