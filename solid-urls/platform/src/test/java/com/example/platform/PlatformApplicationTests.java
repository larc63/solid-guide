package com.solid.read;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.is; 

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test") 
class PlatformApplicationTests {
    @Autowired
    private MockMvc mockMvc;

    private static final String EXPECTED_REDIRECT_URL = "https://www.google.com";

    @Test
    void contextLoads() {
        // Verifies that the Spring context loads successfully
    }

    @Test
    void testGetRequestRedirects() throws Exception {
        mockMvc.perform(get("/any-path"))
                .andExpect(status().is3xxRedirection())
                .andExpect(status().isFound()) // 302
                .andExpect(redirectedUrl(EXPECTED_REDIRECT_URL));
    }

    @Test
    void testPostRequestRedirects() throws Exception {
        mockMvc.perform(post("/api/data"))
                .andExpect(status().is3xxRedirection())
                .andExpect(status().isFound())
                .andExpect(redirectedUrl(EXPECTED_REDIRECT_URL));
    }

    @Test
    void testPutRequestRedirects() throws Exception {
        mockMvc.perform(put("/api/resource/123"))
                .andExpect(status().is3xxRedirection())
                .andExpect(status().isFound())
                .andExpect(redirectedUrl(EXPECTED_REDIRECT_URL));
    }

    @Test
    void testDeleteRequestRedirects() throws Exception {
        mockMvc.perform(delete("/api/resource/456"))
                .andExpect(status().is3xxRedirection())
                .andExpect(status().isFound())
                .andExpect(redirectedUrl(EXPECTED_REDIRECT_URL));
    }

    @Test
    void testPatchRequestRedirects() throws Exception {
        mockMvc.perform(patch("/api/resource/789"))
                .andExpect(status().is3xxRedirection())
                .andExpect(status().isFound())
                .andExpect(redirectedUrl(EXPECTED_REDIRECT_URL));
    }

    @Test
    void testOptionsRequestRedirects() throws Exception {
        mockMvc.perform(options("/api/endpoint"))
                .andExpect(status().is3xxRedirection())
                .andExpect(status().isFound())
                .andExpect(redirectedUrl(EXPECTED_REDIRECT_URL));
    }

    @Test
    void testHeadRequestRedirects() throws Exception {
        mockMvc.perform(head("/some/path"))
                .andExpect(status().is3xxRedirection())
                .andExpect(status().isFound())
                .andExpect(redirectedUrl(EXPECTED_REDIRECT_URL));
    }

    @Test
    void testRootPathRedirects() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().is3xxRedirection())
                .andExpect(status().isFound())
                .andExpect(redirectedUrl(EXPECTED_REDIRECT_URL));
    }

    @Test
    void testNestedPathRedirects() throws Exception {
        mockMvc.perform(get("/deeply/nested/path/with/many/levels"))
                .andExpect(status().is3xxRedirection())
                .andExpect(status().isFound())
                .andExpect(redirectedUrl(EXPECTED_REDIRECT_URL));
    }

    @Test
    void testPathWithQueryParametersRedirects() throws Exception {
        mockMvc.perform(get("/search?query=test&page=1"))
                .andExpect(status().is3xxRedirection())
                .andExpect(status().isFound())
                .andExpect(redirectedUrl(EXPECTED_REDIRECT_URL));
    }

    @Test
    void testMultiplePathsAllRedirect() throws Exception {
        String[] paths = {"/api", "/users", "/products", "/admin/dashboard"};
        
        for (String path : paths) {
            mockMvc.perform(get(path))
                    .andExpect(status().isFound())
                    .andExpect(redirectedUrl(EXPECTED_REDIRECT_URL));
        }
    }

    @Test
    void testRedirectStatusCodeIs302() throws Exception {
        mockMvc.perform(get("/test"))
                .andExpect(status().is(302))
                .andExpect(header().string("Location", is(EXPECTED_REDIRECT_URL)));
    }
}