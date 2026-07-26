"use client"

import { ArrowUpIcon, MessageCircleDashedIcon } from "lucide-react";
import { SubmitEvent, useState } from "react";
import { Bubble, BubbleContent } from "./ui/bubble";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { Form } from "./ui/form";
import { Message, MessageContent } from "./ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerProvider, MessageScrollerViewport } from "./ui/message-scroller";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Message as IncidentMessage } from "@/lib/types/message";
import { SenderType } from "@/lib/enums/sender-type.enum";
import { Spinner } from "./ui/spinner";
import z from "zod";


export function Messages({ 
    initialMessages, 
    senderType, 
    incidentId, 
    userId 
}: {
    initialMessages: IncidentMessage[],
    senderType: SenderType,
    incidentId: string,
    userId?: string,
}) {
    const [loading, setLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState(initialMessages);
    const [message, setMessage] = useState<string>("");
    const [errors, setErrors] = useState<any>({});

    const isMe = (senderType: SenderType) => {

    }

    const [isBusy, setIsBusy] = useState<boolean>(false);

    const updateMessages = () => {

        const newMessage = {
            content: message,
            incidentId,
            senderType,
            userId
        }

        setMessages(previous => [...previous, newMessage]);
    };

    const submitHandler = async (e: SubmitEvent) => {
        e.preventDefault();
        try {
            setLoading(true);

            const validationRes = z.string().trim().min(1, "Message is required").safeParse(message);

            if (!validationRes.success) {
                setErrors(z.treeifyError(validationRes.error));
                setLoading(false);
                return;
            }

            updateMessages();
            const url = `/api/messages/${incidentId}`;

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: (userId ? JSON.stringify({
                    content: message,
                    senderType,
                    handlerId: userId
                }) : JSON.stringify({
                    content: message,
                    senderType,
                }))
            });

            const data = await res.json();

            if (!res.ok) {
                setLoading(false);
                toast.error("Failed to send message");
                return;
            }

            setLoading(false);
            setMessage("");

        } catch {
            setLoading(false);
            toast.error("Service temporarily unavailable. Please try again later.")
        }
    };

    return (
        <MessageScrollerProvider>
            <div className="relative flex flex-col gap-4">
                <Card className="mx-auto h-140 w-full max-w-6xl gap-0">
                    <CardHeader className="gap-1 border-b">
                        <CardTitle>Incident Chat</CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-hidden p-0">
                        {messages.length === 0 ? (
                            <Empty className="h-full">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <MessageCircleDashedIcon />
                                    </EmptyMedia>
                                    <EmptyTitle>Hello!</EmptyTitle>
                                    <EmptyDescription>
                                        Start a new conversation
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        ) : (
                            <MessageScroller>
                                <MessageScrollerViewport>
                                    <MessageScrollerContent
                                        aria-busy={isBusy}
                                        className="p-(--card-spacing)"
                                    >
                                        {messages.map(({ content, senderType: sender }, index) => {

                                            const isMe = sender === senderType;
                                            return <Message key={index} className={isMe ? "items-end" : "items-start"}>
                                                <MessageContent>
                                                    <Bubble align={isMe ? "end" : "start"} variant={isMe ? "default" : "secondary"}>
                                                        <BubbleContent>{content}</BubbleContent>
                                                    </Bubble>
                                                </MessageContent>
                                            </Message>
                                        })}
                                    </MessageScrollerContent>
                                </MessageScrollerViewport>
                                <MessageScrollerButton />
                            </MessageScroller>
                        )}
                    </CardContent>

                    <CardFooter className="flex-col gap-2 items-end">
                        <Form
                            id="messages-form"
                            onSubmit={submitHandler}
                            className="flex flex-col items-end gap-2 w-full">
                            <Textarea placeholder={"New message"} value={message} onChange={e => setMessage(e.target.value)} />
                            <Button form="messages-form" type="submit" disabled={loading}>{loading ? <Spinner size={8} /> : <ArrowUpIcon size={16} />}</Button>
                        </Form>
                    </CardFooter>
                </Card>
                <div className="px-0.5 text-center text-xs text-muted-foreground">
                    Press send to send messages.
                </div>
            </div>
        </MessageScrollerProvider>
    )
}