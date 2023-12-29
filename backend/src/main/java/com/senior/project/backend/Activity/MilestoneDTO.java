package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.YearLevel;
import lombok.*;

@Data
@AllArgsConstructor
public class MilestoneDTO {
    private Long id;
    private String name;
    private YearLevel yearLevel;
}
