import React from 'react';
import {Hash, User} from "lucide-react";
import {MobileToggle} from "@/components/mobile-toggle";
import Image from "next/image";
import {SocketIndicator} from "@/components/socket-indicator";


interface ChatHeaderProps {
	serverId: string;
	name: string;
	type: 'channel' | 'conversation';
	imageUrl?: string;
}

export const ChatHeader = ({serverId, name, type, imageUrl}: ChatHeaderProps) => {
	debugger;
	return (<div
		className='text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
		<MobileToggle serverId={serverId}/>
		{type === 'channel' && (<Hash className='text-neutral-500 dark:text-neutral-400 h-6 w-6 mr-2'/>)}
		{type === 'conversation' && (imageUrl !== undefined ?
			(<Image alt='avatar'
			        src={imageUrl}
			        width={36}
			        height={36}
			        className='rounded-full select-none none mr-2'/>) : (
				<User/>))}
		<p className='font-semibold text-md text-black dark:text-zinc-100'>
			{name}
		</p>
		<div className='ml-auto flex items-center'>
			<SocketIndicator/>
		</div>
	</div>);
}