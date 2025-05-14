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

	let tokens: OAuth2Token;
	try {
		tokens = await client.validateAuthorizationCode(code, ['user.email', 'user.identity']);
	} catch (e) {
		return new Response(null, { status: 400, statusText: String(e) });
	}

	// Get the user id
	const user = await client.getUser(tokens.access_token);

	return new Response(JSON.stringify(user), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
