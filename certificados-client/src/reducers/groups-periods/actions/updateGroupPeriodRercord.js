export const UPDATE_GROUPS_PERIOD_RECORD =
  "GROUPS_PERIODS/UPDATE_GROUPS_PERIOD_RECORD";

export function updateGroupsPeriodRecord(group) {
  return {
    type: UPDATE_GROUPS_PERIOD_RECORD,
    group,
  };
}
