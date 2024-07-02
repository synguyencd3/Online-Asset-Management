export function uppercaseStatusToText(state: string) {
  state = state
    .toLowerCase()
    .replace(/_/g, " ");
  state = state.charAt(0).toUpperCase() + state.slice(1);
  return state;
}