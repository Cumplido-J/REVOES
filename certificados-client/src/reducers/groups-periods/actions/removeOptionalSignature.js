export const REMOVE_OPTIONAL_SIGNATURE =
  "GROUPS_PERIODS/REMOVE_OPTIONAL_SIGNATURE";

export function removeOptionalSignature(signature) {
  return {
    type: REMOVE_OPTIONAL_SIGNATURE,
    signature,
  };
}
