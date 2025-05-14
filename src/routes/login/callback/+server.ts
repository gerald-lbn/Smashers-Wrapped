import { STARTGG_CLIENT_ID, STARTGG_CLIENT_SECRET } from '$env/static/private';
import { Startgg, type OAuth2Token } from '$lib/start.gg/oauth2';

export const GET = async ({ url }) => {
	const code = url.searchParams.get('code');

	if (!code)
		return new Response('Missing code', {
			status: 400
		});

	const client = new Startgg(
		STARTGG_CLIENT_ID,
		STARTGG_CLIENT_SECRET,
		`${url.origin}/login/callback`
	);

	let token: OAuth2Token;
	try {
		token = await client.validateAuthorizationCode(code, ['user.email', 'user.identity']);
	} catch (e) {
		return new Response(null, { status: 400, statusText: String(e) });
	}

	return new Response(JSON.stringify(token), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
