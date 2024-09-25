import { useCallback, useEffect, useRef, useState } from "react"
import { useConversation } from "./useConversation"
import { gptSlugToNameMap } from "./gptSlugToNameMap"
import MarkdownRenderer from 'react-markdown-renderer';

export function Conversation({ selectedGptSlug, onBack }) {
    const [messages, setMessages] = useState([])

    const messageContainerRef = useRef(null)
    const inputRef = useRef(null)

    const { isLoading, sendMessage, lastMessage } = useConversation({ selectedGpt: selectedGptSlug })

    function handleSubmit(e) {
        e.preventDefault()
        const formValue = Object.fromEntries(new FormData(e.target))
        addMessage({ actor: 'user', text: formValue.message })
        sendMessage(formValue.message)
        e.target.reset()
    }

    const addMessage = useCallback(({ actor, text }) => {
        setMessages((currentMessages) => [...currentMessages, { actor, text }])
    }, [])

    useEffect(() => {
        if (lastMessage) addMessage({ actor: 'assistant', text: lastMessage })
    }, [lastMessage, addMessage])

    useEffect(() => {
        if (messageContainerRef.current) messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }, [messages])

    useEffect(() => {
        if (!isLoading && inputRef.current) inputRef.current.focus()
    }, [isLoading])

    return <div className="conversation-container">
        <div className="conversation-header">
            <button className="back-button" onClick={onBack}>Back</button>
            <h1>{gptSlugToNameMap[selectedGptSlug]}</h1>
        </div>
        <div className="messages-container" ref={messageContainerRef}>
            {messages.map((message, i) => (
                <div className={`message ${message.actor}`} key={`message-${i}`}>
                    <MarkdownRenderer markdown={message.text} />
                </div>
            ))}
            {isLoading && <div className="message assistant loading">Generating...</div>}
        </div>
        <form className="input-container" onSubmit={handleSubmit} disabled={isLoading}>
            <input type="text" name="message" className="message-input" placeholder="Type your message..." disabled={isLoading} ref={inputRef} />
            <button type="submit" className="message-button" disabled={isLoading}>Send</button>
        </form>
    </div>
}
