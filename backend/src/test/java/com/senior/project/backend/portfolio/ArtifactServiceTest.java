package com.senior.project.backend.portfolio;

import com.senior.project.backend.Constants;
import com.senior.project.backend.Portfolio.ArtifactRepository;
import com.senior.project.backend.Portfolio.ArtifactService;
import com.senior.project.backend.domain.Artifact;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.core.io.buffer.DefaultDataBufferFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.lang.reflect.Field;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ArtifactServiceTest {

    @InjectMocks
    private ArtifactService artifactService;

    @Mock
    private ArtifactRepository artifactRepository;

    @Test
    public void testProcessFile() throws NoSuchFieldException, IllegalAccessException {
        when(artifactRepository.save(any())).thenReturn(new Artifact());

        FilePart filePart = mock(FilePart.class);

        DataBufferFactory dataBufferFactory = new DefaultDataBufferFactory();
        DataBuffer dataBuffer = dataBufferFactory.wrap("file content".getBytes());
        when(filePart.content()).thenReturn(Flux.just(dataBuffer));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        when(filePart.headers()).thenReturn(headers);

        when(filePart.transferTo((Path) any())).thenReturn(Mono.empty());

        // Use reflection to set the value of uploadDirectory
        Field uploadDirectoryField = ArtifactService.class.getDeclaredField("uploadDirectory");
        uploadDirectoryField.setAccessible(true); // Make the private field accessible
        uploadDirectoryField.set(artifactService, "/mocked/upload/directory");

        Mono<String> result = artifactService.processFile(filePart);
        StepVerifier.create(result).expectNext("File uploaded successfully").expectComplete().verify();
    }

    @Test
    public void testProcessFileToLarge(){
        FilePart filePart = mock(FilePart.class);

        DataBufferFactory dataBufferFactory = new DefaultDataBufferFactory();
        long bufferSize = 10 * 1024 * 1024 + 1;
        byte[] bufferContent = new byte[(int) bufferSize];
        DataBuffer dataBuffer = dataBufferFactory.wrap(bufferContent);

        when(filePart.content()).thenReturn(Flux.just(dataBuffer));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> artifactService.processFile(filePart).block());

        assertEquals(HttpStatus.PAYLOAD_TOO_LARGE, exception.getStatusCode());
    }

    @Test
    public void testProcessFileWrongContentType() {
        FilePart filePart = mock(FilePart.class);

        DataBufferFactory dataBufferFactory = new DefaultDataBufferFactory();
        DataBuffer dataBuffer = dataBufferFactory.wrap("file content".getBytes());
        when(filePart.content()).thenReturn(Flux.just(dataBuffer));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        when(filePart.headers()).thenReturn(headers);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> artifactService.processFile(filePart).block());

        assertEquals(HttpStatus.UNSUPPORTED_MEDIA_TYPE, exception.getStatusCode());
    }

    @Test
    public void testProcessFileNoContentType() {
        FilePart filePart = mock(FilePart.class);

        DataBufferFactory dataBufferFactory = new DefaultDataBufferFactory();
        DataBuffer dataBuffer = dataBufferFactory.wrap("file content".getBytes());
        when(filePart.content()).thenReturn(Flux.just(dataBuffer));

        HttpHeaders headers = new HttpHeaders();
        when(filePart.headers()).thenReturn(headers);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> artifactService.processFile(filePart).block());

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    public void testGetFileFailPathCheck() {
        when(artifactRepository.findById(any())).thenReturn(Optional.ofNullable(Constants.artifact2));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> artifactService.getFile("1", headers).block());

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }

    @Test
    public void testGetFile() {
        when(artifactRepository.findById(any())).thenReturn(Optional.ofNullable(Constants.artifact1));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);

        var result = artifactService.getFile("1", headers).block();

        assert result != null;
        assertTrue(result.getStatusCode().is2xxSuccessful());
        assertEquals(headers, result.getHeaders());
        var expectedBody = new FileSystemResource(Paths.get(Constants.artifact1.getFileLocation()).toAbsolutePath().normalize());
        assertEquals(expectedBody, result.getBody());
    }


}
