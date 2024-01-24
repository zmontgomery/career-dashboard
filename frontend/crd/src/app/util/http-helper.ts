export enum Endpoints {
    SIGN_IN = 'auth/signIn',
    MILESTONES = 'milestones',
    DASHBOARD_EVENTS = 'dashboard_events',
    RESUME = 'portfolio/resume',
    TASKS = 'tasks',
    //DASHBOARD_TASKS = 'dashboard_tasks'
}

export function constructBackendRequest(segments: string, ...qParams: Array<{key: string, value: string | number}>): string {
    let uri = `http://localhost:8080/api/${segments}`;

    // Append params
    if (qParams.length > 0) uri += '?';
    qParams.forEach((param, i) => {
        uri += `${param.key}=${param.value}`;
        if (i != qParams.length - 1) uri += '&';
    });

    // Enocde
    uri = encodeURI(uri);

    return uri;
}
