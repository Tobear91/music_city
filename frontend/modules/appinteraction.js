import { store } from "./store";
import { leaveBuilding } from "../reducers/character";

const leaveApplication = (router, beforeLeave) => {
    store.dispatch(leaveBuilding());
    router.push({
    pathname: '/',
    query: { fromLeaveScreen: 'true' },
  });
};

export { leaveApplication };