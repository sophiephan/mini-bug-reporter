package com.example.bugreporter.service;

import com.example.bugreporter.Bug;
import com.example.bugreporter.BugRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BugServiceTest {

    @Mock
    private BugRepository bugRepository;

    @InjectMocks
    private BugService bugService;

    private Bug testBug;

    @BeforeEach
    void setUp() {
        testBug = new Bug("Test Bug", "This is a test", "http://example.com/screenshot.png");
        testBug.setId(1L);
        testBug.setCreatedAt(LocalDateTime.now());
        testBug.setStatus(Bug.Status.OPEN);
    }

    @Test
    void getAllBugs() {
        // Given
        List<Bug> expectedBugs = Collections.singletonList(testBug);
        when(bugRepository.findAllByOrderByCreatedAtDesc()).thenReturn(expectedBugs);

        // When
        List<Bug> actualBugs = bugService.getAllBugs();

        // Then
        assertThat(actualBugs).isEqualTo(expectedBugs);
        verify(bugRepository).findAllByOrderByCreatedAtDesc();
    }

    @Test
    void getBugsByStatus() {
        // Given
        List<Bug> expectedBugs = Collections.singletonList(testBug);
        when(bugRepository.findByStatusOrderByCreatedAtDesc(Bug.Status.OPEN)).thenReturn(expectedBugs);

        // When
        List<Bug> actualBugs = bugService.getBugsByStatus(Bug.Status.OPEN);

        // Then
        assertThat(actualBugs).isEqualTo(expectedBugs);
        verify(bugRepository).findByStatusOrderByCreatedAtDesc(Bug.Status.OPEN);
    }

    @Test
    void getBugById() {
        // Given
        when(bugRepository.findById(1L)).thenReturn(Optional.of(testBug));
        when(bugRepository.findById(2L)).thenReturn(Optional.empty());

        // When
        Optional<Bug> foundBug = bugService.getBugById(1L);
        Optional<Bug> notFoundBug = bugService.getBugById(2L);

        // Then
        assertThat(foundBug).isPresent();
        assertThat(foundBug.get()).isEqualTo(testBug);
        assertThat(notFoundBug).isEmpty();
        verify(bugRepository).findById(1L);
        verify(bugRepository).findById(2L);
    }

    @Test
    void createBug() {
        // Given
        when(bugRepository.save(any(Bug.class))).thenReturn(testBug);

        // When
        Bug createdBug = bugService.createBug(testBug);

        // Then
        assertThat(createdBug).isEqualTo(testBug);
        verify(bugRepository).save(testBug);
    }

    @Test
    void updateBug() {
        // Given
        Bug updateDetails = new Bug();
        updateDetails.setTitle("Updated Title");
        updateDetails.setDescription("Updated Description");
        updateDetails.setStatus(Bug.Status.IN_PROGRESS);

        Bug updatedBug = new Bug(testBug.getTitle(), testBug.getDescription(), testBug.getScreenshotUrl());
        updatedBug.setId(testBug.getId());
        updatedBug.setCreatedAt(testBug.getCreatedAt());
        updatedBug.setTitle(updateDetails.getTitle());
        updatedBug.setDescription(updateDetails.getDescription());
        updatedBug.setStatus(updateDetails.getStatus());

        when(bugRepository.findById(1L)).thenReturn(Optional.of(testBug));
        when(bugRepository.save(any(Bug.class))).thenReturn(updatedBug);
        when(bugRepository.findById(2L)).thenReturn(Optional.empty());

        // When
        Optional<Bug> result = bugService.updateBug(1L, updateDetails);
        Optional<Bug> nonExistentResult = bugService.updateBug(2L, updateDetails);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getTitle()).isEqualTo("Updated Title");
        assertThat(result.get().getDescription()).isEqualTo("Updated Description");
        assertThat(result.get().getStatus()).isEqualTo(Bug.Status.IN_PROGRESS);
        
        assertThat(nonExistentResult).isEmpty();
        
        verify(bugRepository).findById(1L);
        verify(bugRepository).findById(2L);
        verify(bugRepository).save(any(Bug.class));
    }

    @Test
    void deleteBug() {
        // Given
        when(bugRepository.existsById(1L)).thenReturn(true);
        when(bugRepository.existsById(2L)).thenReturn(false);
        doNothing().when(bugRepository).deleteById(any(Long.class));

        // When
        boolean existingDeleted = bugService.deleteBug(1L);
        boolean nonExistingDeleted = bugService.deleteBug(2L);

        // Then
        assertThat(existingDeleted).isTrue();
        assertThat(nonExistingDeleted).isFalse();
        
        verify(bugRepository).existsById(1L);
        verify(bugRepository).existsById(2L);
        verify(bugRepository).deleteById(1L);
        verify(bugRepository, never()).deleteById(2L);
    }

    @Test
    void updateBugPriority() {
        // Given
        Bug updateDetails = new Bug();
        updateDetails.setPriority(Bug.Priority.HIGH); // Set the new priority

        when(bugRepository.findById(1L)).thenReturn(Optional.of(testBug));
        when(bugRepository.save(any(Bug.class))).thenReturn(testBug);

        // When
        Optional<Bug> result = bugService.updateBug(1L, updateDetails);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getPriority()).isEqualTo(Bug.Priority.HIGH); // Check if priority is updated

        verify(bugRepository).findById(1L);
        verify(bugRepository).save(any(Bug.class));
    }
} 