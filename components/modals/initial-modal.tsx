"use client"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {FileUpload} from "@/components/file-upload";
import axios from "axios";
import {useRouter} from "next/navigation";

const formSchema = z.object({
	name: z.string().min(1, {message: "Please enter a server name"}).max(50),
	imageUrl: z.string().min(1, {message: "Please enter a server image URL"}).max(2000),
})
export const InitialModal = () => {
	const [isMounted, setIsMounted] = useState(false);
	const router = useRouter();
	useEffect(() => {
		setIsMounted(true);
	}, [])
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			imageUrl: "",
		}
	})
	const isLoading = form.formState.isSubmitting;
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post('/api/servers', values);

			form.reset();
			router.refresh();
			window.location.reload();


		} catch (e) {
			console.error(e);
		}
		console.log(values);
	}

	if (!isMounted) {
		return null;
	}

	return (
		<Dialog open>
			<DialogContent className="bg-fuchsia-100 text-black p-0 overflow-hidden">
				<DialogHeader className='pt-8 px-6'>
					<DialogTitle className='text-2xl text-center'>
						Welcome to the server!
					</DialogTitle>
					<DialogDescription className='text-center text-zinc-500'>
						You are the first member of this server! You can add the Server Name and Logo.
					</DialogDescription>
				</DialogHeader>

				<Form {...form} >
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<div className='space-y-8 pr-7 pl-7'>
							<div className='flex items-center justify-center text-center'>
								<FormField
									name='imageUrl'
									control={form.control}
									render={({field}) => (
										<FormItem className=''>
											<FormLabel
												className='uppercase font-bold text—zinc-500 dark:text-secondary/70'>
												Server Image
											</FormLabel>
											<FormControl>
												<FileUpload
													endpoint='serverImage'
													value={field.value}
													onChange={field.onChange}

												/>
											</FormControl>
											<FormMessage className='text-red-500'>
												{form.formState.errors.imageUrl?.message}
											</FormMessage>
										</FormItem>
									)}
								/>
							</div>
							<FormField name='name'
							           control={form.control}
							           render={({field}) => (
								           <FormItem className=''>
									           <FormLabel
										           className='uppercase text—xs font-bold text—zinc-500 dark:text-secondary/70'>
										           Server Name
									           </FormLabel>
									           <FormControl>
										           <Input {...field} disabled={isLoading}
										                  className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
										                  placeholder='Enter Server Name'/>
									           </FormControl>
									           <FormMessage className='text-red-500'>
										           {form.formState.errors.name?.message}
									           </FormMessage>

								           </FormItem>
							           )}
							/>
						</div>
						<DialogFooter className='bg-gray-100 px-6 py-4'>
							<Button variant='primary' disabled={isLoading}>
								Create Server
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}