package com.example.bugreporter.service;

import com.example.bugreporter.Bug;
import com.example.bugreporter.BugRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BugService {

    private final BugRepository bugRepository;

    @Autowired
    public BugService(BugRepository bugRepository) {
        this.bugRepository = bugRepository;
    }

    @Transactional(readOnly = true)
    public List<Bug> getAllBugs() {
        return bugRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<Bug> getBugsByStatus(Bug.Status status) {
        return bugRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    @Transactional(readOnly = true)
    public Optional<Bug> getBugById(Long id) {
        return bugRepository.findById(id);
    }

    @Transactional
    public Bug createBug(Bug bug) {
        return bugRepository.save(bug);
    }

    @Transactional
    public Optional<Bug> updateBug(Long id, Bug bugDetails) {
        return bugRepository.findById(id)
                .map(existingBug -> {
                    if (bugDetails.getTitle() != null) {
                        existingBug.setTitle(bugDetails.getTitle());
                    }
                    if (bugDetails.getDescription() != null) {
                        existingBug.setDescription(bugDetails.getDescription());
                    }
                    if (bugDetails.getScreenshotUrl() != null) {
                        existingBug.setScreenshotUrl(bugDetails.getScreenshotUrl());
                    }
                    if (bugDetails.getStatus() != null) {
                        existingBug.setStatus(bugDetails.getStatus());
                    }
                    if (bugDetails.getPriority() != null) {
                        existingBug.setPriority(bugDetails.getPriority());
                    }
                    // Update metadata if present
                    if (bugDetails.getMetadata() != null && !bugDetails.getMetadata().isEmpty()) {
                        for (Map.Entry<String, String> entry : bugDetails.getMetadata().entrySet()) {
                            existingBug.addMetadata(entry.getKey(), entry.getValue());
                        }
                    }
                    return bugRepository.save(existingBug);
                });
    }

    @Transactional
    public boolean deleteBug(Long id) {
        if (bugRepository.existsById(id)) {
            bugRepository.deleteById(id);
            return true;
        }
        return false;
    }
} 