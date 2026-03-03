"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
    // Replace with your actual Google Client ID from environment variables
    // For now, using a placeholder, user will need to set this in .env
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
}
