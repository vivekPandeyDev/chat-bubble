import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Message, SendTextMessageRequest } from "@/type/message";

export const useRoomSocket = (roomId?: string, currentUserId?: string) => {
    const queryClient = useQueryClient();

    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
        roomId ? `ws://localhost:3000/ws/chat/${roomId}` : null,
        {
            onOpen: () => console.info(`Connected to room ${roomId}`),
            onClose: () => console.info(`Disconnected from room ${roomId}`),
            onError: (e) => console.error("⚠️ WebSocket error:", e),
            shouldReconnect: () => !!roomId,
            share: false,
        }
    );

    // When new WebSocket message arrives
    useEffect(() => {
        if (!lastMessage) return;
        console.log("📩 New WebSocket message:", lastMessage.data);
        try {
            const parsed: Message = JSON.parse(lastMessage.data);

            // ✅ Update cached messages for this room
            queryClient.setQueryData(["messages", roomId], (oldData: any) => {
                if (!oldData) return oldData;

                // Example: if oldData.pages structure like react-query infinite query
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any, idx: number) =>
                        idx === 0
                            ? { ...page, content: [parsed, ...page.content] } // prepend new message to first page
                            : page
                    ),
                };
            });
        } catch (e) {
            console.error("❌ Failed to parse incoming WebSocket message:", e);
        }
    }, [lastMessage, queryClient, roomId]);

    const sendMessage = (content: string) => {
        console.log('Sending message via WebSocket:', { content });
        if (!content.trim() || !roomId) return;

        const payload: Partial<SendTextMessageRequest> = {
            senderId: currentUserId,
            content: content.trim(),
            messageType: "TEXT",
        };

        sendJsonMessage(payload);
    };

    const connectionStatus =
        {
            [ReadyState.CONNECTING]: "Connecting...",
            [ReadyState.OPEN]: "Connected",
            [ReadyState.CLOSING]: "Closing...",
            [ReadyState.CLOSED]: "Disconnected",
            [ReadyState.UNINSTANTIATED]: "Uninstantiated",
        }[readyState] || "Unknown";

    return { sendMessage, connectionStatus };
};
