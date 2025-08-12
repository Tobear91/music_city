import { store } from "./store";
import { toggleWantlistItem } from "../reducers/discogs";
import { setWantlist } from "../reducers/discogs";

const setWantedlist = async (datas_releases) => {
  const user = store.getState().user.user;

  const releases = await Promise.all(
    datas_releases.map(async (release) => {
      return {
        release_id: release.id,
        title: release.basic_information.title,
        artist: release.basic_information.artists[0].name,
        thumb: release.basic_information.thumb,
      };
    })
  );

  const response = await fetch(`http://127.0.0.1:3000/users/set-wantlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email, releases }),
  });

  const datas = await response.json();

  if (datas.result) {
    const ids = datas_releases.map((item) => item.id);
    store.dispatch(setWantlist(ids));
  }
};

const toggleWantlist = async (action, release_id) => {
  const user = store.getState().user.user;
  const discogs = store.getState().discogs;

  // Toggle dans mongo DB
  const mongoPromise = async () => {
    let save_release = {};

    if (action === "add") {
      const search_release = await getRelease(release_id);
      const search = search_release.release;

      save_release = {
        release_id: search.id,
        title: search.title,
        artist: search.artists[0].name,
        thumb: search.thumb,
      };
    } else {
      save_release = {
        release_id,
      };
    }

    const response = await fetch(`http://127.0.0.1:3000/users/toggle-wantlist`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, email: user.email, release: save_release }),
    });
    return await response.json();
  };

  // Toggle dans discogs
  const discogsPromise = async () => {
    if (!user.discogs) return;

    const response = await fetch(`http://127.0.0.1:3000/discogs/users/${discogs.username}/wants/${release_id}`, {
      method: action === "add" ? "PUT" : "DELETE",
      credentials: "include",
    });
    return await response.json();
  };

  await Promise.all([mongoPromise(), discogsPromise()]);
  store.dispatch(toggleWantlistItem(release_id));
};

const getRelease = async (release_id) => {
  const response = await fetch(`http://127.0.0.1:3000/discogs/releases/${release_id}`);
  return await response.json();
};

module.exports = { toggleWantlist, getRelease, setWantedlist };
