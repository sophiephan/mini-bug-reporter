package com.example.bugreporter.integration;

import com.example.bugreporter.Bug;
import com.example.bugreporter.BugRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class BugRepositoryIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void registerPgProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private BugRepository bugRepository;

    @Test
    void shouldSaveAndRetrieveBug() {
        // Given
        Bug bug = new Bug("Test Bug", "This is a test bug", "http://example.com/screenshot.png");
        bug.setCreatedAt(LocalDateTime.now());
        bug.setStatus(Bug.Status.OPEN);

        // When
        Bug savedBug = bugRepository.save(bug);

        // Then
        assertThat(savedBug.getId()).isNotNull();
        assertThat(bugRepository.findById(savedBug.getId())).isPresent();
    }

    @Test
    void shouldFindBugsByStatus() {
        // Given
        Bug openBug1 = new Bug("Open Bug 1", "Description 1", null);
        openBug1.setStatus(Bug.Status.OPEN);
        
        Bug openBug2 = new Bug("Open Bug 2", "Description 2", null);
        openBug2.setStatus(Bug.Status.OPEN);
        
        Bug closedBug = new Bug("Closed Bug", "Description 3", null);
        closedBug.setStatus(Bug.Status.CLOSED);
        
        bugRepository.saveAll(List.of(openBug1, openBug2, closedBug));

        // When
        List<Bug> openBugs = bugRepository.findByStatusOrderByCreatedAtDesc(Bug.Status.OPEN);
        List<Bug> closedBugs = bugRepository.findByStatusOrderByCreatedAtDesc(Bug.Status.CLOSED);

        // Then
        assertThat(openBugs).hasSize(2);
        assertThat(closedBugs).hasSize(1);
    }

    @Test
    void shouldFindAllBugsOrderedByCreatedAtDesc() {
        // Given
        bugRepository.deleteAll(); // Clear any existing data
        
        Bug oldBug = new Bug("Old Bug", "Old description", null);
        oldBug.setCreatedAt(LocalDateTime.now().minusDays(2));
        
        Bug newBug = new Bug("New Bug", "New description", null);
        newBug.setCreatedAt(LocalDateTime.now());
        
        bugRepository.saveAll(List.of(oldBug, newBug));

        // When
        List<Bug> bugs = bugRepository.findAllByOrderByCreatedAtDesc();

        // Then
        assertThat(bugs).hasSize(2);
        assertThat(bugs.get(0).getTitle()).isEqualTo("New Bug");
        assertThat(bugs.get(1).getTitle()).isEqualTo("Old Bug");
    }
} 