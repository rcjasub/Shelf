package com.shelf.backend.model;

public class Friend {

    private Long id;
    private String name;
    private String handle;
    private String bio;
    private int booksRead;
    private int sharedBooks;

    public Friend() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHandle() {
        return handle;
    }

    public void setHandle(String handle) {
        this.handle = handle;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public int getBooksRead() {
        return booksRead;
    }

    public void setBooksRead(int booksRead) {
        this.booksRead = booksRead;
    }

    public int getSharedBooks() {
        return sharedBooks;
    }

    public void setSharedBooks(int sharedBooks) {
        this.sharedBooks = sharedBooks;
    }
}
