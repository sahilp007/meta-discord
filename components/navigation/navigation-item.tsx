'use client';

import React from 'react';
import Image from 'next/image';
import {useParams, useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {ActionTooltip} from "@/components/action-tooltip";

interface NavigationItemProps {
	id: string;
	name: string;
	imageUrl: string;
}

const NavigationItem = ({id, name, imageUrl}: NavigationItemProps) => {
	const params = useParams();
	const router = useRouter();
	const onClick = () => {
		router.push(`/servers/${id}`);

	}

	return (
		<ActionTooltip
			align='center'
			label={name}
			side='right'
		>
			<button
				onClick={onClick}
				className='group flex items-center relative'
			>
				<div className={cn(
					'absolute left-0 bg-primary rounded-r-full w-[4px] transition-all',
					params?.serverId !== id && 'group-hover:h-[20px]',
					params?.serverId === id ? 'h-[36px]' : 'h-[8px]'
				)}/>
				<div className={cn(
					'relative flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center',
					params?.serverId === id && 'bg-primary/10 text-primary rounded-[16px]',
				)}>
					<Image
						src={imageUrl}
						alt={name}
						fill
						// className={cn(
						// 	'group-hover:text-white transition',
						// 	params.serverId === id ? 'text-primary' : 'text-neutral-500'
						// )}
					/>
				</div>
			</button>
		</ActionTooltip>
	);
};

export default NavigationItem;