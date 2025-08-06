import { useEffect, useState } from "react";

function Homepage() {
  const [wantlist, setWantlist] = useState([]);

  useEffect(() => {
    (async () => {
      let response = await fetch("http://127.0.0.1:3000/discogs/identity", {
        credentials: "include",
      });
      let datas = await response.json();
      console.log(datas);
      const { username } = datas.identity;

      response = await fetch(`http://127.0.0.1:3000/discogs/users/${username}/wantlist`, {
        credentials: "include",
      });
      datas = await response.json();
      console.log(datas);
      setWantlist(datas.wantlist.wants);
    })();
  }, []);

  return (
    <section>
      <h1>Homepages</h1>
      <main>
        {wantlist.length > 0 &&
          wantlist.map((release, i) => {
            return (
              <div key={i}>
                <img src={release.basic_information.thumb} alt={release.basic_information.title} />
                <h2>{release.basic_information.title}</h2>
                <p>{release.basic_information.artists[0].name}</p>
              </div>
            );
          })}
      </main>
    </section>
  );
}

export default Homepage;
