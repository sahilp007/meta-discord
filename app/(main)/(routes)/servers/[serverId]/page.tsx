import {currentProfile} from "@/lib/current-profile";
import {redirect} from "next/navigation";
import {redirectToSignIn} from "@clerk/nextjs";
import {db} from "@/lib/db";
import React from "react";

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
			<>
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					// margin: 'auto',
					height: '100vh',
				}}>

					<iframe src="https://sahilp007.github.io/Letter-Animations/index.html" style={{
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
			</>
		)

	return (
		<div>
			<>
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					// margin: 'auto',
					height: '100vh',
				}}>

					<iframe src="https://sahilp007.github.io/Letter-Animations/index.html" style={{
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
			</>
		</div>
	);
}

export default ServerIdPage;