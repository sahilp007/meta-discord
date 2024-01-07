'use client';

import React, {useEffect, useState} from 'react';
import {Search} from "lucide-react";
import {
	CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from "@/components/ui/command";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useParams, useRouter} from "next/navigation";


interface ServerSearchProps {
	data: {
		label: string;
		type: "channel" | "member",
		data: {
			icon: React.ReactNode;
			name: string;
			id: string;
			role?: string;
		}[] | undefined
	}[]
}

const ServerSearch = ({data}: ServerSearchProps) => {

	const [open, setOpen] = useState(false);
	const router = useRouter();
	const params = useParams();

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
				e.preventDefault();
				setOpen(true);
			}
		}
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	const onClick = ({id, type}: { id: string; type: 'channel' | 'member' }) => {
		setOpen(false);
		if (type === 'channel') {
			router.push(`/servers/${params?.serverId}/channels/${id}`);
		} else {
			router.push(`/servers/${params?.serverId}/conversations/${id}`);
		}

	}


	return (<>
		<button onClick={() => setOpen(true)}
		        className='group px-1 py-1 rounded-md flex items-center gap-x-2 w-full
			        hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
			<Search className='h-5 w-5 text-zinc-500 group-hover:text-gray-400 transition'/>
			<p className='px-1 font-semibold text-sm text-zinc-500 dark:text-zinc-400
				group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition'
			>Search</p>
			<kbd
				className='pointer-events-none inline-flex h-5 select-none items-center
					 gap-1 text-[12px] font-medium text-muted-foreground ml-auto bg-muted
					 rounded border px-2 font-mono text-xs '>
				<span className='text-sm'>CTRL K</span>
			</kbd>

		</button>
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder='Search for Members or Channels'/>
			<CommandList>
				<CommandEmpty>
					No Results Found
				</CommandEmpty>
				{data.map(({data, label, type}) => {
					if (!data?.length) return null;

					return (<CommandGroup key={label} heading={label}>
						{data?.map(({id, icon, name, role}) => {
							return (<CommandItem key={id}
							                     className='flex items-center gap-x-2'
							                     onSelect={() => onClick({id, type})}
							>
								<TooltipProvider delayDuration={100} skipDelayDuration={10}>
									<Tooltip>
										<TooltipTrigger asChild>{icon}</TooltipTrigger>
										{role && <TooltipContent className='translate-x-8'>
                                            <p>{role}</p>
                                        </TooltipContent>}
									</Tooltip>
								</TooltipProvider>
								<span>{name}</span>
							</CommandItem>)
						})}
					</CommandGroup>)

				})}
			</CommandList>
		</CommandDialog>
	</>);
};

export default ServerSearch;