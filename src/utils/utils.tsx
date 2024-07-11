export function uppercaseStatusToText(state: string) {
  state = state
    .toLowerCase()
    .replace(/_/g, " ");
  state = state.charAt(0).toUpperCase() + state.slice(1);
  return state;
}

export function toDateString(date: string) {
  if (date) {
    const d = new Date(date);
    return new Intl.DateTimeFormat("en-GB").format(d);
  } else {
    return null;
  }
}

export type ConfirmModalType = {
  confirmTitle: string,
  confirmQuestion: string,
  confirmBtnLabel: string,
  cancelBtnLabel: string
}

export const confirmModalData : {[key: string] : ConfirmModalType} = {
  "ACCEPTED": {
      confirmTitle: "Response Confirmation",
      confirmQuestion: 'Do you want to accept this assignment?',
      confirmBtnLabel: 'Yes',
      cancelBtnLabel: 'No'
  },
  "DECLINED": {
      confirmTitle: "Response Confirmation",
      confirmQuestion: 'Do you want to decline this assignment?',
      confirmBtnLabel: 'Yes',
      cancelBtnLabel: 'No'
  },
  "RETURNING": {
      confirmTitle: "Returning Confirmation",
      confirmQuestion: "Do you want to create a returning request for this asset?",
      confirmBtnLabel: 'Yes',
      cancelBtnLabel: 'No'
  },
}