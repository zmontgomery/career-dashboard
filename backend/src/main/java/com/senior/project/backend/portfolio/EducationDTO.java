package com.senior.project.backend.portfolio;

import java.util.List;

import com.senior.project.backend.domain.YearLevel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Generated;

@Data
@AllArgsConstructor
@Generated
public class EducationDTO {
    int universityId;
    YearLevel year;
    double gpa;
    List<String> majors;
    List<String> minors;
}
