import NextAuth from 'next-auth';
import FusionAuthProvider from 'next-auth/providers/fusionauth';
import {SignJWT} from 'jose';

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
                 * @type {string}
                 */
                token.accessToken = await new SignJWT({})
                  .setProtectedHeader({alg: 'HS256'})
                  .setIssuedAt()
                  // You can change this to your app name
                  .setIssuer('My Supabase application')
                  // The sub claim is usually what we use to match the JWT to rows in your database
                  .setSubject(token.sub)
                  // The authenticated role is special in Supabase, it tells the API that this is an authenticated user
                  // and will know to compare the JWT against any policies you've added to the requested resource (table or row).
                  .setAudience('authenticated')
                  .setExpirationTime('1h')
                  .sign(
                    Buffer.from(process.env.SUPABASE_SIGNING_SECRET, 'utf8')
                  );
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
