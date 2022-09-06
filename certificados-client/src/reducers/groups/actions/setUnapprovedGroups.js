export const SET_UNAPPROVED_GROUPS = "GROUPS/SET_UNAPPROVED_GROUPS";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
 * */
export function setUnapprovedGroups(unapprovedGroups) {
  return {
    type: SET_UNAPPROVED_GROUPS,
    unapprovedGroups
  };
}
