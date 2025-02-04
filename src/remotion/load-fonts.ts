import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const loadFontRodinPro = async () => {
	// FOT Rodin Pro UB
	loadFont({
		family: 'FOT Rodin Pro UB',
		url: staticFile('fonts/FOT-Rodin Pro UB.otf'),
		weight: '900'
	})
		.then(() => {
			console.log('FOT Rodin Pro UB loaded');
		})
		.catch((err) => {
			console.error('Failed to load FOT Rodin Pro UB', err);
		});
};
