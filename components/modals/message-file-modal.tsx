"use client"

import {
	Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import * as z from "zod";
import qs from "query-string";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {FileUpload} from "@/components/file-upload";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useModal} from "@/hooks/use-modal-store";

const formSchema = z.object({
	fileUrl: z.string().min(1, {message: "Attachment is required"}).max(2000),
})
export const MessageFileModal = () => {

	const {isOpen, onClose, type, data} = useModal();
	const isModalOpen = isOpen && type === 'messageFile';
	const {apiUrl, query} = data;

	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(formSchema), defaultValues: {
			name: "", fileUrl: "",
		}
	})
	const isLoading = form.formState.isSubmitting;
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: apiUrl || "", query,
			});
			await axios.post(url, {...values, content: values.fileUrl});

			form.reset();
			handleModalClose();
			router.refresh();

		} catch (e) {
			console.error(e);
		}
		console.log(values);
	}
	const handleModalClose = () => {
		onClose();
		form.reset();
	}

	return (<Dialog open={isModalOpen} onOpenChange={handleModalClose}>
		<DialogContent className="bg-fuchsia-100 text-black p-0 overflow-hidden">
			<DialogHeader className='pt-8 px-6'>
				<DialogTitle className='text-2xl text-center'>
					Add Attachment
				</DialogTitle>
				<DialogDescription className='text-center text-zinc-500'>
					Send file as a message
				</DialogDescription>
			</DialogHeader>

			<Form {...form} >
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
					<div className='space-y-8 pr-7 pl-7'>
						<div className='flex items-center justify-center text-center'>
							<FormField
								name='fileUrl'
								control={form.control}
								render={({field}) => (<FormItem className=''>
									<FormLabel
										className='uppercase font-bold text—zinc-500 dark:text-secondary/70'>
									</FormLabel>
									<FormControl>
										<FileUpload
											endpoint='messageFile'
											value={field.value}
											onChange={field.onChange}
											onBeforeUploadBegin={(files) => {
												// setFileName(files[0]?.name || null);
												console.log(files[0])
												return files;
											}}
										/>
									</FormControl>
									<FormMessage className='text-red-500'>
										{form.formState.errors.fileUrl?.message}
									</FormMessage>
								</FormItem>)}
							/>
						</div>
						{/*TODO: Add text support with file*/}
						{/*<FormField name='name'*/}
						{/*           control={form.control}*/}
						{/*           render={({field}) => (<FormItem className=''>*/}
						{/*		           <FormLabel*/}
						{/*			           className='uppercase text—xs font-bold text—zinc-500 dark:text-secondary/70'>*/}
						{/*			           Server Name*/}
						{/*		           </FormLabel>*/}
						{/*		           <FormControl>*/}
						{/*			           <Input {...field} disabled={isLoading}*/}
						{/*			                  className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'*/}
						{/*			                  placeholder='Enter Server Name'/>*/}
						{/*		           </FormControl>*/}
						{/*		           <FormMessage className='text-red-500'>*/}
						{/*			           {form.formState.errors.name?.message}*/}
						{/*		           </FormMessage>*/}

						{/*	           </FormItem>)}*/}
						{/*/>*/}
					</div>
					<DialogFooter className='bg-gray-100 px-6 py-4'>
						<Button variant='primary' disabled={isLoading}>
							Upload
						</Button>
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	</Dialog>);
}