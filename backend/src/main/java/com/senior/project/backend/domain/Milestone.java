package com.senior.project.backend.domain;

import lombok.*;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Milestone extends Activity{
    private String milestoneID;
    private String activityID;
    private boolean isActive;
}
