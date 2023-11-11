package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Milestone;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;
import static org.mockito.Mockito.when;

@SpringBootTest
public class MilestoneServiceTest {

    @Autowired
    private MilestoneService milestoneService;

    @MockBean
    private MilestoneRepository milestoneRepository;


    @Test
    public void testAll() {
        Milestone milestone1 = Milestone.builder().id("1").build();
        Milestone milestone2 = Milestone.builder().id("2").build();
        Flux<Milestone> eventFlux = Flux.just(milestone1, milestone2);
        when(milestoneRepository.all()).thenReturn(eventFlux);
        Flux<Milestone> result = milestoneService.all();
        StepVerifier.create(result).expectNext(milestone1).expectNext(milestone2).expectComplete().verify();
    }
}
