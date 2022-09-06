export const SET_GROUPS_TABLE = "GROUPS_PERIODS/SET_GROUP_PERIODS";

export function setGroupsPeriod(groups) {
  return {
    type: SET_GROUPS_TABLE,
    groups,
  };
}
