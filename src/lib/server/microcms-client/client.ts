import { MICROCMS_APIKEY, MICROCMS_DOMAIN } from '$env/static/private';
import { createClient } from 'microcms-js-sdk';

export const client = createClient({
	serviceDomain: MICROCMS_DOMAIN,
	apiKey: MICROCMS_APIKEY
});
