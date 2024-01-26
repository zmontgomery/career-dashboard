package com.senior.project.backend;

import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

/**
 * Abstract class for routers to extends from
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
public abstract class AbstractRouter {

    /**
     * Wrapper for the router functions that apply the handler function filters
     * @param routes - the completed route function
     * @return - routes with the filters applied
     */
    protected RouterFunction<ServerResponse> wrapRoutes(RouterFunction<ServerResponse> routes) {
        return routes;
    }
}
