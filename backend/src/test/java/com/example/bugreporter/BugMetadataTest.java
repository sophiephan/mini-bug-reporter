package com.example.bugreporter;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class BugMetadataTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BugRepository bugRepository;

    @Test
    public void testCreateBugWithMetadata() throws Exception {
        // Create a bug with metadata
        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("title", "Test Bug with Metadata");
        requestBody.put("description", "This is a test bug with metadata");
        requestBody.put("priority", Bug.Priority.HIGH.name());
        
        // Add metadata
        ObjectNode metadata = requestBody.putObject("metadata");
        metadata.put("reportedBy", "test@example.com");
        metadata.put("sourcePage", "/dashboard");
        metadata.put("appVersion", "1.2.3");
        
        // Post the bug
        MvcResult result = mockMvc.perform(post("/api/bugs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Bug with Metadata"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andReturn();
        
        // Extract the bug ID from the response
        String response = result.getResponse().getContentAsString();
        Bug createdBug = objectMapper.readValue(response, Bug.class);
        Long bugId = createdBug.getId();
        
        // Retrieve the bug from the database
        Bug savedBug = bugRepository.findById(bugId).orElseThrow();
        
        // Verify metadata was saved
        assertNotNull(savedBug.getMetadata());
        assertEquals("test@example.com", savedBug.getMetadata().get("reportedBy"));
        assertEquals("/dashboard", savedBug.getMetadata().get("sourcePage"));
        assertEquals("1.2.3", savedBug.getMetadata().get("appVersion"));
    }

    @Test
    public void testUpdateBugMetadata() throws Exception {
        // Create a bug first
        Bug bug = new Bug("Test Bug", "Description", null);
        bug.setPriority(Bug.Priority.MEDIUM);
        bug.addMetadata("initialKey", "initialValue");
        Bug savedBug = bugRepository.save(bug);
        
        // Update the metadata
        ObjectNode metadata = objectMapper.createObjectNode();
        metadata.put("updatedKey", "updatedValue");
        
        mockMvc.perform(put("/api/bugs/" + savedBug.getId() + "/metadata")
                .contentType(MediaType.APPLICATION_JSON)
                .content(metadata.toString()))
                .andExpect(status().isOk());
        
        // Retrieve the updated bug
        Bug updatedBug = bugRepository.findById(savedBug.getId()).orElseThrow();
        
        // Verify metadata was updated
        assertEquals("initialValue", updatedBug.getMetadata().get("initialKey"));
        assertEquals("updatedValue", updatedBug.getMetadata().get("updatedKey"));
    }
} 