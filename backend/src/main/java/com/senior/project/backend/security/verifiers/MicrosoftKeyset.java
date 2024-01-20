package com.senior.project.backend.security.verifiers;

import java.net.URISyntaxException;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import jakarta.annotation.PostConstruct;

/**
 * A component that fetches the Json Web Keyset from Microsoft
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Component
public class MicrosoftKeyset {
    
    private static final String MICROSOFT_BASE = "https://login.microsoftonline.com";
    private static final String MICROSOFT_URI = "/common/discovery/v2.0/keys";

    private String keySet;

    private WebClient webClient;

    public MicrosoftKeyset() {
        webClient = WebClient.create(MICROSOFT_BASE);
    }

    public String getKeySet() {
        return keySet;
    }

    @PostConstruct
    public void fetchKeySet() throws URISyntaxException {
        if (keySet == null) {
            keySet = webClient.get()
                .uri(MICROSOFT_URI)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        }
    }

    public void invalidateCache() {
        keySet = null;
    }
}
