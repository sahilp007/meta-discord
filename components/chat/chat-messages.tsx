"use client";

import {Fragment} from "react";
import {Member, Message, Profile} from "@prisma/client";
import {Loader2, ServerCrash} from "lucide-react";

import {useChatQuery} from "@/hooks/use-chat-query";

import {ChatWelcome} from "./chat-welcome";
import {ChatItem} from "@/components/chat/chat-item";
import {format} from "date-fns";
import {ScrollArea} from "@/components/ui/scroll-area";

const DATE_FORMAT = "d MMM yyyy, h:mm a";

type MessageWithMemberWithProfile = Message & {
	member: Member & {
		profile: Profile
	}
}

interface ChatMessagesProps {
	name: string;
	member: Member;
	chatId: string;
	apiUrl: string;
	socketUrl: string;
	socketQuery: Record<string, string>;
	paramKey: "channelId" | "conversationId";
	paramValue: string;
	type: "channel" | "conversation";
}

export const ChatMessages = ({
	                             name,
	                             member,
	                             chatId,
	                             apiUrl,
	                             socketUrl,
	                             socketQuery,
	                             paramKey,
	                             paramValue,
	                             type,
                             }: ChatMessagesProps) => {
	const queryKey = `chat:${chatId}`;

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
	} = useChatQuery({
		queryKey,
		apiUrl,
		paramKey,
		paramValue,
	});

	if (status === "pending") {
		return (
			<div className="flex flex-col flex-1 justify-center items-center">
				<Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4"/>
				<p className="text-xs text-zinc-500 dark:text-zinc-400">
					Loading messages...
				</p>
			</div>
		)
	}

	if (status === "error") {
		return (
			<div className="flex flex-col flex-1 justify-center items-center">
				<ServerCrash className="h-7 w-7 text-zinc-500 my-4"/>
				<p className="text-xs text-zinc-500 dark:text-zinc-400">
					Something went wrong!
				</p>
			</div>
		)
	}

	return (
		<ScrollArea className='flex-1 px-3'>
			<div className="flex-1 flex flex-col py-4 overflow-y-auto">
				<div className="flex-1"/>
				<ChatWelcome
					type={type}
					name={name}
				/>
				<div className="flex flex-col-reverse mt-auto">
					{data?.pages?.map((group, i) => (
						<Fragment key={i}>
							{group?.items?.map((message: MessageWithMemberWithProfile) => (
								<ChatItem
									key={message.id}
									id={message.id}
									content={message.content}
									member={message.member}
									currentMember={member}
									fileUrl={message.fileUrl}
									isUpdated={message.updatedAt !== message.createdAt}
									socketQuery={socketQuery}
									socketUrl={socketUrl}
									deleted={message.deleted}
									timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
								/>
							))}
						</Fragment>
					))}
				</div>
			</div>
		</ScrollArea>
	)
}