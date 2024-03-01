package com.senior.project.backend.portfolio;

import com.senior.project.backend.Activity.EventRepository;
import com.senior.project.backend.artifact.ArtifactRepository;
import com.senior.project.backend.artifact.ArtifactService;
import com.senior.project.backend.Constants;
import com.senior.project.backend.domain.Artifact;
import com.senior.project.backend.security.SecurityUtil;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.core.io.buffer.DefaultDataBufferFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import java.lang.reflect.Field;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.util.List;
import java.util.Optional;
import java.io.File;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ArtifactServiceTest {

    @InjectMocks
    private ArtifactService artifactService;

    @Mock
    private ArtifactRepository artifactRepository;

    @Mock
    private EventRepository eventRepository;

    @Test
    public void testProcessFile() throws NoSuchFieldException, IllegalAccessException {
        FilePart filePart = mock(FilePart.class);

        DataBufferFactory dataBufferFactory = new DefaultDataBufferFactory();
        DataBuffer dataBuffer = dataBufferFactory.wrap("file content".getBytes());
        when(filePart.content()).thenReturn(Flux.just(dataBuffer));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        when(filePart.headers()).thenReturn(headers);

        when(filePart.transferTo((Path) any())).thenReturn(Mono.empty());
        MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class);
        securityUtil.when(() -> SecurityUtil.getCurrentUser()).thenReturn(Mono.just(Constants.user1));
        when(artifactRepository.save(any())).thenReturn(Constants.artifact1);
        when(artifactRepository.findByUniqueIdentifier(anyString())).thenReturn(Optional.of(Constants.artifact1));

        // Use reflection to set the value of uploadDirectory
        Field uploadDirectoryField = ArtifactService.class.getDeclaredField("uploadDirectory");
        uploadDirectoryField.setAccessible(true); // Make the private field accessible
        uploadDirectoryField.set(artifactService, "/mocked/upload/directory");

        Mono<Integer> result = artifactService.processSubmissionFile(filePart);
        result = result.map((a) -> {
            
            securityUtil.close();
            return a;
        });
        StepVerifier.create(result).expectNext(Constants.artifact1.getId()).expectComplete().verify();
    }

    @Test
    public void testProcessFileToLarge(){
        FilePart filePart = mock(FilePart.class);

        DataBufferFactory dataBufferFactory = new DefaultDataBufferFactory();
        long bufferSize = 10 * 1024 * 1024 + 1;
        byte[] bufferContent = new byte[(int) bufferSize];
        DataBuffer dataBuffer = dataBufferFactory.wrap(bufferContent);

        when(filePart.content()).thenReturn(Flux.just(dataBuffer));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> artifactService.processSubmissionFile(filePart).block());

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

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> artifactService.processSubmissionFile(filePart).block());

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

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> artifactService.processSubmissionFile(filePart).block());

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    public void testProcessEventImage() throws NoSuchFieldException, IllegalAccessException {
        when(artifactRepository.save(any())).thenReturn(Artifact.builder().id(1).build());

        FilePart filePart = mock(FilePart.class);

        DataBufferFactory dataBufferFactory = new DefaultDataBufferFactory();
        DataBuffer dataBuffer = dataBufferFactory.wrap("file content".getBytes());
        when(filePart.content()).thenReturn(Flux.just(dataBuffer));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        when(filePart.headers()).thenReturn(headers);

        when(filePart.transferTo((Path) any())).thenReturn(Mono.empty());
        MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class);
        securityUtil.when(() -> SecurityUtil.getCurrentUser()).thenReturn(Mono.just(Constants.user1));
        when(artifactRepository.save(any())).thenReturn(Constants.artifact1);
        when(artifactRepository.findByUniqueIdentifier(any())).thenReturn(Optional.ofNullable(Constants.artifact1));
        when(eventRepository.findById(any())).thenReturn(Optional.ofNullable(Constants.e1));

        // Use reflection to set the value of uploadDirectory
        Field uploadDirectoryField = ArtifactService.class.getDeclaredField("uploadDirectory");
        uploadDirectoryField.setAccessible(true); // Make the private field accessible
        uploadDirectoryField.set(artifactService, "/mocked/upload/directory");

        Mono<Integer> result = artifactService.processEventImage(filePart, Constants.e1.getId());
        result = result.map((a) -> {

            securityUtil.close();
            return a;
        });
        StepVerifier.create(result).expectNext(Constants.artifact1.getId()).expectComplete().verify();
    }

    @Test
    public void testGetFileFailPathCheck() {
        when(artifactRepository.findById(any())).thenReturn(Optional.ofNullable(Constants.artifact2));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        Path artifactPath = Paths.get(Constants.artifact2.getFileLocation());

        ReflectionTestUtils.setField(artifactService, "uploadDirectory", artifactPath.getParent().toAbsolutePath().toString());

        ReflectionTestUtils.setField(artifactService, "uploadDirectory", "");

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> artifactService.getFile("1", headers).block());

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }

    @Test
    public void testGetFile() {
        when(artifactRepository.findById(any())).thenReturn(Optional.ofNullable(Constants.artifact1));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        Path artifact1path = Paths.get(Constants.artifact1.getFileLocation());

        ReflectionTestUtils.setField(artifactService, "uploadDirectory", artifact1path.getParent().toAbsolutePath().toString());

        var result = artifactService.getFile("1", headers).block();

        assert result != null;
        assertTrue(result.getStatusCode().is2xxSuccessful());
        assertEquals(headers, result.getHeaders());
        var expectedBody = new FileSystemResource(artifact1path.toAbsolutePath().normalize());
        assertEquals(expectedBody, result.getBody());
    }

    @Test
    public void testFindById() {
        when(artifactRepository.findById(any())).thenReturn(Optional.of(Constants.artifact1));

        Mono<Artifact> artifacts = artifactService.findById(0);

        StepVerifier.create(artifacts)
            .expectNext(Constants.artifact1)
            .expectComplete()
            .verify();
    }

    @Test
    public void testFindByIdEmpty() {
        when(artifactRepository.findById(any())).thenReturn(Optional.empty());

        Mono<Artifact> artifacts = artifactService.findById(0);

        StepVerifier.create(artifacts)
            .expectComplete()
            .verify();
    }

    @Test
    public void testFindByUniqueFilename() {
        when(artifactRepository.findByUniqueIdentifier(anyString())).thenReturn(Optional.of(Constants.artifact1));

        Mono<Artifact> artifacts = artifactService.findByUniqueFilename("asdf");

        StepVerifier.create(artifacts)
            .expectNext(Constants.artifact1)
            .expectComplete()
            .verify();
    }

    @Test
    public void testFindByUniqueFilenameEmpty() {
        when(artifactRepository.findByUniqueIdentifier(anyString())).thenReturn(Optional.empty());

        Mono<Artifact> artifacts = artifactService.findByUniqueFilename("asdf");

        StepVerifier.create(artifacts)
            .expectComplete()
            .verify();
    }

    @Test
    public void testDeleteFileInternalName() {
        when(artifactRepository.findByUniqueIdentifier(anyString())).thenReturn(Optional.of(Constants.artifact1));
        MockedStatic<SecurityUtil> securityUtils = mockStatic(SecurityUtil.class);
        MockedStatic<Paths> paths = mockStatic(Paths.class);
        MockedStatic<Files> files = mockStatic(Files.class);
        paths.when(() -> Paths.get(any())).thenReturn(null);
        files.when(() -> Files.deleteIfExists(any())).thenReturn(true);
        securityUtils.when(() -> SecurityUtil.getCurrentUser()).thenReturn(Mono.just(Constants.user1));
        Mono<String> result = artifactService.deleteFile("asdf");

        result = result.map((r) -> {
            paths.close();
            files.close(); 
            securityUtils.close();   
            return r;
        });

        StepVerifier.create(result)
            .expectNext("File deleted successfully")
            .expectComplete()
            .verify();
    }

    @Test
    public void testDeleteFileInternalNameEmpty() {
        when(artifactRepository.findByUniqueIdentifier(any())).thenReturn(Optional.empty());
        MockedStatic<SecurityUtil> securityUtils = mockStatic(SecurityUtil.class);
        securityUtils.when(() -> SecurityUtil.getCurrentUser()).thenReturn(Mono.just(Constants.user1));
        Mono<String> result = artifactService.deleteFile("asdf");

        Mono<String> newResult = result.switchIfEmpty(Mono.just("").flatMap((s) -> {
            securityUtils.close();
            return result;
        }));

        StepVerifier.create(newResult)
            .expectComplete()
            .verify();
    }

    @Test
    public void testDeleteFileId() {
        when(artifactRepository.findById(any())).thenReturn(Optional.of(Constants.artifact1));
        MockedStatic<SecurityUtil> securityUtils = mockStatic(SecurityUtil.class);
        MockedStatic<Paths> paths = mockStatic(Paths.class);
        MockedStatic<Files> files = mockStatic(Files.class);
        paths.when(() -> Paths.get(any())).thenReturn(null);
        files.when(() -> Files.deleteIfExists(any())).thenReturn(true);
        securityUtils.when(() -> SecurityUtil.getCurrentUser()).thenReturn(Mono.just(Constants.user1));
        Mono<String> result = artifactService.deleteFile(2);

        result = result.map((r) -> {
            paths.close();
            files.close(); 
            securityUtils.close();   
            
            return r;
        });

        StepVerifier.create(result)
            .expectNext("File deleted successfully")
            .expectComplete()
            .verify();
    }

    @Test
    public void testDeleteFileIdArtfact1() {
        Mono<String> result = artifactService.deleteFile(1);

        StepVerifier.create(result)
            .expectNext("Success")
            .expectComplete()
            .verify();
    }

    @Test
    public void testDeleteFileIdEmpty() {
        when(artifactRepository.findById(any())).thenReturn(Optional.empty());
        MockedStatic<SecurityUtil> securityUtils = mockStatic(SecurityUtil.class);
        securityUtils.when(() -> SecurityUtil.getCurrentUser()).thenReturn(Mono.just(Constants.user1));
        Mono<String> result = artifactService.deleteFile(2);

        Mono<String> newResult = result.switchIfEmpty(Mono.just("").flatMap((s) -> {
            securityUtils.close();
            return result;
        }));

        StepVerifier.create(newResult)
            .expectComplete()
            .verify();
    }

    @Test
    public void testDeleteFile() {
        MockedStatic<Paths> paths = mockStatic(Paths.class);
        MockedStatic<Files> files = mockStatic(Files.class);
        paths.when(() -> Paths.get(any())).thenReturn(null);
        files.when(() -> Files.deleteIfExists(any())).thenReturn(true);
        Mono<String> result = artifactService.deleteFile(Constants.artifact1, Constants.user1);

        result = result.map((r) -> {
            paths.close();
            files.close(); 
            return r;
        });

        StepVerifier.create(result)
            .expectNext("File deleted successfully")
            .expectComplete()
            .verify();
    }

    @Test
    public void testDeleteFileNotUser() {
        Mono<String> result = artifactService.deleteFile(Constants.artifact2, Constants.user1);

        StepVerifier.create(result)
            .expectError(ResponseStatusException.class);
    }

    @Test
    public void testDeleteFileUserNotAdmin() {
        Mono<String> result = artifactService.deleteFile(Constants.artifact2, Constants.user2);

        StepVerifier.create(result)
            .expectError(ResponseStatusException.class);
    }

    @SuppressWarnings("resource")
    @Test
    public void testInitArtifacts() {
        MockedStatic<Paths> paths = mockStatic(Paths.class);
        MockedStatic<Files> files = mockStatic(Files.class);
        Path path = mock(Path.class);
        File file = mock(File.class);
        when(artifactRepository.count()).thenReturn(0l);
        when(artifactRepository.saveAndFlush(any())).thenReturn(Constants.artifact1);
        paths.when(() -> Paths.get(any())).thenReturn(path);
        files.when(() -> Files.exists(any())).thenReturn(true);
        files.when(() -> Files.walk(any())).thenReturn(List.of(path).stream());
        when(path.toFile()).thenReturn(file);
        when(file.delete()).thenReturn(true);
        files.when(() -> Files.createDirectories(any())).thenReturn(path);

        ReflectionTestUtils.invokeMethod(artifactService, "initArtifacts");

        verify(artifactRepository, times(1)).count();
        verify(path, times(1)).toFile();
        verify(file, times(1)).delete();
        verify(artifactRepository, times(1)).saveAndFlush(any());
        
        paths.close();
        files.close();
    }

    @SuppressWarnings("resource")
    @Test
    public void testInitArtifactsError() {
        MockedStatic<Paths> paths = mockStatic(Paths.class);
        MockedStatic<Files> files = mockStatic(Files.class);
        Path path = mock(Path.class);
        File file = mock(File.class);
        when(artifactRepository.count()).thenReturn(0l);
        paths.when(() -> Paths.get(any())).thenReturn(path);
        files.when(() -> Files.exists(any())).thenReturn(true);
        files.when(() -> Files.walk(any())).thenThrow(IOException.class);

        ReflectionTestUtils.invokeMethod(artifactService, "initArtifacts");

        verify(path, times(0)).toFile();
        verify(file, times(0)).delete();
        verify(artifactRepository, times(0)).saveAndFlush(any());
        
        paths.close();
        files.close();
    }
}
