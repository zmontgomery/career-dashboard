import { environment } from "src/environments/environment";

export enum Endpoints {
    // Security
    SIGN_IN = 'auth/signin',
    REFRESH = 'auth/refresh',
    SIGN_OUT = 'auth/signout',

    // student
    MILESTONES = 'milestones',
    CREATE_MILESTONE = 'admin/create-milestone',
    EVENTS = 'events',
    DASHBOARD_EVENTS = 'dashboard_events',
    TASKS = 'tasks',
    USERS = 'users',
    CURRENT_USER = 'current-user',
    SUBMISSION = 'tasks/submission',

    // Artifacts
    ARTIFACT = 'artifact/',
    ARTIFACT_FILE = 'artifact/file',
    
    //DASHBOARD_TASKS = 'dashboard_tasks'
    CREATE_TASK = 'admin/create-task',
    PORTFOLIO = 'portfolio',

    // faculty
    USERS_SEARCH = 'users/search',

    // admin
    EDIT_MILESTONE = 'admin/edit-milestone',
    EDIT_TASK = 'admin/edit-task',
}

export function constructBackendRequest(segments: string, ...qParams: Array<{key: string, value: string | number}>): string {
    let uri = `${environment.requestURI}/api/${segments}`;

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
