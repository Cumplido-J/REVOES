export const SET_TEACHER_BINNACLE = "BINNACLE/SET_TEACHER_BINNACLE";

export function setTeacherBinnacle(periodNum, periodData) {
  return {
    type: SET_TEACHER_BINNACLE,
    periodNum,
    periodData,
  };
}
