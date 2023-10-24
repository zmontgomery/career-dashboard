package com.senior.project.backend.domain;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@ToString
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class Activity {
    private String activityID;

}
