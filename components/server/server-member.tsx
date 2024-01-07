'use client';

import React from 'react';
import {Member, MemberRole, Profile, Server} from "@prisma/client";
import {useModal} from "@/hooks/use-modal-store";
import {useParams, useRouter} from "next/navigation";
import {ShieldAlert, ShieldCheck} from "lucide-react";
import {cn} from "@/lib/utils";
import Image from "next/image";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";


interface ServerMemberProps {
	member:Member & {profile:Profile} ;
	server: Server;
}
const roleIconMap = {
	[MemberRole.ADMIN]: <ShieldAlert className='text-rose-500 h-4 w-4 mr-2'/>,
	[MemberRole.MEMBER]: null,
	[MemberRole.MODERATOR]: <ShieldCheck className='text-indigo-500 h-4 w-4 mr-2'/>,
}
const ServerMember = ({member, server}: ServerMemberProps) => {

	const {onOpen} = useModal();
	const params = useParams();
	const router = useRouter();
	const icon = roleIconMap[member.role];

	return (
		<button
			className={cn(
				"group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
				params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
			)}
		>
			<p className={cn(
				"flex items-center gap-2 line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
				params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
			)}>
				<Image alt='avatar' src={member.profile?.imageUrl} width={30} height={30}
				       className='rounded-full select-none none'/>
				{member.profile.name}
				<TooltipProvider delayDuration={100} skipDelayDuration={10}>
					<Tooltip>
						<TooltipTrigger asChild>{roleIconMap[member?.role]}</TooltipTrigger>
						<TooltipContent>
							<p>{member.role}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</p>
		</button>
	);
};

export default ServerMember;