import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Login from "./routes/Login";
import Layout from './components/Layout';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './components/firebase';
import FullScreen from './components/Loaders';
import Home from './routes/Home';
import Courses from './routes/Courses';
import Attendance from './routes/Attendance';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
  }, []);

  return <Router>
    <Layout>
      {isAuthenticated === null ? <FullScreen />
        : isAuthenticated ?
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
          : <Login />
      }
    </Layout>
  </Router>
}

export default App