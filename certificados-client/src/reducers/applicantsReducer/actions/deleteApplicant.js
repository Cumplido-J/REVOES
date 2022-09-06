export const DELETE_APPLICANT = "APPLICANTS/DELETE_APPLICANT";

export function deleteApplicant(applicantId) {
  return {
    type: DELETE_APPLICANT,
    applicantId,
  };
}
