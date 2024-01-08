"use client"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useModal} from "@/hooks/use-modal-store";
import {useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import qs from "query-string";

export const DeleteChannelModal = () => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const {onOpen, isOpen, onClose, type, data} = useModal();
	const isModalOpen = isOpen && type === 'deleteChannel';
	const {server, channel} = data;

	const onClick = async () => {
		setIsLoading(true);
		try {
			const url = qs.stringifyUrl({url:`/api/channels/${channel?.id}`, query:{ serverId: server?.id}});
			await axios.delete(url);
			onClose();
			router.push(`/servers/${server?.id}`)
			router.refresh();
		} catch (e) {
			console.error(e);
		}
		setIsLoading(false);

	}

	return (<Dialog open={isModalOpen} onOpenChange={onClose}>
		<DialogContent className="bg-fuchsia-100 text-black p-0 overflow-hidden">
			<DialogHeader className='pt-8 px-6'>
				<DialogTitle className='text-2xl text-center'>
					Delete Channel
				</DialogTitle>
				<DialogDescription className='text-center text-zinc-500 py-5 text-xl'>
					Are you sure you want to delete <span className='font-semibold text-indigo-500'
				>#{channel?.name}</span> permanently?
				</DialogDescription>
			</DialogHeader>
			<DialogFooter className='px-6 py-4 bg-gray-100'>
				<div className='flex items-center justify-between w-full'>
					<Button className='' onClick={onClose}
					        disabled={isLoading}
					        variant='ghost'
					>
						Cancel
					</Button>
					<Button className=''
					disabled={isLoading}
					        variant='primary'
					        onClick={onClick}
					>
						Delete Channel
					</Button>
				</div>
			</DialogFooter>

		</DialogContent>
	</Dialog>);
}