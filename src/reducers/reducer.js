export default (type, initialData, initialLoading = true) => (state = {
  loading: initialLoading,
  data: initialData || [],
}, action) => {
  switch (action.type) {
    case `REQUEST/${type}`:
      return {
        ...state,
        loading: true,
      };
    case `OK/${type}`:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case `QUERY/${type}`:
      return {
        ...state,
        query: action.query,
      };
    default:
      return state;
  }
};
