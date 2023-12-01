"use client"

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useModal} from "@/hooks/use-modal-store";
import {Label} from "@/components/ui/label";
import {Check, Copy, RefreshCw} from "lucide-react";
import {useOrigin} from "@/hooks/use-origin";
import {useState} from "react";
import axios from "axios";

export const InviteModal = () => {
	const [copied, setCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const {onOpen, isOpen, onClose, type, data} = useModal();
	const origin = useOrigin();
	const isModalOpen = isOpen && type === 'invite';
	const {server} = data;
	const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
	const onCopy = () => {
		navigator.clipboard.writeText(inviteUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	}

	const onNew = async () => {
		try {
			setIsLoading(true);
			const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
			onOpen('invite', {server: response.data});

		} catch (e) {
			console.log(e);
		} finally {
			setIsLoading(false);

		}
	}

	return (<Dialog open={isModalOpen} onOpenChange={onClose}>
		<DialogContent className="bg-fuchsia-100 text-black p-0 overflow-hidden">
			<DialogHeader className='pt-8 px-6'>
				<DialogTitle className='text-2xl text-center'>
					Invite Friends!
				</DialogTitle>
			</DialogHeader>
			<div className='p-6'>
				<Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
					Server invite link
				</Label>
				<div className='flex items-center mt-2 gap-x-2 '>
					<Input
						disabled={isLoading}
						className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
						value={inviteUrl}/>
					<Button onClick={onCopy} disabled={isLoading}
					        className='bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0'>
						{
							copied ? <Check className='h-5 w-5'/> : <Copy className='h-5 w-5'/>
						}
					</Button>
				</div>
				<Button disabled={isLoading} onClick={onNew} variant='link' size='sm' className='text-zinc-500 mt-4'>
					Generate new link
					<RefreshCw className='ml-2 h-4 w-4'/>
				</Button>
			</div>
		</DialogContent>
	</Dialog>);
}