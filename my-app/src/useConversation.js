import { useCallback, useRef, useState } from "react";

export function useConversation({ selectedGpt }) {
    const [isLoading, setIsLoading] = useState(false)
    const [lastMessage, setLastMessage] = useState(undefined)
    const threadIdRef = useRef(null)
    const abortControllerRef = useRef(null)

    const sendMessage = useCallback(async (message) => {
        setIsLoading(true)
        if (abortControllerRef.current) abortControllerRef.current.abort('New message sent')
        abortControllerRef.current = new AbortController()
        setLastMessage(null)
        try {
            const apiUrl = 'https://custom-gpts.luan-lopes-zaaz.workers.dev'
            const response = await fetch(`${apiUrl}/assistants/${selectedGpt}/conversation`, {
                method: 'POST',
                body: JSON.stringify({ message, threadId: threadIdRef.current }),
                headers: { 'content-type': 'application/json'},
                signal: abortControllerRef.current.signal
            })
            abortControllerRef.current = null
            if (!response.ok) throw new Error(`Server responded with ${response.status}`)
            const { text, threadId } = await response.json()
            setLastMessage(text)
            threadIdRef.current = threadId
        } catch (error) {
            console.log('Error', typeof error)
            console.log('Error', error)
            setLastMessage('Error getting answer from assistant')
        } finally {
            setIsLoading(false)
        }
    }, [selectedGpt])

    return { isLoading, lastMessage, sendMessage }
}
