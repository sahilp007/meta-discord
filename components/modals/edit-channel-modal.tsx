"use client"
import qs from 'query-string';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useModal} from "@/hooks/use-modal-store";
import {ChannelType} from "@prisma/client";
import {Select, SelectValue, SelectTrigger, SelectItem, SelectContent} from "@/components/ui/select";
import {useEffect} from "react";

const formSchema = z.object({
	name: z.string().min(1, {message: "Please enter a channel name"})
		.max(50).refine(name => name.toLowerCase() !== 'general', {message: "Channel name cannot be 'general'"}),
	type: z.nativeEnum(ChannelType)
})
export const EditChannelModal = () => {

	const {isOpen, onClose, type, data} = useModal();
	const isModalOpen = isOpen && type === 'editChannel';
	const router = useRouter();
	const {channel,server} = data;
	const form = useForm({
		resolver: zodResolver(formSchema), defaultValues: {
			name: `${channel?.name}`,
			type: channel?.type || ChannelType.TEXT
		}
	})
	useEffect(() => {
		if(channel){
			form.setValue('name', channel.name);
			form.setValue('type', channel.type);
		}
	}, [channel, form]);
	const isLoading = form.formState.isSubmitting;
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: `/api/channels/${channel?.id}`,
				query: {
					serverId: server?.id
				}
			})
			await axios.patch(url, values);

			form.reset();
			router.refresh();
			onClose();
		} catch (e) {
			console.error(e);
		}
		console.log(values);
	}
	const handleClose = () => {
		form.reset();
		onClose();
	}
	return (<Dialog open={isModalOpen} onOpenChange={handleClose}>
		<DialogContent className="bg-fuchsia-100 text-black p-0 overflow-hidden">
			<DialogHeader className='pt-8 px-6'>
				<DialogTitle className='text-2xl text-center'>
					Rename the Channel
				</DialogTitle>
			</DialogHeader>

			<Form {...form} >
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
					<div className='space-y-8 pr-7 pl-7'>
						<FormField name='name'
						           control={form.control}
						           render={({field}) => (<FormItem className=''>
							           <FormLabel
								           className='uppercase text—xs font-bold text—zinc-500 dark:text-secondary/70'>
								           Change Channel Name to
							           </FormLabel>
							           <FormControl>
								           <Input {...field} disabled={isLoading}
								                  className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
								                  placeholder='Enter New Name'/>
							           </FormControl>
							           <FormMessage className='text-red-500'>
								           {form.formState.errors.name?.message}
							           </FormMessage>
						           </FormItem>)}
						/>
						<FormField name='type' control={form.control} render={({field}) => (
							<FormItem>
								<FormLabel>Channel Type</FormLabel>
								<Select
									disabled={isLoading}
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger
											className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 capitalize outline-none'>
											<SelectValue placeholder='Select Channel Type'/>

										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Object.values(ChannelType).map(type => <SelectItem key={type} value={type}
										                                                    className='capitalize'>{type.toUpperCase()}</SelectItem>)}
									</SelectContent>

								</Select>
								<FormMessage/>
							</FormItem>
						)}/>
					</div>
					<DialogFooter className='bg-gray-100 px-6 py-4'>
						<Button variant='primary' disabled={isLoading}>
							Submit Edit
						</Button>
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	</Dialog>);
}