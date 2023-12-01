package com.senior.project.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import com.senior.project.backend.security.webfilters.AuthExpiredHandlerFilter;

/**
 * Abstract class for routers to extends from
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
public abstract class AbstractRouter {

    // Universal filters
    private AuthExpiredHandlerFilter authExpiredHandlerFilter;

    /**
     * Wrapper for the router functions that apply the handler function filters
     * @param routes - the completed route function
     * @return - routes with the filters applied
     */
    protected RouterFunction<ServerResponse> wrapRoutes(RouterFunction<ServerResponse> routes) {
        return routes
            .filter(authExpiredHandlerFilter);
    }

    /**
     * Dependency injector for the auth expired handler filter
     * @param authExpiredHandlerFilter - the filter being injected
     */
    @Autowired
    public final void setAuthExpiredHandlerFilter(AuthExpiredHandlerFilter authExpiredHandlerFilter) {
        this.authExpiredHandlerFilter = authExpiredHandlerFilter;
    }
}
