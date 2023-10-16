package com.senior.project.backend.domain;

import lombok.Data;

import java.util.Date;

@Data
public abstract class Activity {
    private String activityID;
    private String description;
    private Boolean needsArtifact;
    private Date date;
}
