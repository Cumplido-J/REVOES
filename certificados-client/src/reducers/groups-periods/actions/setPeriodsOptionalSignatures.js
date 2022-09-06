export const SET_PERIODS_OPTIONAL_SIGNATURES =
  "GROUPS_PERIODS/SET_PERIODS_OPTIONAL_SIGNATURES";

export function setPeriodsOptionalSignatures(list, selected) {
  return {
    type: SET_PERIODS_OPTIONAL_SIGNATURES,
    list,
    selected,
  };
}
