package com.senior.project.backend.portfolio;

import com.senior.project.backend.Constants;
import com.senior.project.backend.Portfolio.ArtifactHandler;
import com.senior.project.backend.Portfolio.ArtifactService;
import com.senior.project.backend.domain.Artifact;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.server.RouterFunctions;
import java.io.IOException;
import java.util.List;

import org.springframework.core.io.ByteArrayResource;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ArtifactHandlerTest {

    private WebTestClient webTestClient;

    @InjectMocks
    private ArtifactHandler artifactHandler;

    @Mock
    private ArtifactService artifactService;

    @BeforeEach
    public void setup() {
        webTestClient = WebTestClient.bindToRouterFunction(RouterFunctions.route()
                        .POST("/test", artifactHandler::handleFileUpload)
                        .GET("/test/{artifactID}", artifactHandler::servePdf)
                        .GET("/all", artifactHandler::all)
                        .build())
                .build();
    }

    @Test
    public void testHandleFileUpload() throws IOException {

//        IDK how to test this

//        when(artifactService.processFile(any())).thenReturn(Mono.just("test"));

//        ByteArrayResource resource = new ByteArrayResource("contentBytes".getBytes());
//
//        MimeType mimeType = MimeTypeUtils.TEXT_PLAIN;
//        FilePart filePart = new FilePart("file", "filename", resource, mimeType);
//        return new FormDataPart("file", filePart);
        // Create FilePart
//        FilePart filePart = new FilePart("file", resource, resource.getClass(), null);
//        FilePart filePart = new MockMultipartFile("file", "filename", "text/plain", "contentBytes".getBytes());
//        FilePart filePart = mock(FilePart.class);
//        when(filePart.transferTo((File) any())).thenReturn(Mono.empty());
//        when(filePart.transferTo((Path) any())).thenReturn(Mono.empty());

//        MockServerRequest request = MockServerRequest.builder()
//                .header(HttpHeaders.CONTENT_TYPE, MediaType.MULTIPART_FORM_DATA_VALUE)
//                .body(BodyInserters.fromMultipartData("file", filePart));
//
//        Mono<ServerResponse> responseMono = artifactHandler.handleFileUpload(request);
//        assertNotNull(responseMono);
//        StepVerifier.create(responseMono).expectNext("test").expectComplete().verify();

//        MockMultipartFile mockMultipartFile = new MockMultipartFile(
//                "multipartFile",
//                "test.pdf",
//                "application/pdf",
//                new ClassPathResource("test.pdf").getInputStream());

//        FilePart filePart = mock(FilePart.class);
//        when(filePart.filename()).thenReturn("TestImage.png");
//
//        File file = new File(filePart.filename());
//        var multi = new MockMultipartFile("name", "content".getBytes());
//
//        String result = webTestClient.post()
//                .uri("/test")
//                .header(HttpHeaders.CONTENT_TYPE, MediaType.MULTIPART_FORM_DATA_VALUE)
//                .body(BodyInserters.fromMultipartData("file", multi))
//                .exchange().expectStatus().isOk()
//                .expectBody(String.class).returnResult().getResponseBody();
//        assertNotNull(result);
//        assertEquals("test", result);
    }

    @Test
    public void testServePdf() {
        // Mock response entity
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        byte[] pdfContent = "Your PDF Content".getBytes();
        ByteArrayResource resource = new ByteArrayResource(pdfContent);
        ResponseEntity<Resource> responseEntity = new ResponseEntity<>(resource, headers, HttpStatus.OK);

        // Mock artifactService
        when(artifactService.getFile(anyString(), any())).thenReturn(Mono.just(responseEntity));

        // Perform the request
        webTestClient.get().uri("/test/1")
                .exchange()
                .expectStatus().isOk()
                .expectHeader().contentType(MediaType.APPLICATION_PDF)
                .expectBody(byte[].class)
                .isEqualTo(pdfContent);
    }

    @Test
    public void testAll() {
        Flux<Artifact> eventFlux = Flux.just(Constants.artifact1, Constants.artifact2);
        when(artifactService.all()).thenReturn(eventFlux);
        List<Artifact> result = webTestClient.get().uri("/all").exchange().expectStatus().isOk()
                .expectBodyList(Artifact.class).returnResult().getResponseBody();
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(Constants.artifact1.getId(), result.get(0).getId());
        assertEquals(Constants.artifact2.getId(), result.get(1).getId());
    }
}
