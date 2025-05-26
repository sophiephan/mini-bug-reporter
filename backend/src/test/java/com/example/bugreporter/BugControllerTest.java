package com.example.bugreporter;

import com.example.bugreporter.service.BugService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BugController.class)
public class BugControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BugService bugService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetAllBugs() throws Exception {
        // Given
        Bug bug1 = new Bug("Bug 1", "Description 1", null);
        Bug bug2 = new Bug("Bug 2", "Description 2", "screenshot.png");
        List<Bug> bugs = Arrays.asList(bug1, bug2);
        
        when(bugService.getAllBugs()).thenReturn(bugs);
        
        // When & Then
        mockMvc.perform(get("/api/bugs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", is("Bug 1")))
                .andExpect(jsonPath("$[1].title", is("Bug 2")))
                .andExpect(jsonPath("$[1].screenshotUrl", is("screenshot.png")));
                
        verify(bugService, times(1)).getAllBugs();
    }
    
    @Test
    public void testGetBugById() throws Exception {
        // Given
        Bug bug = new Bug("Test Bug", "Description", null);
        bug.setId(1L);
        
        when(bugService.getBugById(1L)).thenReturn(Optional.of(bug));
        when(bugService.getBugById(2L)).thenReturn(Optional.empty());
        
        // When & Then - Existing bug
        mockMvc.perform(get("/api/bugs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Test Bug")))
                .andExpect(jsonPath("$.id", is(1)));
                
        // When & Then - Non-existing bug
        mockMvc.perform(get("/api/bugs/2"))
                .andExpect(status().isNotFound());
                
        verify(bugService, times(1)).getBugById(1L);
        verify(bugService, times(1)).getBugById(2L);
    }
    
    @Test
    public void testCreateBug() throws Exception {
        // Given
        BugController.CreateBugRequest request = new BugController.CreateBugRequest();
        request.setTitle("New Bug");
        request.setDescription("New Description");
        request.setScreenshotUrl("new-screenshot.png");
        
        Bug savedBug = new Bug("New Bug", "New Description", "new-screenshot.png");
        savedBug.setId(1L);
        
        when(bugService.createBug(any(Bug.class))).thenReturn(savedBug);
        
        // When & Then
        mockMvc.perform(post("/api/bugs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("New Bug")))
                .andExpect(jsonPath("$.id", is(1)));
                
        verify(bugService, times(1)).createBug(any(Bug.class));
    }
    
    @Test
    public void testUpdateBugStatus() throws Exception {
        // Given
        Bug updatedBug = new Bug("Test Bug", "Description", null);
        updatedBug.setId(1L);
        updatedBug.setStatus(Bug.Status.IN_PROGRESS);
        
        BugController.UpdateStatusRequest request = new BugController.UpdateStatusRequest();
        request.setStatus(Bug.Status.IN_PROGRESS);
        
        when(bugService.updateBug(eq(1L), any(Bug.class))).thenReturn(Optional.of(updatedBug));
        when(bugService.updateBug(eq(2L), any(Bug.class))).thenReturn(Optional.empty());
        
        // When & Then - Existing bug
        mockMvc.perform(put("/api/bugs/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("IN_PROGRESS")));
                
        // When & Then - Non-existing bug
        mockMvc.perform(put("/api/bugs/2/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
                
        verify(bugService, times(1)).updateBug(eq(1L), any(Bug.class));
        verify(bugService, times(1)).updateBug(eq(2L), any(Bug.class));
    }
    
    @Test
    public void testDeleteBug() throws Exception {
        // Given
        when(bugService.deleteBug(1L)).thenReturn(true);
        when(bugService.deleteBug(2L)).thenReturn(false);
        
        // When & Then - Existing bug
        mockMvc.perform(delete("/api/bugs/1"))
                .andExpect(status().isOk());
                
        // When & Then - Non-existing bug
        mockMvc.perform(delete("/api/bugs/2"))
                .andExpect(status().isNotFound());
                
        verify(bugService, times(1)).deleteBug(1L);
        verify(bugService, times(1)).deleteBug(2L);
    }
} 