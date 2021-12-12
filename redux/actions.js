export const SET_OPTION = 'SET_OPTION';

export const setOption = option => dispatch => {
    dispatch({
        type: SET_OPTION,
        payload: option,
    })
}