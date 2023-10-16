package com.senior.project.backend.domain;

import lombok.*;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event extends Activity {
    private String eventID;
    private String activityID;
    private Boolean isRecurring;
    private String organizer;
    private String location;
    private Boolean isRequired;

}
