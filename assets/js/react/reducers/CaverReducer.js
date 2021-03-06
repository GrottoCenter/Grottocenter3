import {
  GET_ADMINS,
  GET_ADMINS_FAILURE,
  GET_ADMINS_SUCCESS,
  GET_MODERATORS,
  GET_MODERATORS_FAILURE,
  GET_MODERATORS_SUCCESS,
} from '../actions/Caver';

//
//
// D E F A U L T - S T A T E
//
//

const initialState = {
  errorMessages: [],
  isLoading: false,
  latestHttpCode: undefined,
  admins: [],
  moderators: [],
};

//
//
// R E D U C E R
//
//
const caver = (state = initialState, action) => {
  switch (action.type) {
    case GET_ADMINS:
    case GET_MODERATORS:
      return {
        ...state,
        isLoading: true,
        errorMessages: [],
        latestHttpCode: undefined,
      };
    case GET_ADMINS_FAILURE:
    case GET_MODERATORS_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorMessages: [action.errorMessage],
      };
    case GET_ADMINS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errorMessages: [],
        admins: action.admins,
      };

    case GET_MODERATORS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errorMessages: [],
        moderators: action.moderators,
      };
    default:
      return state;
  }
};

export default caver;
