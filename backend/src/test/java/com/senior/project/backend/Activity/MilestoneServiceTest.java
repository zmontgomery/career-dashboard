package com.senior.project.backend.Activity;

import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.Milestone;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class MilestoneServiceTest {

    @InjectMocks
    private MilestoneService milestoneService;

    @Mock
    private MilestoneRepository milestoneRepository;


    @Test
    public void testAll() {
        Milestone milestone1 = new Milestone();
        milestone1.setId(1L);
        Milestone milestone2 = new Milestone();
        milestone1.setId(2L);
        List<Milestone> milestones = new ArrayList<>();
        milestones.add(milestone1);
        milestones.add(milestone2);
        when(milestoneRepository.findAll()).thenReturn(milestones);
        Flux<Milestone> result = milestoneService.all();
        StepVerifier.create(result).expectNext(milestone1).expectNext(milestone2).expectComplete().verify();
    }

    @Test
    public void testAllWithTasks() {
        when(milestoneRepository.findAll()).thenReturn(Constants.milestoneDATA);
        Flux<Milestone> result = milestoneService.all();
        StepVerifier.create(result).expectNext(Constants.milestoneDATA.get(0)).expectNext(Constants.milestoneDATA.get(1)).expectComplete().verify();
    }

}
