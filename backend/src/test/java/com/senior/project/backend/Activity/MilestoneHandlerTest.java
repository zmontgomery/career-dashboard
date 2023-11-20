package com.senior.project.backend.Activity;

import com.senior.project.backend.domain.Milestone;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.server.RouterFunctions;
import reactor.core.publisher.Flux;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class MilestoneHandlerTest {

    private WebTestClient webTestClient;

    @InjectMocks
    private MilestoneHandler milestoneHandler;

    @Mock
    private MilestoneService milestoneService;

    @BeforeEach
    public void setup() {
        webTestClient = WebTestClient.bindToRouterFunction(RouterFunctions.route()
                        .GET("/test", milestoneHandler::all)
                        .build())
                .build();
    }

    @Test
    public void testAll() {
        Milestone milestone1 = new Milestone();
        milestone1.setId(1L);
        Milestone milestone2 = new Milestone();
        milestone2.setId(2L);
        Flux<Milestone> eventFlux = Flux.just(milestone1, milestone2);
        when(milestoneService.all()).thenReturn(eventFlux);
        List<Milestone> result = webTestClient.get().uri("/test").exchange().expectStatus().isOk()
                .expectBodyList(Milestone.class).returnResult().getResponseBody();
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(milestone1.getId(), result.get(0).getId());
        assertEquals(milestone2.getId(), result.get(1).getId());
    }
}
