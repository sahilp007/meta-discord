import React from 'react';
import {currentProfile} from "@/lib/current-profile";
import {redirectToSignIn} from "@clerk/nextjs";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import {ChatHeader} from "@/components/chat/chat-header";
import {ChatInput} from "@/components/chat/chat-input";


interface ChannelIdPageProps {
	params: {
		serverId: string;
		channelId: string;
	}
}

const ChannelIdPage = async ({params}: ChannelIdPageProps) => {

	const profile = await currentProfile();
	if (!profile) return redirectToSignIn();

	const channel = await db.channel.findUnique({
		where: {
			id: params.channelId,
		}
	})
	const member = await db.member.findFirst({
		where: {
			serverId: params.serverId,
			profileId: profile.id
		}
	})

	if(!channel || !member) redirect('/');

	return (
		<div className='bg-[#fff7ed] dark:bg-[#393934] flex flex-col h-full'>
			<ChatHeader
			name={channel.name}
			type='channel'
			serverId={params.serverId}
			/>
			<div className='flex-1'>Future Messages</div>
			<ChatInput
			name = {channel.name}
			type = 'channel'
			apiUrl = {`/api/socket/messages`}
			query = {{serverId: channel.serverId, channelId: channel.id}}
			/>
		</div>
	);
};

export default ChannelIdPage;