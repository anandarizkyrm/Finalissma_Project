import moment from "moment";
import HeaderReport from "./HeaderReport";

function StudentScorePertask({
  data,
  highest,
  average,
  lowest,
  conditionalScore,
  nama,
}: any) {
  return (
    <div className="px-7 py-2">
      <HeaderReport />
      <h2 className="text-center font-bold text-2xl mt-5">
        Laporan Nilai Tugas
      </h2>
      <div className="mt-7 flex justify-between">
        <div>
          <table className="table">
            <tbody>
              <tr>
                <th className="text-left">Nama Tugas</th>
                <td>: {nama}</td>
              </tr>
              <tr>
                <th className="text-left">Nilai Tertinggi</th>
                <td>: {highest}</td>
              </tr>
              <tr>
                <th className="text-left">Nilai Terendah</th>
                <td>: {lowest}</td>
              </tr>

              <tr>
                <th className="text-left">Rata-Rata Nilai</th>
                <td>: {average}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full lg:w-6/6">
        <div className=" shadow-md rounded my-6 ">
          <table className="min-w-full border">
            <thead className="border-b">
              <tr className=" text-primary uppercase text-sm leading-normal">
                <th className="border border-black text-xs text-left">No.</th>

                <th className="border border-black text-xs text-center">
                  Nama Siswa
                </th>
                <th className="border border-black text-xs text-center">
                  Email
                </th>
                <th className="border border-black text-xs text-center">
                  Nilai
                </th>
                <th className="border border-black text-xs text-center">
                  Status
                </th>
                <th className="border border-black text-xs text-center">
                  Tanggal Pengerjaan
                </th>
              </tr>
            </thead>
            <tbody className="text-primary text-sm font-light">
              {data &&
                data.map((item: any, index: number) => (
                  <tr key={index} className="border-b ">
                    <td className="border border-black text-center">
                      {index + 1}.
                    </td>
                    <td className="border border-black text-left">
                      <div className="flex items-center">
                        <span className="font-medium text-xs">
                          {item.User.name}
                        </span>
                      </div>
                    </td>
                    <td className="border border-black text-left">
                      <div className="flex items-center">
                        <span>{item.User.email}</span>
                      </div>
                    </td>
                    <td className="border border-black text-center">
                      <div className="flex items-center justify-center">
                        <span className=" text-xs">{item.score}</span>
                      </div>
                    </td>
                    <td className="border border-black text-center">
                      <span>{conditionalScore(item.score)}</span>
                    </td>
                    <td className="border border-black text-center text-xs">
                      {moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="w-full flex">
          <table className="border border-gray-300 mr-6">
            <tbody>
              <tr className="border border-gray-300">
                <th className="text-center font-semibold border border-gray-300 p-2">
                  Nilai
                </th>
                <th className="text-left font-semibold p-2">Keterangan</th>
              </tr>
              <tr className="border border-gray-300">
                <td className="border border-gray-300 px-2">(89-100)</td>
                <td className="border border-gray-300 px-2">Sangat Baik</td>
              </tr>
              <tr className="border border-gray-300">
                <td className="border border-gray-300 px-2">(70-89)</td>
                <td className="border border-gray-300 px-2">Baik</td>
              </tr>
              <tr className="border border-gray-300">
                <td className="border border-gray-300 px-2">(60-70)</td>
                <td className="border border-gray-300 px-2">Cukup</td>
              </tr>
              <tr className="border border-gray-300">
                <td className="border border-gray-300 px-2">(50-60)</td>
                <td className="border border-gray-300 px-2">Kurang</td>
              </tr>
              <tr className="border border-gray-300">
                <td className="border border-gray-300 px-2">(0-50)</td>
                <td className="border border-gray-300 px-2">Sangat Kurang</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentScorePertask;
