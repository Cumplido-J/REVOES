export const SET_APPLICANTS = "APPLICANTS/SET_APPLICANTS";

/**
 * Registro de acción de redux para cargar la lista de applicantes.
 * @param {Array} applicantsList Payload de la función
 * @returns {Object} Objecto con tipo y payload
 */
export function setApplicants(applicantsList = []) {
  return {
    type: SET_APPLICANTS,
    applicantsList,
  };
}
