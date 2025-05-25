package com.example.bugreporter;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class BugTest {

    @Test
    public void testBugCreation() {
        // Given
        String title = "Test Bug";
        String description = "This is a test bug";
        String screenshotUrl = "http://example.com/screenshot.png";
        
        // When
        Bug bug = new Bug(title, description, screenshotUrl);
        
        // Then
        assertNotNull(bug);
        assertEquals(title, bug.getTitle());
        assertEquals(description, bug.getDescription());
        assertEquals(screenshotUrl, bug.getScreenshotUrl());
        assertEquals(Bug.Status.OPEN, bug.getStatus());
        assertNotNull(bug.getCreatedAt());
    }
    
    @Test
    public void testBugStatusUpdate() {
        // Given
        Bug bug = new Bug("Test Bug", "Description", null);
        
        // When
        bug.setStatus(Bug.Status.IN_PROGRESS);
        
        // Then
        assertEquals(Bug.Status.IN_PROGRESS, bug.getStatus());
        
        // When
        bug.setStatus(Bug.Status.CLOSED);
        
        // Then
        assertEquals(Bug.Status.CLOSED, bug.getStatus());
    }
    
    @Test
    public void testDefaultConstructor() {
        // When
        Bug bug = new Bug();
        LocalDateTime before = LocalDateTime.now();
        
        // Then
        assertNotNull(bug);
        assertNotNull(bug.getCreatedAt());
        assertNull(bug.getTitle());
        assertNull(bug.getDescription());
        assertNull(bug.getScreenshotUrl());
        assertEquals(Bug.Status.OPEN, bug.getStatus());
        
        // Check that createdAt is recent
        assertFalse(bug.getCreatedAt().isAfter(LocalDateTime.now()));
        assertFalse(bug.getCreatedAt().isBefore(before.minusSeconds(1)));
    }
} 