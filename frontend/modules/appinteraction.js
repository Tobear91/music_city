import { store } from "./store";
import { leaveBuilding } from "../reducers/character";

const leaveApplication = (router) => {
  store.dispatch(leaveBuilding());
  router.push("/map");
};

export { leaveApplication };
