import "./App.less";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import Home from "./components/Home";
import Top from "./components/Navigation/Top";
import My404 from "./components/404/Unauthorized";
import Classroom from "./components/Classroom/Classroom";
import AllTask from "./components/Task/AllTask";
import Profile from "./components/Profile/Profile";
import StudentsInClassroom from "./components/Students/StudentsInClassroom";
import AnswerTask from "./components/Task/AnswerTask";
import Scores from "./components/Scores/Scores";
import moment from "moment";
import "moment/locale/id";
import AdminRoute from "./Admin_Route/AdminRoute";
import Admin_Login from "./components/admin/Admin_Login";
import Admin_Dashboard from "./components/admin/Admin_Dashboard";
import Add_Teacher from "./components/admin/AddTeacher/Add_Teacher";
import Admin_Profile from "./components/admin/Profile/Admin_Profile";
import Materi from "./components/Materi/Materi";
import Biodata_Student from "./components/Classroom/Biodata_Student";
import ListScoreStudent from "./components/Students/ListScoreStudent";
import AllScoresTask from "./components/Scores/AllScoresTask";
import ScoreDetail from "./components/Scores/ScoreDetail";
import EdtiScore from "./components/Scores/EditScore";
import ClassroomList from "./components/Classroom/ClassroomList";

function App() {
  moment.locale("id");
  const location = useLocation();
  return (
    <div className="App h-screen ">
      {location.pathname != "/login" &&
        location.pathname != "/register" &&
        !location.pathname.includes("/admin") && <Top />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Admin_Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="*" element={<My404 />} />
        <Route
          path="/admin"
          element={
            <AdminRoute
              redirectTo="/admin/login"
              Component={<Admin_Dashboard />}
            />
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminRoute
              redirectTo="/admin/login"
              Component={<Admin_Profile />}
            />
          }
        />
        <Route
          path="/admin/addteacher"
          element={
            <AdminRoute redirectTo="/admin/login" Component={<Add_Teacher />} />
          }
        />
        <Route
          path="/"
          element={<ProtectedRoute redirectTo="/login" Component={<Home />} />}
        />
        <Route
          path="/classroom/:id"
          element={
            <ProtectedRoute redirectTo="/login" Component={<Classroom />} />
          }
        />
        <Route
          path="/classroom/:id/tasks"
          element={
            <ProtectedRoute redirectTo="/login" Component={<AllTask />} />
          }
        />
        <Route
          path="/classroom/:id/students"
          element={
            <ProtectedRoute
              redirectTo="/login"
              Component={<StudentsInClassroom />}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute redirectTo="/login" Component={<Profile />} />
          }
        />

        <Route
          path="classroom/:class_id/answertask/:id"
          element={
            <ProtectedRoute
              allowRole={"siswa"}
              redirectTo="/login"
              Component={<AnswerTask />}
            />
          }
        />
        <Route
          path="/classroom/:id/scores"
          element={
            <ProtectedRoute
              allowRole={"guru"}
              redirectTo="/login"
              Component={<Scores />}
            />
          }
        />
        <Route
          path="/classroom/:id/materi"
          element={
            <ProtectedRoute redirectTo="/login" Component={<Materi />} />
          }
        />
        <Route
          path="/classroom/:id/student/:user_id"
          element={
            <ProtectedRoute
              redirectTo="/login"
              Component={<Biodata_Student />}
            />
          }
        />
        <Route
          path="/your_score"
          element={
            <ProtectedRoute
              allowRole={"siswa"}
              redirectTo="/login"
              Component={<ListScoreStudent />}
            />
          }
        />
        <Route
          path="/classroom/:id/taskscore/:task_id"
          element={
            <ProtectedRoute
              allowRole={"guru"}
              redirectTo="/login"
              Component={<AllScoresTask />}
            />
          }
        />
        <Route
          path="/classroom/:id/scoredetail/:task_id/:user_id"
          element={
            <ProtectedRoute
              allowRole={"guru"}
              redirectTo="/login"
              Component={<ScoreDetail />}
            />
          }
        />
        <Route
          path="/classroom/:id/editscore/:task_id/:user_id"
          element={
            <ProtectedRoute
              allowRole={"guru"}
              redirectTo="/login"
              Component={<EdtiScore />}
            />
          }
        />
        <Route
          path="/classlist"
          element={
            <ProtectedRoute
              allowRole={"guru"}
              redirectTo="/login"
              Component={<ClassroomList />}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
