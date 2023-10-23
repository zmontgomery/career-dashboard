package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Milestone;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;

import static org.mockito.Mockito.when;

@AutoConfigureWebTestClient
@SpringBootTest
public class MilestoneHandlerTest {

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    @MockBean
    private MilestoneService milestoneService;

    @Test
    public void testAll() {
        Milestone milestone1 = Milestone.builder().milestoneID("1").build();
        Milestone milestone2 = Milestone.builder().milestoneID("2").build();
        Flux<Milestone> eventFlux = Flux.just(milestone1, milestone2);
        when(milestoneService.all()).thenReturn(eventFlux);
        webTestClient.get().uri("/api/milestones").exchange().expectStatus().isOk().expectBody();

    }
}
