export const DELETE_GROUPS_PERIOD_RECORD =
  "GROUPS_PERIODS/DELETE_GROUPS_PERIOD_RECORD";

export function deleteGroupsPeriodRecord(id) {
  return {
    type: DELETE_GROUPS_PERIOD_RECORD,
    id,
  };
}
