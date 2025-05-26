package com.example.bugreporter;

import com.example.bugreporter.service.BugService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bugs")
@CrossOrigin // Use CORS configuration from application properties
public class BugController {
    
    private final BugService bugService;
    
    @Autowired
    public BugController(BugService bugService) {
        this.bugService = bugService;
    }
    
    @GetMapping
    public List<Bug> getAllBugs() {
        return bugService.getAllBugs();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Bug> getBugById(@PathVariable Long id) {
        return bugService.getBugById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Bug createBug(@RequestBody CreateBugRequest request) {
        Bug bug = new Bug(request.getTitle(), request.getDescription(), request.getScreenshotUrl());
        
        if (request.getPriority() != null) {
            bug.setPriority(request.getPriority());
        }
        
        // Handle custom metadata fields
        if (request.getMetadata() != null && !request.getMetadata().isEmpty()) {
            for (Map.Entry<String, String> entry : request.getMetadata().entrySet()) {
                bug.addMetadata(entry.getKey(), entry.getValue());
            }
        }
        
        return bugService.createBug(bug);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Bug> updateBugStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        Bug bugUpdate = new Bug();
        bugUpdate.setStatus(request.getStatus());
        
        return bugService.updateBug(id, bugUpdate)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/priority")
    public ResponseEntity<Bug> updateBugPriority(@PathVariable Long id, @RequestBody UpdatePriorityRequest request) {
        Bug bugUpdate = new Bug();
        bugUpdate.setPriority(request.getPriority());
        
        return bugService.updateBug(id, bugUpdate)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/metadata")
    public ResponseEntity<Bug> updateBugMetadata(@PathVariable Long id, @RequestBody Map<String, String> metadata) {
        return bugService.getBugById(id)
                .map(bug -> {
                    // Update metadata
                    for (Map.Entry<String, String> entry : metadata.entrySet()) {
                        bug.addMetadata(entry.getKey(), entry.getValue());
                    }
                    return ResponseEntity.ok(bugService.createBug(bug));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBug(@PathVariable Long id) {
        if (bugService.deleteBug(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // Request DTOs
    public static class CreateBugRequest {
        private String title;
        private String description;
        private String screenshotUrl;
        private Bug.Priority priority;
        private Map<String, String> metadata;
        
        // Getters and Setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getScreenshotUrl() { return screenshotUrl; }
        public void setScreenshotUrl(String screenshotUrl) { this.screenshotUrl = screenshotUrl; }
        
        public Bug.Priority getPriority() { return priority; }
        public void setPriority(Bug.Priority priority) { this.priority = priority; }
        
        public Map<String, String> getMetadata() { return metadata; }
        public void setMetadata(Map<String, String> metadata) { this.metadata = metadata; }
    }
    
    public static class UpdateStatusRequest {
        private Bug.Status status;
        
        public Bug.Status getStatus() { return status; }
        public void setStatus(Bug.Status status) { this.status = status; }
    }
    
    public static class UpdatePriorityRequest {
        private Bug.Priority priority;
        
        public Bug.Priority getPriority() { return priority; }
        public void setPriority(Bug.Priority priority) { this.priority = priority; }
    }
}