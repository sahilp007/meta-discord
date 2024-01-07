'use client';

import React from 'react';
import {ServerWithMembersWithProfiles} from "@/types";
import {MemberRole} from "@prisma/client";
import {ChannelType} from ".prisma/client";
import {ActionTooltip} from "@/components/action-tooltip";
import {Plus, Settings} from "lucide-react";
import {useModal} from "@/hooks/use-modal-store";


interface ServerSectionProps {
	label: string;
	role?: MemberRole;
	sectionType: 'channels' | 'members';
	channelType?: ChannelType;
	server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({label, role, sectionType, channelType, server}: ServerSectionProps) => {

	const {onOpen} = useModal();

	return (<div className='flex items-center justify-between py-2'>
		<p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400'>
			{label}
		</p>
		{role !== MemberRole.MEMBER && sectionType === 'channels' && (
			<ActionTooltip label='Create Channel' side='top' align='center'>
				<button onClick={() => onOpen('createChannel', {channelType})}>
					<Plus
						className='h-5 w-5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'/>
				</button>
			</ActionTooltip>
		)}
		{role === MemberRole.ADMIN && sectionType === 'members' && (
			<ActionTooltip label='Manage Members' side='top' align='center'>
				<button onClick={() => onOpen('members',{server})}>
					<Settings
						className='h-5 w-5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'/>
				</button>
			</ActionTooltip>
		)}

	</div>);
};

export default ServerSection;