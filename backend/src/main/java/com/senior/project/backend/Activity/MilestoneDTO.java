package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.YearLevel;
import lombok.*;

@Data
@AllArgsConstructor
@Generated
public class MilestoneDTO {
    private Long id;
    private String name;
    private YearLevel yearLevel;
}
