package com.shelf.backend.security;

import com.shelf.backend.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

/**
 * Signs and verifies the JWT stored in our own session cookie. This is
 * separate from Google's ID token: once we've verified who the user is via
 * Google, we mint our own short-lived credential so the browser never has
 * to send Google's token back to us on every request.
 */
@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);
    private static final Duration SESSION_TTL = Duration.ofHours(12);

    private final SecretKey key;

    public JwtService(@Value("${app.jwt-secret:}") String configuredSecret) {
        if (configuredSecret == null || configuredSecret.isBlank()) {
            log.warn(
                    "app.jwt-secret is not set - generating a random signing key for this run only. " +
                            "Every restart will invalidate all existing sessions. Set the JWT_SECRET environment " +
                            "variable (32+ random bytes, base64-encoded) before running this anywhere but your laptop.");
            this.key = Jwts.SIG.HS256.key().build();
        } else {
            this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(configuredSecret));
        }
    }

    public String issue(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getId())
                .claim("email", user.getEmail())
                .claim("name", user.getName())
                .claim("picture", user.getPictureUrl())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(SESSION_TTL)))
                .signWith(key)
                .compact();
    }

    /** Returns the token's claims, or null if the token is missing, malformed, expired, or forged. */
    public Claims verify(String token) {
        try {
            return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }
}
