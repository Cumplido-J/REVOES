import { SET_TEACHER_BINNACLE } from "./actions/setTeacherBinnacle";

const initialState = {
  1: [],
  2: [],
  3: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_TEACHER_BINNACLE:
      return {
        ...state,
        [action.periodNum]: action.periodData,
      };
  }
}
