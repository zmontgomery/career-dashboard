package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Milestone;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
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
        List<Milestone> result = webTestClient.get().uri("/api/milestones").exchange().expectStatus().isOk()
                .expectBodyList(Milestone.class).returnResult().getResponseBody();
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(milestone1, result.get(0));
        assertEquals(milestone2, result.get(1));
    }
}
