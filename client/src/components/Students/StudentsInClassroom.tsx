import React from "react";
import StudentsCard from "./StudentsCard";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getClassroom, getStudentsinClassroom } from "../../actions/classroom";
import { Spin } from "antd";
import { getUser } from "../../actions/user";
import AvatarCustom from "../Avatar/AvatarCustom";
import DynamicError from "../404/DynamicError";
import ButtonPrint from "../pdf/Button_PDF";
import StudentsInClassroomPDF from "../pdf/StudentsInClassroom";

function StudentsInClassroom() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const data = useSelector((state: any) => state.getStudentsInClassroom);
  const user = useSelector((state: any) => state.user);
  const { students } = data;
  const classes = useSelector((state: any) => state.getClassroom);
  const { classroom } = classes;
  const componentRef = React.useRef<any>();

  React.useEffect(() => {
    dispatch(getStudentsinClassroom(id));
    dispatch(getUser());
    dispatch(getClassroom(id));
  }, []);

  if (!data.isLoading && data.isError && data.error)
    return (
      <DynamicError
        status={data?.error?.status}
        message={data?.error?.data?.message}
      />
    );

  return (
    <div className="flex flex-col items-center justify-center p-8 md:px-12">
      <div className="w-full md:w-7/12 ">
        <div>
          <div className="border-b border-gray-400 px-0 md:px-5 flex justify-between">
            <h1 className="text-xl md:text-3xl font-normal text-gray-500">
              Anggota Kelas
            </h1>
            <div className="flex items-center justify-center ">
              {user.role === "guru" && (
                <div className="mr-3">
                  <ButtonPrint componentRef={componentRef} type={"secondary"} />
                </div>
              )}
              <h4 className="font-bold text-gray-500 p-0 m-0">
                {students ? students.data.length + " Siswa" : null}
              </h4>
            </div>
          </div>
        </div>
        {classroom ? (
          <div className="border w-full mt-5 rounded-md shadow-md h-16">
            <div className="flex items-center h-full px-5 justify-between">
              <div className="flex items-center">
                <AvatarCustom
                  src={classroom.data.User.profile}
                  size={"large"}
                />
                <div className="ml-5 font-medium">
                  {classroom.data.User.name}
                </div>
              </div>
              <div className="">Guru</div>
            </div>
          </div>
        ) : null}
        {students && students.data ? (
          students.data.map((student: any, index: any) => (
            <StudentsCard key={index} student={student} />
          ))
        ) : (
          <div className="mt-12">
            <Spin className="w-full text-center" size="large" />
          </div>
        )}
        {students && students.data.length < 1 ? (
          <div
            style={{ minHeight: "50vh" }}
            className=" flex items-center justify-center mt-5"
          >
            <h1 className="text-xl font-normal text-gray-500">
              Belum ada siswa
            </h1>
          </div>
        ) : null}
      </div>
      <div className="hidden">
        <div ref={componentRef}>
          <StudentsInClassroomPDF data={students} classroom={classroom} />
        </div>
      </div>
    </div>
  );
}

export default StudentsInClassroom;
