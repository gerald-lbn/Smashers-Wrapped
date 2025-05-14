import { STARTGG_CLIENT_ID, STARTGG_CLIENT_SECRET } from '$env/static/private';
import { Startgg, type OAuth2Token } from '$lib/start.gg/oauth2';
import authenticatedPlayerIdSchema from '$lib/validations/authenticatedPlayerId.js';
import { json, redirect } from '@sveltejs/kit';

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
	const userResponse = await client.getUser(tokens.access_token);
	const safeUserResponse = authenticatedPlayerIdSchema.safeParse(userResponse);

	// Check if the response is valid
	if (!safeUserResponse.success) {
		return json(
			{
				error: 'Invalid user response',
				details: safeUserResponse.error.flatten(),
				response: userResponse
			},
			{
				status: 500
			}
		);
	}

	// Redirect to the player page
	const playerId = safeUserResponse.data.data.currentUser.player.id;
	return redirect(302, `/player/${playerId}`);
};
