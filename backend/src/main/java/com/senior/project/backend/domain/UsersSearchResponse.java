package com.senior.project.backend.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Generated
public class UsersSearchResponse {
    private List<User> users;
    private long totalResults;

    public UsersSearchResponse(Page<User> page) {
        this.users = page.getContent();
        this.totalResults = page.getTotalElements();
    }
}
