package com.shelf.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;

// Auth is handled entirely by our own Google-token-verification + JWT-cookie filter (see
// com.shelf.backend.security), not Spring Security's UserDetailsService/form-login model, so
// that piece of autoconfiguration is excluded rather than left generating an unused default user.
@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
