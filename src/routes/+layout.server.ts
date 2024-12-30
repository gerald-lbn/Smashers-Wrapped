export const load = ({ url }) => {
	const canonicalUrl = url.origin;

	return {
		canonicalUrl
	};
};
