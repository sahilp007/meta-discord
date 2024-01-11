import React from 'react';
import {Hash} from "lucide-react";
import {MobileToggle} from "@/components/mobile-toggle";


interface ChatHeaderProps {
	serverId: string;
	name: string;
	type: 'channel' | 'conversation';
	imageUrl?: string;
}

export const ChatHeader = ({serverId, name, type, imageUrl}: ChatHeaderProps) => {
	debugger;
	return (
		<div className='text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
			<MobileToggle serverId={serverId}/>
			{type === 'channel' && (
				<Hash className='text-neutral-500 dark:text-neutral-400 h-6 w-6 mr-2'/>
			)}
			<p className='font-semibold text-md text-black dark:text-zinc-100'>
				{name}
			</p>
		</div>);
}