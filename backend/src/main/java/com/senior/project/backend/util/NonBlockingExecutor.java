package com.senior.project.backend.util;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.concurrent.Callable;

public class NonBlockingExecutor {

    public static <T> Mono<T> execute(Callable<T> callable) {
        return Mono.fromCallable(callable)
                .subscribeOn(Schedulers.boundedElastic());
    }

    public static <T> Flux<T> executeMany(Callable<Iterable<? extends T>> callable) {
        return execute(callable).flatMapMany((Flux::fromIterable));
    }
}
