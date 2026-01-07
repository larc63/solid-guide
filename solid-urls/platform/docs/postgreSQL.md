Here's a comprehensive Spring Boot application with PostgreSQL integration:

## 1. Project Structure

```
spring-postgres-demo/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── demo/
│   │   │               ├── DemoApplication.java
│   │   │               ├── controller/
│   │   │               │   └── UserController.java
│   │   │               ├── model/
│   │   │               │   └── User.java
│   │   │               ├── repository/
│   │   │               │   └── UserRepository.java
│   │   │               └── service/
│   │   │                   ├── UserService.java
│   │   │                   └── UserServiceImpl.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── schema.sql (optional)
│   └── test/
│       └── java/
└── build.gradle (or pom.xml)
```

## 2. Dependencies (build.gradle)

```gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management' version '1.1.4'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'

java {
    sourceCompatibility = '17'
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot Starters
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    
    // PostgreSQL Driver
    implementation 'org.postgresql:postgresql'
    
    // Lombok (optional - reduces boilerplate)
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    
    // Validation
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    
    // Testing
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'com.h2database:h2' // For testing
}

tasks.named('test') {
    useJUnitPlatform()
}
```

## 3. Application Configuration (application.yml)

```yaml
spring:
  application:
    name: spring-postgres-demo
  
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
    
  jpa:
    hibernate:
      ddl-auto: update  # Options: none, validate, update, create, create-drop
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    
  sql:
    init:
      mode: always  # Will run schema.sql on startup

server:
  port: 8080

logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

## 4. Entity Model (User.java)

```java
package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Username is required")
    @Column(nullable = false, unique = true)
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(nullable = false, unique = true)
    private String email;
    
    @NotBlank(message = "First name is required")
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

## 5. Repository Interface (UserRepository.java)

```java
package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Spring Data JPA automatically implements these based on method names
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    List<User> findByIsActive(Boolean isActive);
    
    List<User> findByLastNameContainingIgnoreCase(String lastName);
    
    boolean existsByEmail(String email);
    
    boolean existsByUsername(String username);
    
    // Custom JPQL query
    @Query("SELECT u FROM User u WHERE u.firstName = :firstName AND u.isActive = true")
    List<User> findActiveUsersByFirstName(@Param("firstName") String firstName);
    
    // Native SQL query
    @Query(value = "SELECT * FROM users WHERE email LIKE %:domain", nativeQuery = true)
    List<User> findUsersByEmailDomain(@Param("domain") String domain);
    
    // Count query
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = :active")
    long countByActiveStatus(@Param("active") Boolean active);
}
```

## 6. Service Interface (UserService.java)

```java
package com.example.demo.service;

import com.example.demo.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    
    // Create
    User createUser(User user);
    
    // Read
    List<User> getAllUsers();
    
    Optional<User> getUserById(Long id);
    
    Optional<User> getUserByUsername(String username);
    
    Optional<User> getUserByEmail(String email);
    
    List<User> getActiveUsers();
    
    List<User> searchUsersByLastName(String lastName);
    
    // Update
    User updateUser(Long id, User user);
    
    // Delete
    void deleteUser(Long id);
    
    // Custom queries
    List<User> getUsersByFirstName(String firstName);
    
    long countActiveUsers();
}
```

## 7. Service Implementation (UserServiceImpl.java)

```java
package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    
    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public User createUser(User user) {
        log.info("Creating new user: {}", user.getUsername());
        
        // Check if username or email already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        return userRepository.save(user);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        log.info("Fetching all users");
        return userRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long id) {
        log.info("Fetching user by id: {}", id);
        return userRepository.findById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<User> getUserByUsername(String username) {
        log.info("Fetching user by username: {}", username);
        return userRepository.findByUsername(username);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<User> getUserByEmail(String email) {
        log.info("Fetching user by email: {}", email);
        return userRepository.findByEmail(email);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> getActiveUsers() {
        log.info("Fetching active users");
        return userRepository.findByIsActive(true);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> searchUsersByLastName(String lastName) {
        log.info("Searching users by last name: {}", lastName);
        return userRepository.findByLastNameContainingIgnoreCase(lastName);
    }
    
    @Override
    public User updateUser(Long id, User updatedUser) {
        log.info("Updating user with id: {}", id);
        
        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setFirstName(updatedUser.getFirstName());
                    existingUser.setLastName(updatedUser.getLastName());
                    existingUser.setEmail(updatedUser.getEmail());
                    existingUser.setIsActive(updatedUser.getIsActive());
                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    @Override
    public void deleteUser(Long id) {
        log.info("Deleting user with id: {}", id);
        
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        
        userRepository.deleteById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> getUsersByFirstName(String firstName) {
        log.info("Fetching users by first name: {}", firstName);
        return userRepository.findActiveUsersByFirstName(firstName);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countActiveUsers() {
        log.info("Counting active users");
        return userRepository.countByActiveStatus(true);
    }
}
```

## 8. REST Controller (UserController.java)

```java
package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Slf4j
public class UserController {
    
    private final UserService userService;
    
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    // CREATE - POST /api/users
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        log.info("POST /api/users - Creating user: {}", user.getUsername());
        User createdUser = userService.createUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }
    
    // READ ALL - GET /api/users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        log.info("GET /api/users - Fetching all users");
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    // READ ONE - GET /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        log.info("GET /api/users/{} - Fetching user by id", id);
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // READ BY USERNAME - GET /api/users/username/{username}
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        log.info("GET /api/users/username/{} - Fetching user by username", username);
        return userService.getUserByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // READ BY EMAIL - GET /api/users/email/{email}
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        log.info("GET /api/users/email/{} - Fetching user by email", email);
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // READ ACTIVE - GET /api/users/active
    @GetMapping("/active")
    public ResponseEntity<List<User>> getActiveUsers() {
        log.info("GET /api/users/active - Fetching active users");
        List<User> users = userService.getActiveUsers();
        return ResponseEntity.ok(users);
    }
    
    // SEARCH - GET /api/users/search?lastName=Smith
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String lastName) {
        log.info("GET /api/users/search?lastName={}", lastName);
        List<User> users = userService.searchUsersByLastName(lastName);
        return ResponseEntity.ok(users);
    }
    
    // UPDATE - PUT /api/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody User user) {
        log.info("PUT /api/users/{} - Updating user", id);
        try {
            User updatedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // DELETE - DELETE /api/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.info("DELETE /api/users/{} - Deleting user", id);
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // COUNT ACTIVE - GET /api/users/count/active
    @GetMapping("/count/active")
    public ResponseEntity<Long> countActiveUsers() {
        log.info("GET /api/users/count/active - Counting active users");
        long count = userService.countActiveUsers();
        return ResponseEntity.ok(count);
    }
}
```

## 9. Main Application Class (DemoApplication.java)

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

## 10. Optional: Initial Schema (schema.sql)

Place in `src/main/resources/schema.sql`:

```sql
-- This file is optional - Hibernate can create tables automatically
-- But you might want to define it explicitly for production

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
```

## 11. Docker Compose for PostgreSQL

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: postgres-db
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

  app:
    build: .
    container_name: spring-app
    depends_on:
      - postgres
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/mydb
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
    ports:
      - "8080:8080"
    networks:
      - app-network

volumes:
  postgres-data:

networks:
  app-network:
    driver: bridge
```

## 12. Testing the API

```bash
# Start PostgreSQL
docker-compose up postgres -d

# Run the application
./gradlew bootRun

# OR with Docker
docker-compose up

# Test endpoints with curl:

# CREATE user
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }'

# GET all users
curl http://localhost:8080/api/users

# GET user by ID
curl http://localhost:8080/api/users/1

# GET user by username
curl http://localhost:8080/api/users/username/johndoe

# GET active users
curl http://localhost:8080/api/users/active

# SEARCH users
curl http://localhost:8080/api/users/search?lastName=Doe

# UPDATE user
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true
  }'

# DELETE user
curl -X DELETE http://localhost:8080/api/users/1

# COUNT active users
curl http://localhost:8080/api/users/count/active
```

## 13. Advanced Query Examples

Add these to `UserRepository.java` for more complex queries:

```java
// Pagination and sorting
Page<User> findAll(Pageable pageable);

// Multiple conditions
List<User> findByFirstNameAndLastName(String firstName, String lastName);

// OR conditions
List<User> findByFirstNameOrLastName(String firstName, String lastName);

// Between dates
@Query("SELECT u FROM User u WHERE u.createdAt BETWEEN :startDate AND :endDate")
List<User> findUsersCreatedBetween(
    @Param("startDate") LocalDateTime startDate,
    @Param("endDate") LocalDateTime endDate
);

// Aggregation
@Query("SELECT u.isActive, COUNT(u) FROM User u GROUP BY u.isActive")
List<Object[]> countUsersByActiveStatus();

// Join example (if you had related entities)
@Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.id = :id")
Optional<User> findUserWithOrders(@Param("id") Long id);
```

## 14. Exception Handling (Optional but Recommended)

Create `GlobalExceptionHandler.java`:

```java
package com.example.demo.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        log.error("Runtime exception: ", ex);
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("message", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException ex) {
        log.error("Validation exception: ", ex);
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );
        response.put("errors", errors);
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
```

This gives you a complete, production-ready Spring Boot application with PostgreSQL integration including CRUD operations, custom queries, validation, logging, and error handling!