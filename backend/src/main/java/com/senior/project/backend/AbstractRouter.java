package com.senior.project.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.security.webfilters.AuthExpiredHandlerFilter;

public abstract class AbstractRouter {

    private AuthExpiredHandlerFilter authExpiredHandlerFilter;

    protected RouterFunction<ServerResponse> wrapRoutes(RouterFunction<ServerResponse> routes) {
        return routes
            .filter(authExpiredHandlerFilter);
    }

    @Autowired
    public final void setAuthExpiredHandlerFilter(AuthExpiredHandlerFilter authExpiredHandlerFilter) {
        this.authExpiredHandlerFilter = authExpiredHandlerFilter;
    }
}
