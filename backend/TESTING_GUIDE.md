# Testing Guide for Bug Reporter Backend

This document explains the testing approach used in the Bug Reporter backend application.

## Testing Layers

The application follows a standard testing pyramid with multiple layers of tests:

1. **Unit Tests**: Testing individual components in isolation
2. **Integration Tests**: Testing interactions between components
3. **End-to-End Tests**: Testing the complete application flow

## Test Classes

### BugTest

Unit tests for the `Bug` entity class.

- `testBugCreation`: Verifies that a bug can be created with the expected properties
- `testBugStatusUpdate`: Ensures that the bug status can be updated correctly
- `testDefaultConstructor`: Validates the behavior of the default constructor

### BugRepositoryTest

Integration tests for the `BugRepository` interface.

- `testFindAllByOrderByCreatedAtDesc`: Verifies that bugs are returned in descending order of creation date
- `testFindByStatusOrderByCreatedAtDesc`: Tests filtering bugs by status and ordering by creation date

### BugControllerTest

Unit tests for the `BugController` class using MockMvc.

- `testGetAllBugs`: Tests the endpoint to retrieve all bugs
- `testGetBugById`: Tests retrieving a specific bug by ID
- `testCreateBug`: Tests creating a new bug
- `testUpdateBugStatus`: Tests updating a bug's status
- `testDeleteBug`: Tests deleting a bug

### BugReporterApplicationTests

End-to-end integration tests for the complete application.

- `contextLoads`: Verifies that the application context loads successfully
- `testFullBugLifecycle`: Tests the complete lifecycle of a bug (create, read, update, delete)

## Running Tests

To run all tests:

```
./gradlew test
```

To run a specific test class:

```
./gradlew test --tests "com.example.bugreporter.BugControllerTest"
```

## Test Configuration

The tests use an in-memory H2 database configured in `application-test.properties`.

Key configuration settings:
- `spring.datasource.url=jdbc:h2:mem:testdb`: In-memory database URL
- `spring.jpa.hibernate.ddl-auto=create-drop`: Database schema is created before tests and dropped after
- `spring.jpa.show-sql=true`: SQL statements are logged for debugging

## Test Dependencies

- JUnit 5: Testing framework
- Spring Boot Test: Testing support for Spring Boot applications
- Mockito: Mocking framework for unit tests
- H2 Database: In-memory database for testing

## Best Practices

1. **Isolation**: Each test should be independent and not rely on the state from other tests
2. **Clarity**: Test names should clearly describe what is being tested
3. **Coverage**: Aim for high test coverage, especially for critical business logic
4. **Speed**: Tests should run quickly to enable fast feedback during development
5. **Reliability**: Tests should produce consistent results and not be flaky 