Here's a Spring Boot endpoint that returns a 302 redirect:

## Simple Approach (Recommended)
```java
@RestController
@RequestMapping("/api")
public class RedirectController {
    
    @GetMapping("/redirect")
    public RedirectView redirect() {
        return new RedirectView("/api/destination");
    }
    
    @GetMapping("/destination")
    public String destination() {
        return "You've been redirected!";
    }
}
```

## Using ResponseEntity (More Control)
```java
@RestController
@RequestMapping("/api")
public class RedirectController {
    
    @GetMapping("/redirect")
    public ResponseEntity<Void> redirect() {
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create("/api/destination"));
        return new ResponseEntity<>(headers, HttpStatus.FOUND); // 302
    }
    
    @GetMapping("/destination")
    public String destination() {
        return "You've been redirected!";
    }
}
```

## External URL Redirect
```java
@GetMapping("/redirect-external")
public RedirectView redirectToExternal() {
    return new RedirectView("https://www.example.com");
}
```

## With Path Variables
```java
@GetMapping("/user/{id}/redirect")
public RedirectView redirectWithParams(@PathVariable Long id) {
    return new RedirectView("/user/" + id + "/profile");
}
```

## Using "redirect:" Prefix (String Return)
```java
@Controller // Note: @Controller, not @RestController
@RequestMapping("/web")
public class WebRedirectController {
    
    @GetMapping("/redirect")
    public String redirect() {
        return "redirect:/web/destination"; // Spring handles the 302
    }
    
    @GetMapping("/destination")
    @ResponseBody
    public String destination() {
        return "You've been redirected!";
    }
}
```

## Different Status Codes
```java
// 301 - Permanent Redirect
@GetMapping("/permanent-redirect")
public ResponseEntity<Void> permanentRedirect() {
    HttpHeaders headers = new HttpHeaders();
    headers.setLocation(URI.create("/api/destination"));
    return new ResponseEntity<>(headers, HttpStatus.MOVED_PERMANENTLY); // 301
}

// 307 - Temporary Redirect (preserves HTTP method)
@GetMapping("/temp-redirect")
public ResponseEntity<Void> temporaryRedirect() {
    HttpHeaders headers = new HttpHeaders();
    headers.setLocation(URI.create("/api/destination"));
    return new ResponseEntity<>(headers, HttpStatus.TEMPORARY_REDIRECT); // 307
}
```

## Complete Example with Logic
```java
@RestController
@RequestMapping("/api")
public class SmartRedirectController {
    
    @GetMapping("/login")
    public RedirectView login(@RequestParam(required = false) String token) {
        if (token != null && isValidToken(token)) {
            // Redirect to dashboard if authenticated
            return new RedirectView("/api/dashboard");
        } else {
            // Redirect to login page if not authenticated
            return new RedirectView("/api/login-form");
        }
    }
    
    @GetMapping("/dashboard")
    public String dashboard() {
        return "Welcome to dashboard";
    }
    
    @GetMapping("/login-form")
    public String loginForm() {
        return "Please log in";
    }
    
    private boolean isValidToken(String token) {
        // Your validation logic
        return "valid-token".equals(token);
    }
}
```

## Key Differences

| Approach | Use Case | Notes |
|----------|----------|-------|
| `RedirectView` | Most common, simple | Clean and straightforward |
| `ResponseEntity` | Need full control | Can set custom headers, status codes |
| `"redirect:"` prefix | Spring MVC views | Requires `@Controller` not `@RestController` |

**For REST APIs**: Use `RedirectView` or `ResponseEntity`  
**For web pages**: Use `"redirect:"` prefix with `@Controller`

The `RedirectView` approach is cleanest for most REST API use cases and Spring handles the 302 status code automatically.