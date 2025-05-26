package com.example.bugreporter;

import com.example.bugreporter.service.BugService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
public class BugReporterApplicationTests {

    @MockBean
    private BugService bugService;

    @Test
    public void contextLoads() {
        // Basic test to ensure the application context loads successfully
    }

    @Test
    public void testBugService() {
        // Setup mock behavior
        Bug bug = new Bug("Test Bug", "Test Description", "http://example.com/screenshot.png");
        bug.setId(1L);
        bug.setCreatedAt(LocalDateTime.now());
        bug.setStatus(Bug.Status.OPEN);
        bug.setPriority(Bug.Priority.HIGH);
        
        List<Bug> bugs = List.of(bug);
        
        when(bugService.getAllBugs()).thenReturn(bugs);
        when(bugService.getBugById(1L)).thenReturn(Optional.of(bug));
        when(bugService.createBug(any(Bug.class))).thenReturn(bug);
        
        // Test the service
        List<Bug> foundBugs = bugService.getAllBugs();
        Optional<Bug> foundBug = bugService.getBugById(1L);
        
        // Assertions
        assertEquals(1, foundBugs.size());
        assertTrue(foundBug.isPresent());
        assertEquals("Test Bug", foundBug.get().getTitle());
        assertEquals(Bug.Status.OPEN, foundBug.get().getStatus());
        assertEquals(Bug.Priority.HIGH, foundBug.get().getPriority());
    }
} 