import React from 'react';
import {currentProfile} from "@/lib/current-profile";
import {redirectToSignIn} from "@clerk/nextjs";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import {getOrCreateConversation} from "@/lib/conversations";
import {ChatHeader} from "@/components/chat/chat-header";

interface MemberIdPageProps {
	params: {
		serverId: string; memberId: string;
	}

}

const MemberIdPage = async ({params}: MemberIdPageProps) => {

	const profile = await currentProfile();
	if (!profile) return redirectToSignIn();

	const currentMember = await db.member.findFirst({
		where: {
			serverId: params.serverId, profileId: profile.id
		}, include: {
			profile: true
		}
	});

	if (!currentMember) return redirect('/');

	const conversation = await getOrCreateConversation(currentMember.id, params.memberId);
	if (!conversation) return redirect(`/servers/${params.serverId}`);

	const {memberOne, memberTwo} = conversation;
	const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

	return (<div className='bg-[#fff7ed] dark:bg-[#393934] flex flex-col h-full'>
		<ChatHeader serverId={params.serverId} name={otherMember.profile.name} type={'conversation'}
		            imageUrl={otherMember.profile.imageUrl}/>
	</div>);
};

export default MemberIdPage;