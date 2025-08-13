import { toggleWantlistItem, toggleCollectionItem } from "../reducers/discogs";
import { setWantlist, setCollection } from "../reducers/discogs";
import { store } from "./store";

// Récupération de l'url de connexion à l'app discogs
const getAuthorizeUrl = async () => {
  const user = store.getState().user.user;
  const response = await fetch(`http://127.0.0.1:3000/discogs/authorize?email=${user.email}`, {
    credentials: "include",
  });
  return await response.json();
};

// Récupération des infos basiques d'un user discogs
const getIdentity = async () => {
  const response = await fetch("http://127.0.0.1:3000/discogs/identity", {
    credentials: "include",
  });
  return await response.json();
};

// Récupération de la wantlist de vinyles soit sur Discogs soit en BDD Mongo
const getWantlist = async () => {
  const user = store.getState().user.user;
  const discogs = store.getState().discogs;
  let releases = {};

  // Si le user est connecté on récupère sa wantlist depuis Discogs
  if (user.discogs) {
    const response = await fetch(`http://127.0.0.1:3000/discogs/users/${discogs.username}/wantlist`, {
      credentials: "include",
    });
    const datas = await response.json();

    if (datas.result && datas.wantlist.wants.length > 0) {
      releases = datas.wantlist.wants.map((release) => {
        return {
          release_id: release.id,
          title: release.basic_information.title,
          artist: release.basic_information.artists[0].name,
          thumb: release.basic_information.thumb,
        };
      });

      // Permet d'ajouter des releases en BDD Mongo si un user à ajouté des Vinyles à sa wantlist directement depuis Discogs
      setWantedlist(releases);
    } else {
      releases = [];
    }
  } else {
    // Sinon on récupère la collection depuis la BDD Mongo
    const response = await fetch(`http://127.0.0.1:3000/users/wantlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    });
    const datas = await response.json();
    releases = datas.wantlist;
  }

  // Save des ids des releases dans le store discogs pour matcher tout le long de l'application
  const ids = releases.map((item) => item.release_id);
  store.dispatch(setWantlist(ids));

  return releases;
};

// Save des releases en BDD dans un sous document User
const setWantedlist = async (releases) => {
  const user = store.getState().user.user;
  await fetch(`http://127.0.0.1:3000/users/set-wantlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email, releases }),
  });
};

// Ajout ou suppression d'une release wantlist côté Discogs et BDD Mongo
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

  // Promise all pour être sur que les deux suppressions se fassent bien, si une foire ca stop tout
  await Promise.all([mongoPromise(), discogsPromise()]);
  store.dispatch(toggleWantlistItem(release_id));
};

// Récupération de la collection de vinyles soit sur Discogs soit en BDD Mongo
const getCollection = async () => {
  const user = store.getState().user.user;
  const discogs = store.getState().discogs;
  let releases = {};

  // Si le user est connecté on récupère sa collection depuis Discogs
  if (user.discogs) {
    const response = await fetch(`http://127.0.0.1:3000/discogs/users/${discogs.username}/collection`, {
      credentials: "include",
    });
    const datas = await response.json();

    if (datas.result && datas.collection.releases.length > 0) {
      releases = datas.collection.releases.map((release) => {
        return {
          release_id: release.id,
          title: release.basic_information.title,
          artist: release.basic_information.artists[0].name,
          thumb: release.basic_information.thumb,
        };
      });

      // Permet d'ajouter des releases en BDD Mongo si un user à ajouté des Vinyles à sa collection directement depuis Discogs
      setCollectionList(releases);
    } else {
      releases = [];
    }
  } else {
    // Sinon on récupère la collection depuis la BDD Mongo
    const response = await fetch(`http://127.0.0.1:3000/users/collection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    });
    const datas = await response.json();

    releases = datas.collection;
  }

  // Save des ids des releases dans le store discogs pour matcher tout le long de l'application
  const ids = releases.map((item) => item.release_id);
  store.dispatch(setCollection(ids));

  return releases;
};

// Save des releases en BDD dans un sous document User
const setCollectionList = async (releases) => {
  const user = store.getState().user.user;
  await fetch(`http://127.0.0.1:3000/users/set-collection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email, releases }),
  });
};

// Ajout ou suppression d'une release collection côté Discogs et BDD Mongo
const toggleCollection = async (action, release_id) => {
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

    const response = await fetch(`http://127.0.0.1:3000/users/toggle-collection`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, email: user.email, release: save_release }),
    });
    return await response.json();
  };

  // Toggle dans discogs
  const discogsPromise = async () => {
    if (!user.discogs) return;

    const response = await fetch(`http://127.0.0.1:3000/discogs/users/${discogs.username}/collection/${release_id}`, {
      method: action === "add" ? "PUT" : "DELETE",
      credentials: "include",
    });
    return await response.json();
  };

  // Promise all pour être sur que les deux suppressions se fassent bien, si une foire ca stop tout
  await Promise.all([mongoPromise(), discogsPromise()]);
  store.dispatch(toggleCollectionItem(release_id));
};

// Récupère une release depuis l'API Discogs
const getRelease = async (release_id) => {
  const response = await fetch(`http://127.0.0.1:3000/discogs/releases/${release_id}`);
  return await response.json();
};

// Recherche sur l'API Discogs
const search = async (body) => {
  const response = await fetch(`http://127.0.0.1:3000/discogs/database/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  return await response.json();
};

module.exports = { getAuthorizeUrl, getIdentity, getCollection, getWantlist, toggleWantlist, getRelease, setWantedlist, toggleCollection, setCollectionList, search };
