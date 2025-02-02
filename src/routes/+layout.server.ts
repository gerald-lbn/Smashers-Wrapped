import { getUserAgentInfo } from '$lib/helpers/userAgent';

export const load = ({ url, request }) => {
	const canonicalUrl = url.origin;
	const userAgent = request.headers.get('user-agent');
	const userAgentInfo = getUserAgentInfo(userAgent);

	return {
		canonicalUrl,
		userAgentInfo
	};
};
