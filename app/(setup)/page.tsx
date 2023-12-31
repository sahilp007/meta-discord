import React from 'react';
import {initialProfile} from "@/lib/initial-profile";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import {UserButton} from "@clerk/nextjs";
import {InitialModal} from "@/components/modals/initial-modal";
import {ModeToggle} from "@/components/providers/ThemeToggle";


const SetupPage = async () => {
	const profile = await initialProfile();
	const server = await db.server.findFirst({
		where: {
			members: {
				some: {
					profileId: profile.id
				}
			}
		}
	});
	if (server) {
		return (
			redirect(`/servers/${server.id}`)
		);
	}
	return (
		<div>
			<InitialModal/>
			<UserButton/>
			<ModeToggle/>
		</div>
	);
}

export default SetupPage;