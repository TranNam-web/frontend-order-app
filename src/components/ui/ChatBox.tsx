'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function ChatBox() {
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)

  const isHome = pathname === '/' || pathname === '/vi'

  // MENU
  const menu = [
    { name: 'Chè hoa quả', price: 10000, type: 'chè', cold: true, student: true },
    { name: 'Chè thập cẩm', price: 12000, type: 'chè', cold: true },
    { name: 'Chè bưởi', price: 12000, type: 'chè', cold: true },
    { name: 'Cá viên chiên', price: 5000, type: 'ăn vặt', hot: true, student: true },
    { name: 'Lạp xưởng', price: 7000, type: 'ăn vặt', hot: true },
    { name: 'Khoai nướng', price: 12000, type: 'ăn vặt', hot: true },
    { name: 'Nước ép cam', price: 5000, type: 'đồ uống', cold: true, student: true },
    { name: 'Cocacola', price: 10000, type: 'đồ uống', cold: true },
    { name: 'Trà tắc', price: 10000, type: 'đồ uống', cold: true },
    { name: 'Nước dâu', price: 15000, type: 'đồ uống', cold: true },
    { name: 'Bánh bèo', price: 7000, type: 'ăn vặt' },
    { name: 'Đồ lụa', price: 10000, type: 'món khác' }
  ]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'Xin chào 👋 mình có thể tư vấn món theo thời tiết, giá tiền, sở thích nha!'
        }
      ])
    }
  }, [open])

  const sendMessage = async (customMessage?: string) => {
    const msg = (customMessage || input).toLowerCase()
    if (!msg.trim()) return

    setInput('')
    setLoading(true)

    const newMessages = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)

    setTimeout(() => {
      let result: any[] = []
      let reply = ''

      if (msg.includes('nóng')) {
        result = menu.filter(m => m.cold)
        reply = '🥵 Trời nóng nên ăn/uống:\n\n'
      } else if (msg.includes('lạnh') || msg.includes('rét')) {
        result = menu.filter(m => m.hot)
        reply = '🥶 Trời lạnh nên ăn:\n\n'
      } else if (msg.includes('rẻ') || msg.includes('sinh viên')) {
        result = menu.filter(m => m.price <= 10000)
        reply = '💸 Món rẻ cho học sinh sinh viên:\n\n'
      } else if (msg.includes('uống')) {
        result = menu.filter(m => m.type === 'đồ uống')
        reply = '🥤 Đồ uống:\n\n'
      } else if (msg.includes('ăn vặt')) {
        result = menu.filter(m => m.type === 'ăn vặt')
        reply = '🍟 Ăn vặt:\n\n'
      } else if (msg.includes('chè')) {
        result = menu.filter(m => m.type === 'chè')
        reply = '🍧 Các món chè:\n\n'
      } else if (msg.includes('ngon')) {
        const best = menu[0]
        reply = `🔥 Món ngon nhất: ${best.name} (${best.price}đ)`
      } else if (msg.includes('đắt')) {
        const max = menu.reduce((a, b) => a.price > b.price ? a : b)
        reply = `💎 Món đắt nhất: ${max.name} (${max.price}đ)`
      } else {
        reply = `🤖 Bạn có thể hỏi:
- Trời nóng ăn gì?
- Món rẻ?
- Đồ uống?
- Món ngon nhất?
- Món đắt nhất?
- Ăn vặt?
- Chè?`
      }

      if (result.length > 0) {
        reply += result.map(m => `\n• ${m.name} (${m.price}đ)`).join('')
      }

      setMessages([
        ...newMessages,
        { role: 'assistant', content: reply }
      ])

      setLoading(false)
    }, 500)
  }

  if (!isHome) return null

  return (
    <div className='fixed bottom-6 right-6 z-[9999] flex flex-col items-center gap-4'>

      {/* 📞 CALL */}
      <div className="flex flex-col items-center w-14">

        <div className="mb-2 bg-black/80 text-white text-xs px-3 py-1 rounded-full shadow">
          📞 0865063204
        </div>

        <a
          href="tel:0865063204"
          className="relative bg-green-500 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl transition hover:scale-110"
        >
          📞
          <span className="absolute w-full h-full rounded-full bg-green-400 opacity-40 animate-ping"></span>
          <span className="absolute w-full h-full rounded-full bg-green-300 opacity-30 animate-ping delay-200"></span>
        </a>

      </div>

      {/* 💬 CHAT */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className='relative bg-gradient-to-r from-blue-500 to-blue-600 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl transition hover:scale-110'
        >
          💬
          <span className="absolute w-full h-full rounded-full bg-blue-400 opacity-40 animate-ping"></span>
          <span className="absolute w-full h-full rounded-full bg-blue-300 opacity-30 animate-ping delay-200"></span>
        </button>
      )}

      {/* CHAT BOX */}
      {open && (
        <div className='w-80 h-[440px] bg-[#0f172a] rounded-2xl flex flex-col border border-gray-700'>

          <div className='bg-blue-600 p-3 text-white flex justify-between'>
            <span>💬 Trợ lý AI</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className='flex-1 p-3 overflow-y-auto space-y-3 bg-[#020617] whitespace-pre-line'>
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : ''}>
                <div className={`inline-block px-3 py-2 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-[#1e293b] text-gray-200'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <div className='text-gray-400'>Đang trả lời...</div>}
            <div ref={chatEndRef} />
          </div>

          <div className='p-2 flex'>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className='flex-1 bg-[#1e293b] text-white px-3 py-2 rounded-full'
              placeholder='Nhập tin nhắn...'
            />
            <button onClick={() => sendMessage()} className='ml-2 bg-blue-500 text-white px-3 rounded-full'>
              ➤
            </button>
          </div>

        </div>
      )}
    </div>
  )
}