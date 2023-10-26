package com.senior.project.backend.domain;

import lombok.*;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    
    private String id;
    
    private String description;
    private Boolean isRequired;
    private Boolean needsArtifact;

}
