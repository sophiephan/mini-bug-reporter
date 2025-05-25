package com.example.bugreporter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bugs")
@CrossOrigin // Use CORS configuration from application properties
public class BugController {
    
    @Autowired
    private BugRepository bugRepository;
    
    @GetMapping
    public List<Bug> getAllBugs() {
        return bugRepository.findAllByOrderByCreatedAtDesc();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Bug> getBugById(@PathVariable Long id) {
        Optional<Bug> bug = bugRepository.findById(id);
        return bug.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Bug createBug(@RequestBody CreateBugRequest request) {
        Bug bug = new Bug(request.getTitle(), request.getDescription(), request.getScreenshotUrl());
        return bugRepository.save(bug);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Bug> updateBugStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        Optional<Bug> optionalBug = bugRepository.findById(id);
        if (optionalBug.isPresent()) {
            Bug bug = optionalBug.get();
            bug.setStatus(request.getStatus());
            return ResponseEntity.ok(bugRepository.save(bug));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBug(@PathVariable Long id) {
        if (bugRepository.existsById(id)) {
            bugRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // Request DTOs
    public static class CreateBugRequest {
        private String title;
        private String description;
        private String screenshotUrl;
        
        // Getters and Setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getScreenshotUrl() { return screenshotUrl; }
        public void setScreenshotUrl(String screenshotUrl) { this.screenshotUrl = screenshotUrl; }
    }
    
    public static class UpdateStatusRequest {
        private Bug.Status status;
        
        public Bug.Status getStatus() { return status; }
        public void setStatus(Bug.Status status) { this.status = status; }
    }
}