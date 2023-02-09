import NextAuth from "next-auth"
import FusionAuthProvider from "next-auth/providers/fusionauth"

export const authOptions = {
    providers: [
        FusionAuthProvider({
            issuer: process.env.FUSIONAUTH_ISSUER,
            clientId: process.env.FUSIONAUTH_CLIENT_ID,
            clientSecret: process.env.FUSIONAUTH_CLIENT_SECRET,
            wellKnown: `${process.env.FUSIONAUTH_URL}/.well-known/openid-configuration`,
            tenantId: process.env.FUSIONAUTH_TENANT_ID, // Only required if you're using multi-tenancy
        }),
    ],
}

export default NextAuth(authOptions)
