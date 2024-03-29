import { Spin, Tooltip } from "antd";
import {
  UserOutlined,
  FundOutlined,
  FilePdfOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const PopupMenu = lazy(() => import("./PopupMenu"));
function Classcard({ classroom, id, user }: any) {
  const navigate = useNavigate();

  return (
    <div className="hover:shadow-lg  my-5 mr-6 rounded-xl  min-w-11 h-52 border border-gray-300 bg-white overflow-hidden flex flex-col justify-between">
      <div
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(0, 0, 10, 0.5),rgba(255, 255, 255, 0.007)), 
              url(${
                classroom.banner
                  ? classroom.banner
                  : "https://source.unsplash.com/1200x400?school"
              })`,
        }}
        className="border-b flex justify-between  border-gray-300 bg-hero bg-cover bg-center w-full h-24 p-5 "
      >
        <h1
          onClick={() => {
            navigate(`classroom/${classroom.id}`);
          }}
          className="text-secondary font-normal text-xl   cursor-pointer hover:underline"
        >
          {classroom.name}
        </h1>
        <Suspense fallback={<Spin />}>
          <div className="text-secondary font-bold">
            {user.role === "guru" ? (
              <PopupMenu classroom={classroom} id={id} />
            ) : null}
          </div>
        </Suspense>
      </div>
      <div className="h-full p-2">
        <div className="flex flex-wrap w-64 overflow-hidden">
          <p className="text-gray-500">{classroom.description}</p>
        </div>
      </div>
      <div className="border-t   border-gray-300 w-full h-12">
        <div className="flex justify-end items-center h-full p-3">
          {user.role === "guru" ? (
            <Tooltip placement="bottom" title="Nilai Siswa">
              <FundOutlined
                onClick={() => {
                  navigate(`/classroom/${id}/tasks`);
                }}
                className="text-xl mr-4   cursor-pointer"
              />
            </Tooltip>
          ) : null}
          <Tooltip placement="bottom" title="Tugas Kelas">
            <SnippetsOutlined
              onClick={() => {
                navigate(`/classroom/${classroom.id}/tasks`);
              }}
              className="text-xl   mr-4   cursor-pointer"
            />
          </Tooltip>
          <Tooltip placement="bottom" title="Materi Kelas">
            <FilePdfOutlined
              onClick={() => {
                navigate(`/classroom/${classroom.id}/materi`);
              }}
              className="text-xl   mr-4   cursor-pointer"
            />
          </Tooltip>

          <Tooltip placement="bottom" title="Anggota Kelas">
            <UserOutlined
              onClick={() => {
                navigate(`/classroom/${classroom.id}/students`);
              }}
              className="text-xl    cursor-pointer"
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default Classcard;
