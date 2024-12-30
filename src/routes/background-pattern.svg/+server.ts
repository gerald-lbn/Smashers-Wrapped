import { read } from '$app/server';
import backgroundPattern from './background-pattern.svg';

export const GET = ({ setHeaders }) => {
	const file = read(backgroundPattern);

	const cacheControlMaxAge = 24 * 60 * 60 * 365; // 1 year
	setHeaders({
		'Content-Type': 'image/svg+xml',
		'Cache-Control': `public, max-age=${cacheControlMaxAge}, immutable`
	});

	return new Response(file.body);
};
