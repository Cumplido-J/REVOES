export const DELETE_GROUP_FROM_UNAPPROVED =
  "GROUPS/DELETE_GROUP_FROM_UNAPPROVED";

export function deleteGroupFromUnapproved(group) {
  return {
    type: DELETE_GROUP_FROM_UNAPPROVED,
    group,
  };
}
