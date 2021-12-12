import { SET_OPTION } from "./actions";

const initialState = {
    option: 'metric',
}

function optionReducer(state = initialState, action) {
    switch (action.type) {
        case SET_OPTION:
            return { ...state, option: action.payload };
        default:
            return state;
    }
}

export default optionReducer;