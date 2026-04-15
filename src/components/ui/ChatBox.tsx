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

  const sendMessage = async (customMessage?: string) => {
    const msg = customMessage || input
    if (!msg.trim()) return

    setInput('')
    setLoading(true)

    const newMessages = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)

    try {
      const res = await fetch('http://localhost:4000/guest/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history: newMessages
        })
      })

      const data = await res.json()

      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.reply }
      ])
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Lỗi server 😢' }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!isHome) return null

  return (
    <div className='fixed bottom-5 right-6 md:right-12 z-50'>

      {/* Nút mở */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg transition hover:scale-105'
        >
          💬 Chat
        </button>
      )}

      {/* Chatbox */}
      {open && (
        <div className='w-80 h-[420px] bg-slate-900 text-white rounded-2xl shadow-2xl flex flex-col border border-slate-700'>

          {/* Header */}
          <div className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 flex justify-between items-center rounded-t-2xl'>
            <span className='font-semibold'>🤖 Trợ lý AI</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* Nội dung */}
          <div className='flex-1 p-3 overflow-y-auto space-y-3'>

            {/* Gợi ý */}
            {messages.length <= 1 && (
              <div className='flex gap-2 flex-wrap'>
                <button
                  onClick={() => sendMessage('món nào ngon')}
                  className='bg-slate-700 px-2 py-1 rounded text-xs hover:bg-slate-600'
                >
                  Món ngon
                </button>
                <button
                  onClick={() => sendMessage('có gì rẻ không')}
                  className='bg-slate-700 px-2 py-1 rounded text-xs hover:bg-slate-600'
                >
                  Món rẻ
                </button>
                <button
                  onClick={() => sendMessage('có đồ uống gì')}
                  className='bg-slate-700 px-2 py-1 rounded text-xs hover:bg-slate-600'
                >
                  Đồ uống
                </button>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Avatar AI */}
                {msg.role !== 'user' && (
                  <div className='w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs'>
                    🤖
                  </div>
                )}

                {/* Message */}
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-slate-700 text-gray-200 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Avatar user */}
                {msg.role === 'user' && (
                  <div className='w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs'>
                    U
                  </div>
                )}
              </div>
            ))}

            {/* Typing */}
            {loading && (
              <div className='flex items-center gap-2'>
                <div className='w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs'>
                  🤖
                </div>
                <div className='flex gap-1'>
                  <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></span>
                  <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150'></span>
                  <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300'></span>
                </div>
              </div>
            )}

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
              className='ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-lg text-sm'
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  )
}