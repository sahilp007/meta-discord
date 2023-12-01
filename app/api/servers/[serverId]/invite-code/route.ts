import {currentProfile} from "@/lib/current-profile";
import {v4 as uuidV4} from 'uuid';
import {db} from "@/lib/db";

export async function PATCH(
	req: Request,
	{params}: {params: {serverId: string}}
){
	try{
		const profile = await currentProfile();

		if(!profile){
			return new Response('Unauthorized', {status: 401});
		}
		if(!params.serverId){
			return new Response('Server ID Missing', {status: 400});
		}
		const server = await db.server.update({
			where: {
				id: params.serverId,
				profileId: profile.id,
			},
			data: {
				inviteCode: uuidV4()
			}
		})
		return new Response(JSON.stringify(server), {status: 200});
	}
	catch (e){
		console.log('[SERVER_ID]', e);
		return new Response('Internal Error', {status: 500});
	}
}
