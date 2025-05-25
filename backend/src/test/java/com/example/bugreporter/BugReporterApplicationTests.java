package com.example.bugreporter;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class BugReporterApplicationTests {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private BugRepository bugRepository;

    @Test
    public void contextLoads() {
        // Basic test to ensure the application context loads successfully
    }

    @Test
    public void testFullBugLifecycle() {
        // Clear any existing data
        bugRepository.deleteAll();

        // Create a bug
        BugController.CreateBugRequest createRequest = new BugController.CreateBugRequest();
        createRequest.setTitle("Integration Test Bug");
        createRequest.setDescription("This is an integration test");
        createRequest.setScreenshotUrl("http://example.com/screenshot.png");

        ResponseEntity<Bug> createResponse = restTemplate.postForEntity(
                "http://localhost:" + port + "/api/bugs",
                createRequest,
                Bug.class
        );

        assertEquals(HttpStatus.OK, createResponse.getStatusCode());
        assertNotNull(createResponse.getBody());
        assertNotNull(createResponse.getBody().getId());
        assertEquals("Integration Test Bug", createResponse.getBody().getTitle());
        assertEquals(Bug.Status.OPEN, createResponse.getBody().getStatus());

        Long bugId = createResponse.getBody().getId();

        // Get all bugs
        ResponseEntity<Bug[]> getAllResponse = restTemplate.getForEntity(
                "http://localhost:" + port + "/api/bugs",
                Bug[].class
        );

        assertEquals(HttpStatus.OK, getAllResponse.getStatusCode());
        assertEquals(1, getAllResponse.getBody().length);

        // Get bug by ID
        ResponseEntity<Bug> getByIdResponse = restTemplate.getForEntity(
                "http://localhost:" + port + "/api/bugs/" + bugId,
                Bug.class
        );

        assertEquals(HttpStatus.OK, getByIdResponse.getStatusCode());
        assertEquals("Integration Test Bug", getByIdResponse.getBody().getTitle());

        // Update bug status
        BugController.UpdateStatusRequest updateRequest = new BugController.UpdateStatusRequest();
        updateRequest.setStatus(Bug.Status.IN_PROGRESS);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<BugController.UpdateStatusRequest> requestEntity = new HttpEntity<>(updateRequest, headers);

        ResponseEntity<Bug> updateResponse = restTemplate.exchange(
                "http://localhost:" + port + "/api/bugs/" + bugId + "/status",
                HttpMethod.PUT,
                requestEntity,
                Bug.class
        );

        assertEquals(HttpStatus.OK, updateResponse.getStatusCode());
        assertEquals(Bug.Status.IN_PROGRESS, updateResponse.getBody().getStatus());

        // Delete the bug
        restTemplate.delete("http://localhost:" + port + "/api/bugs/" + bugId);

        // Verify it's gone
        ResponseEntity<Bug> getDeletedResponse = restTemplate.getForEntity(
                "http://localhost:" + port + "/api/bugs/" + bugId,
                Bug.class
        );

        assertEquals(HttpStatus.NOT_FOUND, getDeletedResponse.getStatusCode());
    }
} 