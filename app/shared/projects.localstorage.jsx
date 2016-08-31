/**
 * PROJECTS STORAGE
 */
export const storageGetProjects = () => window.localStorage.getItem('projects');

export const storageSetProjects = (projects) => window.localStorage.setItem('projects', projects);

/**
 * LATEST PROJECTS
 */
export const storageGetProjects = () => window.localStorage.getItem('latestProjects');

export const storageSetProjects = (latestProjects) => window.localStorage.setItem('latestProjects', latestProjects);
