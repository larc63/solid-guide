Here's how to set up logging in a Spring Boot application:

## 1. Basic Configuration (application.properties)

Spring Boot uses Logback by default - no additional dependencies needed.

```properties
# application.properties

# Set root logging level
logging.level.root=INFO

# Set logging level for your package
logging.level.com.yourcompany.yourapp=DEBUG

# Set logging level for specific classes
logging.level.com.yourcompany.yourapp.service.UserService=TRACE

# Set logging level for Spring framework
logging.level.org.springframework.web=DEBUG
logging.level.org.springframework.security=DEBUG

# Output to file
logging.file.name=logs/application.log

# Or specify directory (creates spring.log)
logging.file.path=logs

# Log pattern for console
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n

# Log pattern for file
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n

# Max file size before rolling
logging.logback.rollingpolicy.max-file-size=10MB

# Keep log history for 30 days
logging.logback.rollingpolicy.max-history=30

# Total size of log archives
logging.logback.rollingpolicy.total-size-cap=1GB
```

## 2. Using Logger in Your Code

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    // Create logger instance
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    public User getUser(Long id) {
        logger.trace("Entering getUser method with id: {}", id);
        logger.debug("Fetching user with id: {}", id);
        
        try {
            User user = userRepository.findById(id);
            logger.info("Successfully retrieved user: {}", user.getUsername());
            return user;
        } catch (Exception e) {
            logger.error("Error fetching user with id: {}", id, e);
            throw e;
        }
    }
    
    public void deleteUser(Long id) {
        logger.warn("Attempting to delete user with id: {}", id);
        userRepository.deleteById(id);
    }
}
```

## 3. Using Lombok (Optional - Cleaner)

Add Lombok dependency:
```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <scope>provided</scope>
</dependency>
```

Then use `@Slf4j` annotation:
```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserService {
    
    public User getUser(Long id) {
        log.debug("Fetching user with id: {}", id);
        // 'log' is automatically available
        return userRepository.findById(id);
    }
}
```

## 4. Advanced Configuration (logback-spring.xml)

For more control, create `src/main/resources/logback-spring.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    
    <!-- Console Appender -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <!-- File Appender -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/application.log</file>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/application-%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>10MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
    </appender>
    
    <!-- Error File Appender -->
    <appender name="ERROR_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/error.log</file>
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>ERROR</level>
        </filter>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/error-%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
    </appender>
    
    <!-- Set logging level for your packages -->
    <logger name="com.yourcompany.yourapp" level="DEBUG"/>
    <logger name="org.springframework.web" level="INFO"/>
    
    <!-- Root logger -->
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
        <appender-ref ref="ERROR_FILE"/>
    </root>
    
</configuration>
```

## 5. Environment-Specific Configuration

**application-dev.properties:**
```properties
logging.level.root=DEBUG
logging.level.com.yourcompany.yourapp=TRACE
```

**application-prod.properties:**
```properties
logging.level.root=WARN
logging.level.com.yourcompany.yourapp=INFO
logging.file.name=/var/log/myapp/application.log
```

## 6. Logging REST Requests/Responses

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        log.info("GET request received for user id: {}", id);
        User user = userService.getUser(id);
        log.info("Returning user: {}", user);
        return user;
    }
    
    @PostMapping
    public User createUser(@RequestBody User user) {
        log.info("POST request received to create user: {}", user.getUsername());
        User created = userService.createUser(user);
        log.info("User created successfully with id: {}", created.getId());
        return created;
    }
}
```

## 7. Logging Levels (from most to least verbose)

```
TRACE - Very detailed, typically only for diagnosing problems
DEBUG - Detailed information for debugging
INFO  - General informational messages
WARN  - Warning messages for potentially harmful situations
ERROR - Error events that might still allow the app to continue
```

## 8. Best Practices

```java
@Slf4j
@Service
public class BestPracticesExample {
    
    // ✅ GOOD: Use parameterized logging (more efficient)
    log.debug("User {} logged in at {}", username, timestamp);
    
    // ❌ BAD: String concatenation (evaluated even if debug is disabled)
    log.debug("User " + username + " logged in at " + timestamp);
    
    // ✅ GOOD: Log exceptions with context
    try {
        processPayment(amount);
    } catch (PaymentException e) {
        log.error("Payment processing failed for amount: {}", amount, e);
    }
    
    // ✅ GOOD: Conditional logging for expensive operations
    if (log.isDebugEnabled()) {
        log.debug("Complex object: {}", expensiveToStringOperation());
    }
    
    // ✅ GOOD: Don't log sensitive data
    log.info("User logged in: {}", user.getUsername()); // OK
    // ❌ BAD:
    log.info("User logged in with password: {}", user.getPassword()); // NO!
}
```

## Quick Start Summary

**Minimal setup:**
1. Add to `application.properties`:
   ```properties
   logging.level.com.yourcompany=DEBUG
   logging.file.name=logs/app.log
   ```

2. Use in your classes:
   ```java
   @Slf4j
   @Service
   public class MyService {
       public void doSomething() {
           log.info("Doing something");
       }
   }
   ```

That's it! Spring Boot handles the rest automatically.