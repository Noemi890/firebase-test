import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { db, auth, storage } from "./config/firebase";
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setMovieList] = useState([]);

  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);
  const [updateMovieTitle, setUpdateMovieTitle] = useState("")

  const [fileUpload, setFileUpload] = useState(null)

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
  // eslint-disable-next-line
  }, []);
  

  const submitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid
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

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`)
    try {
      await uploadBytes(filesFolderRef, fileUpload)
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
      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>upload file</button>
      </div>
    </div>
  );
}

export default App;
