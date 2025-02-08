import { Redis } from '@upstash/redis';
import { KV_REST_API_URL, KV_REST_API_TOKEN } from '$env/static/private';

const redis = new Redis({
	url: KV_REST_API_URL,
	token: KV_REST_API_TOKEN
});

export default redis;
