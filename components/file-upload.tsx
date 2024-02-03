'use client';

import React, {useState} from 'react';
import {UploadDropzone} from "@/lib/uploadthing";
import Image from "next/image";
import {FileIcon, X} from 'lucide-react';
import '@uploadthing/react/styles.css';

interface FileUploadProps {
	onChange: (url?: string) => void;
	value: string;
	endpoint: 'messageFile' | 'serverImage';
	fileDisplay?: 'true' | 'false';
}

export const FileUpload = ({endpoint, onChange, value, fileDisplay}: FileUploadProps) => {

	const [fileName, setFileName] = useState<string | null>(null);
	const fileType = value?.split('.')?.pop();
	// if (fileDisplay === 'true') {
	// 	debugger;
	// 	if (value && fileType !== 'pdf') {
	// 		return (<div className='flex items-center justify-center h-40 w-40 relative'>
	// 			<Image fill src={value} alt="Uploaded file" className='rounded-full'/>
	// 		</div>);
	// 	}
	// 	if (value && fileType === "pdf") {
	// 		return (<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
	// 			<FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
	// 			<a
	// 				href={value}
	// 				target="_blank"
	// 				rel="noopener noreferrer"
	// 				className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
	// 			>
	// 				PDF File
	// 			</a>
	// 		</div>)
	// 	}
	// }
	if (value && fileType !== 'pdf') {
		return (<div className='flex items-center justify-center h-40 w-40 relative'>
			<Image fill src={value} alt="Uploaded file" className='rounded-full'/>
			<button type='button' onClick={() => onChange("")}
			        className='bg-rose-500 text-white p-1 rounded-full shadow-sm absolute top-0 right-0'>
				<X className='h-4 w-4'/>
			</button>

		</div>);
	}
	if (value && fileType === "pdf") {
		return (<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
			<FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
			<a
				href={value}
				target="_blank"
				rel="noopener noreferrer"
				className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
			>
				{fileName}
			</a>
			<button
				onClick={() => onChange("")}
				className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
				type="button"
			>
				<X className="h-4 w-4"/>
			</button>
		</div>)
	}

	return (<UploadDropzone
		endpoint={endpoint}
		onClientUploadComplete={(res) => {
			onChange(res?.[0].url);
			setFileName(res?.[0].name);
		}}
		onUploadError={(err) => {
			console.error(err);
		}}
	/>);
}