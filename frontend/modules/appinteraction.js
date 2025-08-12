import { store } from "./store";
import { leaveBuilding } from "../reducers/character";

const leaveApplication = (router) => {
  store.dispatch(leaveBuilding());
  router.push({
    pathname: "/map",
    query: { fromLeaveScreen: "true" },
  });
};

export { leaveApplication };
