// This is your entry file! Refer to it when you render:
// npx remotion render <entry-file> HelloWorld out/video.mp4

import { registerRoot } from 'remotion';
import { RemotionRoot } from './root';

import './_styles/fonts.css';
import './_styles/reset.css';

registerRoot(RemotionRoot);
