import { STARTGG_CLIENT_ID, STARTGG_CLIENT_SECRET } from '$env/static/private';
import { Startgg } from '$lib/start.gg/oauth2';

export const GET = async ({ url }) => {
	const startgg = new Startgg(
		STARTGG_CLIENT_ID,
		STARTGG_CLIENT_SECRET,
		`${url.origin}/login/callback`
	);

	const authorizationUrl = startgg.createAuthorizationURL(['user.email', 'user.identity']);

	console.log('Authorization URL:', authorizationUrl.toString());

	return new Response(null, {
		status: 302,
		headers: {
			Location: authorizationUrl.toString()
		}
	});
};
