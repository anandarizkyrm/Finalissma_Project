import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClassroomByTeacherId } from "../actions/classroom";
import { logout } from "../actions/user";
import Class_card from "./Card/Class_card";
import { Spin, Space } from "antd";
import Classroom from "./Classroom/Classroom";

function Home() {
  const Dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const classes = useSelector(
    (state: any) => state.getClassroomByTeacherIdReducers
  );
  const { classroom } = classes;
  const Logout = () => {
    Dispatch(logout());
  };

  React.useEffect(() => {
    Dispatch(getClassroomByTeacherId(user.id));
  }, []);

  console.log(classes, user);

  return (
    <div className="p-6 h-full">
      {/* {user.name}
      {user.role} */}
      <div className="font-header  font-semibold text-gray-500">
        Daftar Kelas Anda
      </div>
      <div className="flex w-full h-screen flex-wrap">
        {!classroom ? (
          <div className="flex justify-center items-center w-full h-full">
            <Space size="middle">
              <Spin size="large" />
            </Space>
          </div>
        ) : (
          classroom.class.map((classroom: any) => {
            return <Class_card key={classroom.id} classroom={classroom} />;
          })
        )}
        {classroom && classroom.class.length === 0 && (
          <div className="text-center text-gray-500 h-full w-full flex items-center justify-center">
            Belum ada kelas yang dibuat
          </div>
        )}
      </div>

      {/* <button onClick={Logout}>Logout</button> */}
    </div>
  );
}

export default Home;
