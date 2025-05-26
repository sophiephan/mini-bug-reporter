package com.example.bugreporter;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class BugRepositoryTest {

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
    private TestEntityManager entityManager;

    @Autowired
    private BugRepository bugRepository;

    @Test
    public void testFindAllByOrderByCreatedAtDesc() {
        // Given
        Bug bug1 = new Bug("Older Bug", "Description 1", null);
        bug1.setPriority(Bug.Priority.LOW);
        entityManager.persist(bug1);
        
        // Simulate a delay
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        Bug bug2 = new Bug("Newer Bug", "Description 2", null);
        bug2.setPriority(Bug.Priority.HIGH);
        entityManager.persist(bug2);
        
        entityManager.flush();
        
        // When
        List<Bug> bugs = bugRepository.findAllByOrderByCreatedAtDesc();
        
        // Then
        assertEquals(2, bugs.size());
        assertEquals("Newer Bug", bugs.get(0).getTitle());
        assertEquals("Older Bug", bugs.get(1).getTitle());
        assertEquals(Bug.Priority.HIGH, bugs.get(0).getPriority());
        assertEquals(Bug.Priority.LOW, bugs.get(1).getPriority());
    }
    
    @Test
    public void testFindByStatusOrderByCreatedAtDesc() {
        // Given
        Bug openBug1 = new Bug("Open Bug 1", "Description", null);
        openBug1.setPriority(Bug.Priority.MEDIUM);
        entityManager.persist(openBug1);
        
        Bug inProgressBug = new Bug("In Progress Bug", "Description", null);
        inProgressBug.setStatus(Bug.Status.IN_PROGRESS);
        inProgressBug.setPriority(Bug.Priority.HIGH);
        entityManager.persist(inProgressBug);
        
        Bug openBug2 = new Bug("Open Bug 2", "Description", null);
        openBug2.setPriority(Bug.Priority.CRITICAL);
        entityManager.persist(openBug2);
        
        entityManager.flush();
        
        // When
        List<Bug> openBugs = bugRepository.findByStatusOrderByCreatedAtDesc(Bug.Status.OPEN);
        List<Bug> inProgressBugs = bugRepository.findByStatusOrderByCreatedAtDesc(Bug.Status.IN_PROGRESS);
        List<Bug> closedBugs = bugRepository.findByStatusOrderByCreatedAtDesc(Bug.Status.CLOSED);
        
        // Then
        assertEquals(2, openBugs.size());
        assertEquals(1, inProgressBugs.size());
        assertEquals(0, closedBugs.size());
        
        assertEquals("Open Bug 2", openBugs.get(0).getTitle());
        assertEquals("Open Bug 1", openBugs.get(1).getTitle());
        assertEquals("In Progress Bug", inProgressBugs.get(0).getTitle());
        assertEquals(Bug.Priority.CRITICAL, openBugs.get(0).getPriority());
    }
} 