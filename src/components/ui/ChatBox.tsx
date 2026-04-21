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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'Xin chào 👋 mình có thể giúp bạn chọn món nha!'
        }
      ])
    }
  }, [open])

  // 🚀 FAKE CHAT (KHÔNG API)
  const sendMessage = async (customMessage?: string) => {
    const msg = customMessage || input
    if (!msg.trim()) return

    setInput('')
    setLoading(true)

    const newMessages = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)

    setTimeout(() => {
      const text = msg.toLowerCase()
      let reply = 'Mình chưa hiểu 😅'

      if (text.includes('rẻ')) {
        reply = '💸 Món rẻ: Cá viên chiên, nước cam chỉ từ 5k!'
      } else if (text.includes('ngon')) {
        reply = '🔥 Món hot: Cá viên chiên & chè hoa quả cực ngon 😋'
      } else if (text.includes('uống')) {
        reply = '🥤 Có coca, nước cam, trà tắc mát lạnh nha!'
      } else if (text.includes('hello') || text.includes('hi')) {
        reply = 'Xin chào 👋 bạn muốn ăn gì hôm nay?'
      } else {
        reply = `Mình hiểu bạn đang hỏi: "${msg}" 🤔\nBạn có thể hỏi "món rẻ", "đồ uống", "món ngon" nhé!`
      }

      setMessages([
        ...newMessages,
        { role: 'assistant', content: reply }
      ])

      setLoading(false)
    }, 800)
  }

  if (!isHome) return null

  return (
    <div className='fixed bottom-10 right-6 md:right-12 z-[9999] flex flex-col items-end gap-3'>

      {/* 📞 Nút gọi */}
      <a
        href="tel:0865063204"
        className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg animate-bounce"
      >
        📞
      </a>

      {/* 💬 Nút chat */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg transform hover:scale-110 animate-pulse'
        >
          💬 Chat
        </button>
      )}

      {/* Chatbox */}
      {open && (
        <div className='w-80 h-[420px] bg-slate-900 text-white rounded-2xl shadow-2xl flex flex-col border border-slate-700'>

          {/* Header */}
          <div className='bg-gradient-to-r from-blue-500 to-indigo-600 p-3 flex justify-between items-center rounded-t-2xl'>
            <span className='font-semibold'>🤖 Trợ lý AI</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* Nội dung */}
          <div className='flex-1 p-3 overflow-y-auto space-y-3 whitespace-pre-line'>

            {/* Gợi ý */}
            {messages.length <= 1 && (
              <div className='flex gap-2 flex-wrap'>
                <button onClick={() => sendMessage('món rẻ')} className='bg-slate-700 px-2 py-1 rounded text-xs'>Món rẻ</button>
                <button onClick={() => sendMessage('món ngon')} className='bg-slate-700 px-2 py-1 rounded text-xs'>Món ngon</button>
                <button onClick={() => sendMessage('đồ uống')} className='bg-slate-700 px-2 py-1 rounded text-xs'>Đồ uống</button>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-gray-200'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && <div className='text-gray-400 text-sm'>Đang trả lời...</div>}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className='p-2 flex border-t border-slate-700'>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className='flex-1 bg-slate-800 text-white px-3 py-2 rounded-lg outline-none'
              placeholder='Nhập tin nhắn...'
            />
            <button
              onClick={() => sendMessage()}
              className='ml-2 bg-blue-500 px-3 rounded-lg'
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  )
}