import { dev } from '$app/environment';
import {
	STARTGG_CLIENT_ID,
	STARTGG_CLIENT_REDIRECT_URI,
	STARTGG_CLIENT_SECRET
} from '$env/static/private';
import { Startgg } from '$lib/server/oauth/providers/startgg';

export async function GET({ url }) {
	// TODO: Because of the reverse proxy in development
	const origin = dev ? url.origin.replace('http', 'https') : url.origin;

	const startgg = new Startgg(
		STARTGG_CLIENT_ID,
		STARTGG_CLIENT_SECRET,
		origin + STARTGG_CLIENT_REDIRECT_URI
	);

	const authorizationUrl = startgg.createAuthorizationURL(['user.email', 'user.identity']);

	return new Response(null, {
		status: 302,
		headers: {
			Location: authorizationUrl.toString()
		}
	});
}
