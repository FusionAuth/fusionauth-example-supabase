import NextAuth from 'next-auth';
import FusionAuthProvider from 'next-auth/providers/fusionauth';
import FusionAuthClient from '@/utils/fusionauth';

export const authOptions = {
    providers: [
        FusionAuthProvider({
            issuer: process.env.FUSIONAUTH_ISSUER,
            clientId: process.env.FUSIONAUTH_CLIENT_ID,
            clientSecret: process.env.FUSIONAUTH_CLIENT_SECRET,
            wellKnown: `${process.env.FUSIONAUTH_URL}/.well-known/openid-configuration/${process.env.FUSIONAUTH_TENANT_ID}`,
            tenantId: process.env.FUSIONAUTH_TENANT_ID, // Only required if you're using multi-tenancy
        }),
    ],
    callbacks: {
        async jwt({ token }) {
            if (!token.accessToken) {
                /**
                 * Creating a new JWT for Supabase and using their claims as base
                 * @link https://supabase.com/docs/learn/auth-deep-dive/auth-deep-dive-jwts
                 * @link https://supabase.com/docs/learn/auth-deep-dive/auth-policies
                 * @type {FusionAuthClient.JWTVendResponse}
                 */
                try {
                    const vending = await FusionAuthClient.vendJWT({
                        claims: {
                            // You can change this to your app name
                            iss: 'My Supabase application',
                            // The sub claim is usually what we use to match the JWT to rows in your database
                            sub: token.sub,
                            // The authenticated role is special in Supabase, it tells the API that this is an authenticated user
                            // and will know to compare the JWT against any policies you've added to the requested resource (table or row).
                            aud: 'authenticated',
                        },
                        keyId: process.env.FUSIONAUTH_JWT_KEY_ID,
                        timeToLiveInSeconds: 3600, // 1 hour
                    });
                    token.accessToken = vending.response.token;
                } catch (err) {
                    console.error('Error issuing JWT', err);
                }
            }
            return token;
        },
        async session({ session, token }) {
            // Grabbing the Access Token we generated in the callback above
            session.accessToken = token.accessToken;

            return session;
        },
    },
}

export default NextAuth(authOptions)
