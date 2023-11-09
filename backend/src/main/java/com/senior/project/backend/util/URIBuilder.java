package com.senior.project.backend.util;

import org.springframework.stereotype.Component;

@Component
public class URIBuilder {
    public static final String ROOT = "/api";

    public String buildUri(String... segments) {
        String uri = ROOT;
        for (String s : segments) {
            uri += "/" + s;
        }
        return uri;
    }
}
