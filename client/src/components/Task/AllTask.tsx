import React, { lazy, Suspense } from "react";
import { Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getClassroom } from "../../actions/classroom";
import { useParams } from "react-router-dom";
import { getTaskInClassroom } from "../../actions/task";
import { AlertComponents } from "../alert/Alert";

const TaskCard = lazy(() => import("./TaskCard"));
const CreateTask = lazy(() => import("../CreateandEdit_Task/CreateTask"));
const Teacher = lazy(() => import("./Teacher"));
const DynamicError = lazy(() => import("../404/DynamicError"));

function AllTask() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [alert, setAlert] = React.useState({
    message: "",
    typeAlert: 0,
  });
  const dispatch = useDispatch();
  const { id } = useParams();
  const { classroom } = useSelector((state: any) => state.getClassroom);
  const taskData = useSelector((state: any) => state.getTaskInClassroom);
  const user = useSelector((state: any) => state.user);
  const { task } = taskData;

  React.useEffect(() => {
    dispatch(getClassroom(id, setLoading));
    dispatch(getTaskInClassroom(id));
  }, [id, dispatch]);

  if (!taskData.isLoading && taskData.isError && taskData.error)
    return (
      <Suspense fallback={<Spin />}>
        <DynamicError
          status={taskData?.error?.status}
          message={taskData?.error?.data?.message}
        />
      </Suspense>
    );
  return (
    <div className="flex flex-col items-center ">
      <AlertComponents alert={alert} setAlert={setAlert} />
      <div className="w-4/6 mt-7">
        <div className="border-b border-gray-400 px-0 md:px-0 flex justify-between">
          <h1 className="text-xl md:text-3xl font-normal text-gray-500">
            Daftar Tugas Kelas
          </h1>
          <div className="flex items-center justify-center text-gray-500 font-bold">
            {task ? "Total " + task.data.length + " Tugas" : null}
          </div>
        </div>
      </div>

      <Suspense fallback={<Spin />}>
        {user.role === "guru" ? (
          <Teacher
            open={open}
            setOpen={setOpen}
            classroom={classroom}
            task={task}
          />
        ) : null}

        <div className="w-full md:5/6  mt-5 md:mt-8 flex flex-col items-center justify-center">
          {!task && (
            <div className="flex h-96 items-center justify-center">
              <Spin size="large" />
            </div>
          )}
          {!loading && task && task.data.length > 0 ? (
            task.data.map((task: any) => {
              return (
                <div
                  key={task.id}
                  className="flex p-4 md:p-0 md:w-4/6 items-center justify-center"
                >
                  <TaskCard task={task} user={user} setAlert={setAlert} />
                </div>
              );
            })
          ) : (
            <div className="w-full h-96 flex items-center justify-center">
              <h1 className="text-gray-500 font-normal text-base">
                Kelas ini belum memiliki tugas
              </h1>
            </div>
          )}
        </div>
        <CreateTask setOpen={setOpen} open={open} />
      </Suspense>
    </div>
  );
}

export default AllTask;
