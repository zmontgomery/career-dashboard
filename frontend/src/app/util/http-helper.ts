import { environment } from 'src/environments/environment';

export enum Endpoints {
  // Security
  SIGN_IN = 'auth/signin',
  REFRESH = 'auth/refresh',
  SIGN_OUT = 'auth/signout',
  SIGN_UP = 'auth/signup',

  // student
  MILESTONES = 'milestones',
  MILESTONES_COMPLETE = 'milestones/complete',
  EVENTS = 'events',
  DASHBOARD_EVENTS = 'dashboard-events',
  DASHBOARD_TASKS = 'dashboard-tasks',
  TASKS = 'tasks',
  USERS = 'users',
  UPDATE_ROLES = 'users/roles',
  CURRENT_USER = 'current-user',
  SUBMISSION = 'tasks/submission',
  ALL_SUBMISSIONS = 'student/submission',
  EDIT_EDUCATION = 'student/education',

  // Artifacts
  ARTIFACT = 'artifact/',
  ARTIFACT_FILE = 'artifact/file',
  UPLOAD_IMAGE_EVENT = 'artifact/event',
  IMAGE_EVENT = 'artifact/image',
  USERS_PROFILE_PICTURE = 'artifact/profile-picture',

  //DASHBOARD_TASKS = 'dashboard_tasks'
  PORTFOLIO = 'portfolio',

  // faculty
  USERS_SEARCH = 'users/search',
  FACULTY_SUBMISSIONS = 'faculty/milestones',

  // admin
  EDIT_MILESTONE = 'admin/edit-milestone',
  CREATE_MILESTONE = 'admin/create-milestone',
  EDIT_TASK = 'admin/edit-task',
  CREATE_TASK = 'admin/create-task',
  EDIT_EVENT = 'admin/edit-event',
  CREATE_EVENT = 'admin/create-event',
}

export function constructBackendRequest(
  segments: string,
  ...qParams: Array<{ key: string; value: string | number }>
): string {
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
