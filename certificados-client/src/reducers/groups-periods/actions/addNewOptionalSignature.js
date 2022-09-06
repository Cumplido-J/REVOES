export const ADD_NEW_OPTIONAL_SIGNATURE =
  "GROUPS_PERIODS/ADD_NEW_OPTIONAL_SIGNATURE";

export function addNewOptionalSignature(signature) {
  return {
    type: ADD_NEW_OPTIONAL_SIGNATURE,
    signature,
  };
}
