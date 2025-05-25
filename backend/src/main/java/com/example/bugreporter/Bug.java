package com.example.bugreporter;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bugs")
public class Bug {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    private String screenshotUrl;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Enumerated(EnumType.STRING)
    private Status status = Status.OPEN;
    
    public enum Status {
        OPEN, IN_PROGRESS, CLOSED
    }
    
    // Default constructor
    public Bug() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Constructor
    public Bug(String title, String description, String screenshotUrl) {
        this();
        this.title = title;
        this.description = description;
        this.screenshotUrl = screenshotUrl;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getScreenshotUrl() { return screenshotUrl; }
    public void setScreenshotUrl(String screenshotUrl) { this.screenshotUrl = screenshotUrl; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}