package com.shelf.backend.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.shelf.backend.model.User;
import com.shelf.backend.security.JwtCookieAuthFilter;
import com.shelf.backend.security.JwtService;
import com.shelf.backend.service.GoogleTokenVerifier;
import com.shelf.backend.service.UserStore;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final GoogleTokenVerifier googleTokenVerifier;
    private final UserStore userStore;
    private final JwtService jwtService;
    private final boolean secureCookies;

    public AuthController(
            GoogleTokenVerifier googleTokenVerifier,
            UserStore userStore,
            JwtService jwtService,
            @Value("${app.secure-cookies}") boolean secureCookies) {
        this.googleTokenVerifier = googleTokenVerifier;
        this.userStore = userStore;
        this.jwtService = jwtService;
        this.secureCookies = secureCookies;
    }

    @PostMapping("/google")
    public ResponseEntity<User> loginWithGoogle(
            @RequestBody GoogleLoginRequest request, HttpServletResponse response) {
        GoogleIdToken.Payload payload = googleTokenVerifier.verify(request.credential());
        if (payload == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String name = (String) payload.get("name");
        String picture = (String) payload.get("picture");
        User user = userStore.upsertFromGoogle(payload.getSubject(), name, payload.getEmail(), picture);

        setSessionCookie(response, jwtService.issue(user));
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(Authentication authentication) {
        User user = userStore.findById((String) authentication.getPrincipal());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        clearSessionCookie(response);
        return ResponseEntity.noContent().build();
    }

    private void setSessionCookie(HttpServletResponse response, String jwt) {
        ResponseCookie cookie = ResponseCookie.from(JwtCookieAuthFilter.SESSION_COOKIE_NAME, jwt)
                .httpOnly(true)
                .secure(secureCookies)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofHours(12))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearSessionCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(JwtCookieAuthFilter.SESSION_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(secureCookies)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleNotConfigured(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
    }

    public record GoogleLoginRequest(String credential) {}
}
