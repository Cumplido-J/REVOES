export const TOGGLE_LOADING_APPLICANTS_LIST =
  "APPLICANTS/TOGGLE_LOADING_APPLICANTS_LIST";

/**
 * cambia el valor del loading
 * @returns {{type: string}} Acción
 */
export function toggleLoadingApplicantsList() {
  return { type: TOGGLE_LOADING_APPLICANTS_LIST };
}
