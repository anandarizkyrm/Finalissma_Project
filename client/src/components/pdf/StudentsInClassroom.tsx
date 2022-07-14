import moment from "moment";
import Header_Report from "./Header_Report";

interface Iprops {
  data: any;
  classroom: any;
}

function StudentsInClassroomPDF({ data, classroom }: Iprops) {
  return (
    <div className="px-7 py-2">
      <Header_Report />
      <h2 className="text-center font-bold text-2xl mt-5">
        Laporan Data Siswa Di dalam Kelas
      </h2>
      <div className="mt-7 flex justify-between">
        <div>
          {" "}
          <table className="table">
            <tbody>
              <tr>
                <th className="text-left">Nama Kelas</th>
                <td>: {data?.data[0]?.Classroom.name.toUpperCase()}</td>
              </tr>
              <tr>
                <th className="text-left">Guru Kelas</th>
                <td>: {classroom?.data.User.name.toUpperCase()}</td>
              </tr>
              <tr>
                <th>Deskripsi Kelas</th>
                <td>: {data?.data[0]?.Classroom.description}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 ">
        <table className="border border-black table-fixed">
          <thead>
            <tr>
              <th className="border border-black">No.</th>
              <th className="border border-black w-32">Nama Siswa</th>
              <th className="border border-black">Jenis Kelamin</th>
              <th className="border border-black">Tempat Lahir</th>
              <th className="border border-black">Tanggal Lahir</th>
              <th className="border border-black w-16">Agama</th>
              <th className="border border-black">Alamat</th>
              <th className="border border-black">No Telepon</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((item: any, index: number) => (
              <tr key={index}>
                <td className="border border-black">{index + 1}</td>
                <td className="border border-black">{item.User.name}</td>
                <td className="border border-black ">
                  {item.User.jk ? item.User.jk : "-"}
                </td>
                <td className="border border-black text-xs">
                  {item.User.place_of_birth ? item.User.place_of_birth : "-"}
                </td>
                <td className="border border-black text-center text-xs w-32">
                  {item.User.birth_date
                    ? moment(item.User.birth_date).format("MMMM Do YYYY")
                    : "-"}
                </td>
                <td className="border border-black text-center text-xs">
                  {item.User.religion ? item.User.religion : "-"}
                </td>
                <td className="border border-black text-center text-xs w-32">
                  {item.User.address ? item.User.address : "-"}
                </td>
                <td className="border border-black text-center text-xs w-32">
                  {item.User.phone ? item.User.phone : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentsInClassroomPDF;
