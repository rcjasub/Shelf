package com.shelf.backend.service;

import com.shelf.backend.model.User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory user store. Swap for a real repository backed by a database
 * before this goes anywhere near production — accounts here don't survive
 * a restart.
 */
@Service
public class UserStore {

    private final Map<String, User> usersById = new ConcurrentHashMap<>();

    public User upsertFromGoogle(String googleSubjectId, String name, String email, String pictureUrl) {
        return usersById.compute(googleSubjectId, (id, existing) -> {
            User user = existing != null ? existing : new User();
            user.setId(id);
            user.setName(name);
            user.setEmail(email);
            user.setPictureUrl(pictureUrl);
            return user;
        });
    }

    public User findById(String id) {
        return usersById.get(id);
    }
}
