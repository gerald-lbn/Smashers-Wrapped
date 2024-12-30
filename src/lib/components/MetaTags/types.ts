export interface IMetaTags {
	icon: string;
	title: string;
	description: string;
	keywords: string[];
	author: string;
	themeColor: string;
	twitter: Partial<ITwitterMetaTags>;
	openGraph: Partial<IOpenGraphMetaTags>;
}

export interface ITwitterMetaTags {
	site: string;
	title: string;
	description: string;
	image: {
		src: string;
		alt: string;
	};
	creator: string;
}

export interface IOpenGraphMetaTags {
	title: string;
	description: string;
	siteName: string;
	locale: string;
	type: 'website';
	url: string;
	image: {
		src: string;
		alt: string;
	};
}
