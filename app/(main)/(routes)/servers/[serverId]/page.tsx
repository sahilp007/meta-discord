import {currentProfile} from "@/lib/current-profile";
import {redirect} from "next/navigation";
import {redirectToSignIn} from "@clerk/nextjs";
import {db} from "@/lib/db";
import React from "react";
import {ChatHeader} from "@/components/chat/chat-header";

interface ServerIdPageProps {
	params: {
		serverId: string;
	}
}

const ServerIdPage = async ({params}: ServerIdPageProps) => {

	const profile = await currentProfile();
	if (!profile) return redirectToSignIn;

	const server = await db.server.findUnique({
		where: {
			id: params.serverId,
			members: {
				some: {
					profileId: profile.id
				}
			}
		},
		include: {
			channels: {
				where: {
					name: 'general'
				},
				orderBy: {
					createdAt: 'asc'
				},
			}
		}
	})
	const initialChannel = server?.channels[0];
	if (initialChannel?.name !== 'general')
		return (
			<div className='h-full flex flex-col '>
				<div className='bg-[#fff7ed] dark:bg-[#393934] flex flex-col '>
					<ChatHeader
						name='MD'
						type='channel'
						serverId={params.serverId}
					/>
				</div>
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100%',
				}}>

					<iframe src="https://sahilp007.github.io/Letter-Animationss/" style={{
						display: 'flex',
						flexDirection: 'column',
						height: '100%',
						textAlign: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						fontSize: '1.5em',
						width: '100%'
					}}></iframe>

				</div>
			</div>
		)

	return (
		<div className='h-full flex flex-col '>

				<div className='bg-[#fff7ed] dark:bg-[#393934] flex flex-col'>
					<ChatHeader
						name='MD'
						type='channel'
						serverId={params.serverId}
					/>
				</div>
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100%',
				}}>

					<iframe src="https://sahilp007.github.io/Letter-Animationss/" style={{
						display: 'flex',
						flexDirection: 'column',
						height: '100%',
						textAlign: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						fontSize: '1.5em',
						width: '100%'
					}}></iframe>

				</div>
		</div>
	);
}

export default ServerIdPage;