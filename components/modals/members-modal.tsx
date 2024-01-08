"use client"

import qs from "query-string";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useModal} from "@/hooks/use-modal-store";
import {
	UserX, Check, MoreVertical, User, ShieldAlert, ShieldCheck, ShieldQuestion, Loader2,
} from "lucide-react";
import {useState} from "react";
import {ServerWithMembersWithProfiles} from "@/types";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {MemberRole} from "@prisma/client";
import axios from "axios";
import {useRouter} from "next/navigation";
import Image from "next/image";

const roleIconMap = {
	'ADMIN': <ShieldAlert className='text-rose-500 h-4 w-4 ml-2'/>,
	'MODERATOR': <ShieldCheck className='text-indigo-500 h-4 w-4 ml-2'/>,
	'MEMBER': null,
	'GUEST': null
}

export const MembersModal = () => {
	const router = useRouter();
	const {onOpen, isOpen, onClose, type, data} = useModal();
	const [loadingId, setLoadingId] = useState('')

	const isModalOpen = isOpen && type === 'members';
	const {server} = data as { server: ServerWithMembersWithProfiles };
	const onRoleChange = async (role: MemberRole, memberId: string) => {
		try {
			// debugger;
			setLoadingId(memberId);
			const url = qs.stringifyUrl({
				url: `/api/members/${memberId}`, query: {
					serverId: server?.id,
				}
			})

			const res = await axios.patch(url, {role});
			router.refresh();
			onOpen('members', {server: res.data});
		} catch (e) {
			console.log(e)
		} finally {
			setLoadingId('')
		}
	}
const onKick = async (memberId: string) => {
		try {
			// debugger;
			setLoadingId(memberId);
			const url = qs.stringifyUrl({
				url: `/api/members/${memberId}`, query: {
					serverId: server?.id,
				}
			})

			const res = await axios.delete(url);
			router.refresh();
			onOpen('members', {server: res.data});
		} catch (e) {
			console.log(e)
		} finally {
			setLoadingId('')
		}

}
	return (<Dialog open={isModalOpen} onOpenChange={onClose}>
		<DialogContent className="bg-fuchsia-100 text-black p-0 overflow-hidden">
			<DialogHeader className='pt-8 px-6'>
				<DialogTitle className='text-2xl text-center'>
					{server?.name.toUpperCase()}
				</DialogTitle>
				<DialogDescription className='px-6 pb-3 text-center text-zinc-500'>
					{server?.members?.length} Members
				</DialogDescription>
			</DialogHeader>
			<ScrollArea className='mt-8 max-h-[420px] px-8 mb-8'>
				<div className='px-6 pb-8'>
					{/*{server?.members?.map((member) => (*/}
					{server?.members
						?.sort((a, b) => {
							const roleOrder = {
								ADMIN: 0, MODERATOR: 1, MEMBER: 2, GUEST: 3,
							};
							return roleOrder[a.role] < roleOrder[b.role] ? -1 : roleOrder[a.role] > roleOrder[b.role] ? 1 : 0;
						})
						?.map((member) => (<div key={member.id} className='flex items-center space-x-4 gap-x-2 mb-3 '>
							<Image alt='avatar' src={member.profile?.imageUrl} width={40} height={40}
							     className='rounded-full select-none none'/>
							<div className='flex-1'>
								<div className='font-semibold flex items-center'>{member.profile?.name}
									<TooltipProvider delayDuration={100} skipDelayDuration={10}>
										<Tooltip>
											<TooltipTrigger asChild>{roleIconMap[member?.role]}</TooltipTrigger>
											<TooltipContent>
												<p>{member.role}</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
								{/*<div className='text-sm text-zinc-500'>{member.profile.email}</div>*/}
								<div className='text-sm text-zinc-500'>{member.role}</div>
							</div>
							{server.profileId !== member.profileId && loadingId !== member.id && (<div>
								<DropdownMenu>
									<DropdownMenuTrigger>
										<MoreVertical
											className='h-5 w-5 text-zinc-500 hover:text-zinc-600 cursor-pointer'
										/>
									</DropdownMenuTrigger>
									<DropdownMenuContent side='left'>
										<DropdownMenuSub>
											<DropdownMenuSubTrigger className='flex items-center'>
												<ShieldQuestion className='h-4 w-4 mr-2'/>
												<span className='text-sm'>Change Role</span>
											</DropdownMenuSubTrigger>
											<DropdownMenuPortal>
												<DropdownMenuSubContent>
													<DropdownMenuItem
														onClick={() => onRoleChange('MODERATOR', member?.id)}>
														<ShieldCheck className='h-4 w-4 mr-2'/>
														Moderator
														{member.role === 'MODERATOR' &&
                                                            <Check className='ml-auto h-4 w-4'/>}
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => onRoleChange('MEMBER', member?.id)}>
														<User className='h-4 w-4 mr-2'/>
														Member
														{member.role === 'MEMBER' &&
                                                            <Check className='ml-auto h-4 w-4'/>}
													</DropdownMenuItem>
												</DropdownMenuSubContent>
											</DropdownMenuPortal>
										</DropdownMenuSub>

										<DropdownMenuSeparator/>

										<DropdownMenuItem onClick={()=>onKick(member.id)} className='text-rose-500 text-sm'>
											<UserX className='h-4 w-4 mr-2 text-rose-500 '/>
											Kick
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>)}
							{loadingId === member.id && (<div>
								<Loader2 className='animate-spin h-4 w-4 ml-auto text-zinc-500'/>
							</div>)}
						</div>))}

				</div>
			</ScrollArea>

		</DialogContent>
	</Dialog>);
}