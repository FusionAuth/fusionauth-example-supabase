import FusionAuthClient from '@fusionauth/typescript-client';

const client = new FusionAuthClient(process.env.FUSIONAUTH_API_KEY, process.env.FUSIONAUTH_URL);
export default client;
