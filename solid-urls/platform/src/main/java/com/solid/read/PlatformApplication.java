package com.solid.read;
// spring boot app / utilities
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.view.RedirectView;
// annotations
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;
// logging 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
@RestController
public class PlatformApplication {
	// temporary redirect url
	private static final String REDIRECT_URL = "https://www.lavacahacemu.com";


    // Create logger instance
    private static final Logger logger = LoggerFactory.getLogger(PlatformApplication.class);

	/**
	 * Catches all URIs and returns a 302 Found redirect.
	 * The `redirect:` prefix is processed by Spring, resulting in a 302 response
	 * with the 'Location' header set to the target URL.
	 *
	 * @return A String instructing Spring to perform a 302 redirect.
	 */
	@RequestMapping(
		value = "/**",
		method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS, RequestMethod.HEAD}
	)
	public RedirectView redirectToExternal() {
        logger.trace("Redirecting to test url");
		return new RedirectView(REDIRECT_URL);
	}
	public static void main(String[] args) {
		SpringApplication.run(PlatformApplication.class, args);
	}

}