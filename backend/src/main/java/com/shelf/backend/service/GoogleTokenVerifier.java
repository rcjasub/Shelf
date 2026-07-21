package com.shelf.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

/**
 * Verifies Google Identity Services ID tokens server-side. Never trust an ID
 * token that hasn't been through this: the signature check is what proves
 * the token actually came from Google and wasn't forged or replayed for a
 * different app (the audience check pins it to our client ID).
 */
@Service
public class GoogleTokenVerifier {

    private final String googleClientId;
    private volatile GoogleIdTokenVerifier verifier;

    public GoogleTokenVerifier(@Value("${google.client-id}") String googleClientId) {
        this.googleClientId = googleClientId;
    }

    /**
     * Returns the verified token payload, or null if the token is invalid,
     * expired, or was issued for a different client.
     *
     * @throws IllegalStateException if google.client-id hasn't been configured yet
     */
    public GoogleIdToken.Payload verify(String idTokenString) {
        try {
            GoogleIdToken idToken = getVerifier().verify(idTokenString);
            return idToken != null ? idToken.getPayload() : null;
        } catch (GeneralSecurityException | IOException | IllegalArgumentException e) {
            return null;
        }
    }

    private GoogleIdTokenVerifier getVerifier() {
        if (verifier == null) {
            if (googleClientId == null || googleClientId.isBlank()) {
                throw new IllegalStateException(
                        "google.client-id is not set. Set the GOOGLE_CLIENT_ID environment variable to your " +
                                "Google OAuth Client ID (Google Cloud Console > APIs & Services > Credentials).");
            }
            verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();
        }
        return verifier;
    }
}
