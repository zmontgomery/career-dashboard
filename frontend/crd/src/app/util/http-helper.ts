import { environment } from "src/environments/environment";

export enum Endpoints {
    SIGN_IN = 'auth/signIn',
    MILESTONES = 'milestones',
}

export function constructBackendRequest(segments: string, ...qParams: Array<{key: string, value: string}>): string {
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