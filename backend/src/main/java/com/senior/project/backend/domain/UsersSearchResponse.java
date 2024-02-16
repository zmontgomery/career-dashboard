package com.senior.project.backend.domain;

import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
public class UsersSearchResponse {
    private List<User> users;
    private long totalResults;

    public UsersSearchResponse(Page<User> page) {
        this.users = page.getContent();
        this.totalResults = page.getTotalElements();
    }
}
