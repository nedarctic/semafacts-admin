import { SenderType } from "@/lib/enums/sender-type.enum";
import { type Message as UserMessage } from "@/lib/types/message";
import { Bubble, BubbleContent, BubbleGroup } from "./ui/bubble";
import { Message, MessageContent } from "./ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerProvider, MessageScrollerViewport } from "./ui/message-scroller";

export function MessagesAdminComponent({ messages }: { messages: UserMessage[] }) {

    return <MessageScrollerProvider>
        <MessageScroller>
            <MessageScrollerViewport>
                <MessageScrollerContent
                    className="p-(--card-spacing)"
                >
                    {messages.map(({ content, senderType }, index) => {

                        const isHandler = senderType === SenderType.Handler;
                        return <Message key={index} className={isHandler ? "items-end" : "items-start"}>
                            <MessageContent>
                                <BubbleGroup>
                                    <Bubble align={isHandler ? "end" : "start"} variant={isHandler ? "default" : "secondary"}>

                                        <span className="text-xs">{senderType}</span>
                                        <BubbleContent>{content}</BubbleContent>

                                    </Bubble>
                                </BubbleGroup>
                            </MessageContent>
                        </Message>
                    })}
                </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
        </MessageScroller>
    </MessageScrollerProvider>
}