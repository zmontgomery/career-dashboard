package com.senior.project.backend.portfolio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.senior.project.backend.degreeprogram.DegreeProgramRepository;
import com.senior.project.backend.domain.StudentDetails;
import com.senior.project.backend.domain.User;
import com.senior.project.backend.security.CurrentUserUtil;
import com.senior.project.backend.studentdetails.StudentDetailsRepository;

import reactor.core.publisher.Mono;

@Service
public class PortfolioService {
    @Autowired
    private CurrentUserUtil currentUserUtil;

    @Autowired
    private StudentDetailsRepository studentDetailsRepository;

    @Autowired
    private DegreeProgramRepository degreeProgramRepository;

    public Mono<User> saveEducation(EducationDTO educationDTO) {
        return currentUserUtil.getCurrentUser()
                .flatMap(user -> {
                    this.updateStudentDetails(user, educationDTO);
                    this.updateDegreePrograms(educationDTO);
                    return Mono.just(user);
                });
    }

    private void updateStudentDetails(User user, EducationDTO educationDTO) {
        StudentDetails studentDetails = user.getStudentDetails();
        studentDetails.setUniversityId(educationDTO.getUniversityId());
        studentDetails.setGpa(educationDTO.getGpa());
        studentDetails.setYearLevel(educationDTO.getYear());
        studentDetails = studentDetailsRepository.save(studentDetails);
        user.setStudentDetails(studentDetails);
    }

    private void updateDegreePrograms(EducationDTO educationDTO) {
        // TODO: Update majors and minors
    }
}
