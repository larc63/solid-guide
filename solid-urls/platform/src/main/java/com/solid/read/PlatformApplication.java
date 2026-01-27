package com.solid.read;
// spring boot app / utilities
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.view.RedirectView;
// annotations
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
// HTTP
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
// logging 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



@SpringBootApplication
@RestController
@CrossOrigin(origins = "http://localhost:4200", methods = {RequestMethod.GET, RequestMethod.POST})
public class PlatformApplication {
    // Create logger instance
    private static final Logger logger = LoggerFactory.getLogger(PlatformApplication.class);
    
    // In-memory store for shortened URLs (TODO: replace with database)
    private static final java.util.Map<String, String> urlStore = new java.util.HashMap<>();
    private static int nextId = 1;
    
    static {
        // Sample data for testing
        urlStore.put("1", "https://www.lavacahacemu.com");
        urlStore.put("abc123", "https://www.example.com");
        nextId = 2;
    }

    /**
     * Request model for creating a shortened URL
     */
    public static class UrlRequest {
        private String url;
        
        public String getUrl() {
            return url;
        }
        
        public void setUrl(String url) {
            this.url = url;
        }
    }
    
    /**
     * Response model for URL creation and retrieval
     */
    public static class UrlResult {
        private String short_url;
        private String url;
        
        public String getShort_url() {
            return short_url;
        }
        
        public void setShort_url(String short_url) {
            this.short_url = short_url;
        }
        
        public String getUrl() {
            return url;
        }
        
        public void setUrl(String url) {
            this.url = url;
        }
    }

	/**
	 * POST / - Create a new shortened URL
	 * Accepts a JSON request body with a "url" field
	 * Returns 201 Created with the shortened URL ID and original URL
	 *
	 * @param request The request body containing the URL to shorten
	 * @return ResponseEntity with 201 status and the URL result
	 */
	@RequestMapping(
		value = "/",
		method = {RequestMethod.POST}
	)
	public ResponseEntity<?> createShortenedUrl(@RequestBody UrlRequest request) {
        logger.trace("Creating shortened URL for: {}", request.getUrl());
        
        if (request.getUrl() == null || request.getUrl().trim().isEmpty()) {
            logger.warn("Invalid URL provided in request");
            return ResponseEntity.badRequest().build();
        }
        
        // Generate a new ID for the shortened URL
        String shortId = String.valueOf(nextId++);
        urlStore.put(shortId, request.getUrl());
        
        logger.debug("Created shortened URL with id: {}. Original URL: {}", shortId, request.getUrl());
        
        // Return the result with 201 status
        UrlResult result = new UrlResult();
        result.setShort_url("/" + shortId);
        result.setUrl(request.getUrl());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
	}

	/**
	 * GET /{id} - Retrieve the long URL from the provided ID and redirect
	 * Returns 302 Found with Location header if URL exists
	 * Returns redirect to root with error parameter if not found
	 *
	 * @param id The shortened URL identifier from the route
	 * @return RedirectView to the long URL or error page
	 */
	@RequestMapping(
		value = "/{id}",
		method = {RequestMethod.GET}
	)
	public RedirectView getUrl(@PathVariable String id) {
        logger.trace("Looking up shortened URL with id: {}", id);
        
        // Look up the URL in the store
        String longUrl = urlStore.get(id);
        
        if (longUrl != null) {
            logger.debug("URL found for id: {}. Redirecting to: {}", id, longUrl);
            return new RedirectView(longUrl);
        } else {
            logger.warn("URL not found for id: {}. Redirecting to root with error.", id);
            return new RedirectView("/?error=not_found");
        }
	}

	public static void main(String[] args) {
		SpringApplication.run(PlatformApplication.class, args);
	}
}