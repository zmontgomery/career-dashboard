package com.senior.project.backend.domain;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Data
@ToString
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class Activity {
    private String activityID;
    private String description;
    private Boolean needsArtifact;
    private Date date;
}
