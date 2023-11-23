import { MICROCMS_APIKEY, MICROCMS_DOMAIN } from '$env/static/private';
import { createClient } from 'microcms-js-sdk';

export const cliet = createClient({
	serviceDomain: MICROCMS_DOMAIN,
	apiKey: MICROCMS_APIKEY
});
