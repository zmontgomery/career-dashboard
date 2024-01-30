package com.senior.project.backend.Portfolio;

import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;


@Component
public class ArtifactHandler {

    private final ArtifactService artifactService;

    public ArtifactHandler(ArtifactService artifactService){
        this.artifactService = artifactService;
    }

    public Mono<ServerResponse> handleFileUpload(ServerRequest request) {
        return request.multipartData()
                .map(parts -> parts.toSingleValueMap().get("file"))
                .filter(part -> part instanceof FilePart)
                .map(part -> (FilePart) part)
                .flatMap(artifactService::processFile)
                .flatMap(response -> ServerResponse.ok()
                        // https://github.com/spring-projects/spring-ws/issues/1128
                        // There seems to be a bug where you can't convert a single string to valid json
                        // return plain text instead and handle it in angular instead.
                        // Want to explicitly return plain text so if this is ever fixed in a
                        // spring update it won't break
                        .contentType(MediaType.TEXT_PLAIN)
                        .bodyValue(response));
    }
}
