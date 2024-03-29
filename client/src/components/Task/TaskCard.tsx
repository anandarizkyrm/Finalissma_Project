import { BookOutlined } from "@ant-design/icons";
import moment from "moment";
import PopupMenu from "./Popup";
import { Avatar } from "antd";
import { useNavigate, useParams } from "react-router-dom";

function TaskCard({ task, user, setAlert }: any) {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="flex flex-col w-full border rounded-md shadow-md border-b border-gray-300 mb-5">
      <div className=" h-12 w-full flex items-center p-8 justify-between">
        <div className="flex items-center justify-center">
          <Avatar
            size={"large"}
            icon={<BookOutlined className="text-xl mr-2 text-gray-500" />}
          />
          <div className="text-gray-500 ml-5">{task.title}</div>
        </div>
        <div className="flex items-center justify-center ">
          {/* <MoreOutlined className="text-xl text-gray-500 cursor-pointer" /> */}
          <h1 className="text-gray-500 font-normal text-xs mr-2 hidden md:block">
            Dibuat pada {moment(task.createdAt).format("MMM Do YY")}
          </h1>{" "}
          {user.role === "guru" && (
            <PopupMenu user={user} task={task} setAlert={setAlert} />
          )}
        </div>
      </div>
      <div className="border-t relative">
        <div className="flex flex-col items-center justify-between px-8 py-5">
          <div className="flex w-full">
            <div className="w-full">
              <p className={`text-gray-500 font-normal text-xs`}>
                {task.deadline
                  ? "Batas Waktu " + moment(task.deadline).format("MMM Do YY")
                  : "Tidak Ada Batas Waktu"}
              </p>
              <p>{task.description}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between w-full py-2 px-8 border">
          {user.role === "siswa" && (
            <h1
              onClick={() => navigate(`/classroom/${id}/answertask/${task.id}`)}
              className="font-bold text-gray-700 cursor-pointer"
            >
              Lihat Tugas
            </h1>
          )}
          <h1 className=" text-gray-600">
            Jumlah Soal {task.Questions.length}
          </h1>
          {user.role === "guru" ? (
            <h1
              onClick={() => navigate(`/classroom/${id}/taskscore/${task.id}`)}
              className=" text-gray-600 font-bold cursor-pointer hover:text-blue-500"
            >
              Lihat Nilai Siswa
            </h1>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
