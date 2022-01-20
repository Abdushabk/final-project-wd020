import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "../../loading.css";
import "./_Page.css";

const MyRecipes = ({ APPDATA }) => {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const [recipes, setRecipes] = useState([]);
  const [thisUserLikes, setThisUserLikes] = useState([]);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isLoaded = true;
    if (isLoaded) {
      const getRecipes = async () => {
        try {
          const results = await axios.get(`${APPDATA.BACKEND}/api/recipes/`);
          if (!results.data.tuples) throw new Error("No Recipe Data.");
          setRecipes(results.data.tuples);
          window.scrollTo(0, 0);
        } catch (error) {
          setErr(error.message);
        }
      };
      getRecipes();
    }
    return () => {
      isLoaded = false;
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let isLoaded = true;
    if (currentUser) {
      if (isLoaded) {
        const getUser = async () => {
          try {
            const results = await axios.get(
              `${APPDATA.BACKEND}/api/users/${currentUser.userName}`
            );
            if (!results.data.tuple) throw new Error("No User Data.");
            let res2 = results.data.tuple[0].likes
              ? results.data.tuple[0].likes
              : [];
            setThisUserLikes(res2);
          } catch (error) {
            setErr(error.message);
          }
        };
        getUser();
      }
    }
    return () => {
      isLoaded = false; //           avoids a mem leak (of the promise) on unloaded component
    };
    // eslint-disable-next-line
  }, []);

  if (err)
    return (
      <div className="loading_container">
        <div className="loading"></div>
        <h4 style={{ fontSize: "0.8rem" }}>{err}</h4>
      </div>
    );

  let k = 0;
  let k2 = 0;
  return (
    <div
      className="page-container"
      style={{
        backgroundImage: "url(" + APPDATA.TITLEIMG + ")",
      }}
    >
      <div className="page-title">
        <h2>
          <span>-‧≡ My Recipes ≡‧- </span>
        </h2>
      </div>
      <div
        className="page-box col-10"
        style={{
          width: "90%",
        }}
      >
        <div className="col-11">
          <Tabs>
            <TabList>
              <Tab style={{ backgroundColor: "orange" }}>✍ My Submissions</Tab>
              <Tab style={{ backgroundColor: "lightgreen" }}>
                ✅ My Favourites
              </Tab>
            </TabList>
            <TabPanel
              style={{
                backgroundColor: "#fcf1d3",
                height: "50vh",
                overflowY: "auto",
              }}
            >
              <ul
                style={{
                  listStyle: "none",
                  paddingLeft: "0",
                }}
              >
                {recipes
                  .filter((it) => it.username === currentUser.userName)
                  .map((recipe) => (
                    <li key={k++}>
                      <Link to={`/recipes/${recipe.slug}`} className="link">
                        <pre>
                          <img
                            src={recipe.title_img || recipe.image}
                            style={{ height: "60px" }}
                            alt={k + 1}
                            title={k + 1}
                          />
                          {"  "}
                          <span style={{ fontSize: "1.5rem", color: "black" }}>
                            {recipe.title}
                          </span>
                        </pre>
                      </Link>
                    </li>
                  ))}
              </ul>
            </TabPanel>
            <TabPanel
              style={{
                backgroundColor: "#cdfdc9",
                height: "50vh",
                overflowY: "auto",
              }}
            >
              <ul
                style={{
                  listStyle: "none",
                  paddingLeft: "0",
                }}
              >
                {recipes
                  .filter((it) => thisUserLikes.includes(it.slug))
                  .map((recipe) => (
                    <li key={k2++}>
                      <Link to={`/recipes/${recipe.slug}`} className="link">
                        <pre>
                          <img
                            src={recipe.title_img || recipe.image}
                            style={{ height: "60px" }}
                            alt={k2 + 1}
                            title={k2 + 1}
                          />
                          {"  "}
                          <span style={{ fontSize: "1.5rem", color: "black" }}>
                            {recipe.title}
                          </span>
                        </pre>
                      </Link>
                    </li>
                  ))}
              </ul>
            </TabPanel>
          </Tabs>
        </div>

        {currentUser ? (
          <div>
            <button onClick={() => navigate("/newtitle")}>
              Create a New Recipe
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default MyRecipes;
