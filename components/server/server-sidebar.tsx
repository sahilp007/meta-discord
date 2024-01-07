import React from 'react';
import {currentProfile} from "@/lib/current-profile";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {ChannelType, MemberRole} from "@prisma/client";
import ServerHeader from "@/components/server/server-header";
import {ScrollArea} from "@/components/ui/scroll-area";
import ServerSearch from "@/components/server/server-search";
import {Hash, Mic, ShieldAlert, ShieldCheck, Video} from "lucide-react";

interface ServerSidebarProps {
	serverId: string
}

const iconMap = {
	[ChannelType.TEXT]: <Hash className='mr-2 h-4 w-4'/>,
	[ChannelType.AUDIO]: <Mic className='mr-2 h-4 w-4'/>,
	[ChannelType.VIDEO]: <Video className='mr-2 h-4 w-4'/>
}

const roleMap = {
	[MemberRole.ADMIN]: <ShieldAlert className='text-rose-500 h-4 w-4 mr-2'/>,
	[MemberRole.MEMBER]: null,
	[MemberRole.MODERATOR]: <ShieldCheck className='text-indigo-500 h-4 w-4 mr-2'/>,
}

const ServerSidebar = async ({serverId}: ServerSidebarProps) => {

	const profile = await currentProfile();
	if (!profile) {
		return redirect('/')
	}
	const server = await db.server.findUnique({
		where: {
			id: serverId
		},
		include: {
			channels: {
				orderBy: {
					createdAt: 'asc'
				}
			},
			members: {
				include: {
					profile: true,
				},
				orderBy: {
					role: 'asc'
				}
			}
		}
	});

	const textChannels = server?.channels.filter(channel => channel.type === ChannelType.TEXT);
	const audioChannels = server?.channels.filter(channel => channel.type === ChannelType.AUDIO);
	const videoChannels = server?.channels.filter(channel => channel.type === ChannelType.VIDEO);
	const members = server?.members.filter(member => member.profileId !== profile.id);
	// const members = server?.members.filter(member => member.profileId !== profile.id);
	const members = server?.members

	if(!server) {
		redirect('/');
	}
	const role = server?.members.find(member => member.profileId === profile.id)?.role;

	return (
		<div className='flex flex-col h-full text-primary w-full dark:bg-[#393934] bg-[#e9e0d7]'>
			<ServerHeader
			server={server}
			role={role}
			/>
			<ScrollArea className='flex-grow'>
				<div className='flex flex-col space-y-1'>
					<ServerSearch
					data={
						[
							{
								data: textChannels?.map(channel => ({
									icon: iconMap[channel.type],
									name: channel.name,
									id: channel.id,
								})),
								label: 'Text Channels',
								type: 'channel'
							},
							{
								data: audioChannels?.map(channel => ({
									icon: iconMap[channel.type],
									name: channel.name,
									id: channel.id
								})),
								label: 'Voice Channels',
								type: 'channel'
							},
							{
								data: videoChannels?.map(channel => ({
									icon: iconMap[channel.type],
									name: channel.name,
									id: channel.id
								})),
								label: 'Video Channels',
								type: 'channel'
							},
							{
								data: members?.map(member => ({
									icon: roleMap[member.role],
									id: member.id,
									name: member.profile.name,
									role: member.role
								})),
								label: 'Members',
								type: 'member'
							}
						]
					}

					/>

					{/*{textChannels?.map(channel => (*/}
					{/*	<div key={channel.id} className='px-3 py-2 text-sm cursor-pointer hover:bg-gray-700/10 dark:hover:bg-zinc-700/50 transition'>*/}
					{/*		<span className='text-gray-500 dark:text-gray-400'>#</span>*/}
					{/*		{channel.name}*/}
					{/*	</div>*/}
					{/*))}*/}
				</div>
				{!!members?.length && (<div className='mb-2'>
					<ServerSection
						sectionType='members'
						label='Member List'
						server={server}
						role={role}
					/>
					<div className=''>{members?.map(member => (
						<ServerMember
							member={member}
							server={server}
							key={member.id}
						/>
					))}
					</div>
					</div>
					)}
			</ScrollArea>
		</div>
	);
};

export default ServerSidebar;