import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { db } from "./config/firebase";
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

function App() {
  const [movieList, setMovieList] = useState([]);

  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);
  const [updateMovieTitle, setUpdateMovieTitle] = useState("")

  const moviesCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);
  //

  const submitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
      });

      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, 'movies', id)
    try {
      await deleteDoc(movieDoc)

      getMovieList()
    } catch (err) {
      console.error(err)
    }
  }

  const updateTitle = async (id) => {
    const movieDoc = doc(db, 'movies', id)
    try {
      await updateDoc(movieDoc, {title: updateMovieTitle})

      getMovieList()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="App">
      <Auth />
      <div>
        <input
          placeholder="movie title.."
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder="release date.."
          type="number"
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={isNewMovieOscar}
          onChange={(e) => setIsNewMovieOscar(e.target.checked)}
        />
        <label>Received an Oscar</label>
        <button onClick={submitMovie}>Submit Movie</button>
      </div>
      <div>
        {movieList.map((movie, i) => {
          return (
            <div key={i}>
              <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
                {movie.title}
              </h1>
              <p> Date: {movie.releaseDate}</p>
              <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>
              <input placeholder="new title.." onChange={(e) => setUpdateMovieTitle(e.target.value)}/>
              <button onClick={() => updateTitle(movie.id)}>update title</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
