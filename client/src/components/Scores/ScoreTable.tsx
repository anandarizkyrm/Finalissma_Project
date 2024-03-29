import React from "react";
import DataTable from "react-data-table-component";
import { customStyles } from "./StylesTable";
import { DatePicker, Input, Select } from "antd";
import moment from "moment";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { TableColumn } from "react-data-table-component";
import ButtonPrint from "../pdf/Button_PDF";
import AllScoreInClassPDF from "../pdf/AllScoreInClassPDF";
import { conditionalScore, getAverage } from "../../utils/utils";
import axios from "axios";

const { Option } = Select;
const { Search } = Input;

interface Iprops {
  scores: any;
  id: string | undefined;
}

export default function ScoreTable({ scores, id }: Iprops) {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [rows, setRows] = React.useState<any>([]);
  const [filterText, setFilterText] = React.useState<string>("");
  const componentRef: any = React.useRef();
  const [mapel, setMapel] = React.useState<any>();

  let filteredItems = rows.filter(
    (item: any) =>
      (item.user &&
        item.user.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.task_title &&
        item.task_title.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.mapel &&
        item.mapel.toLowerCase().includes(filterText.toLowerCase()))
  );
  const [filter, setFilter] = React.useState<any>([]);

  let filteredDate =
    filter && filter.length > 1
      ? rows.filter((item: any) =>
          filterText
            ? item.mapel &&
              item.mapel.toLowerCase().includes(filterText.toLowerCase()) &&
              item.date &&
              moment(moment(item.date).format("YYYY-MM-DD")).isBetween(
                filter[0],
                filter[1]
              )
            : item.date &&
              moment(moment(item.date).format("YYYY-MM-DD")).isBetween(
                filter[0],
                filter[1]
              )
        )
      : filteredItems;

  const handleSelectClick = (value: string) => {
    setFilterText(value);
  };
  type DataRow = {
    task_title: string;
    score: string;
    user: string;
    date: string;
    mapel: string;
  };

  React.useEffect(() => {
    axios
      .get("/api/getmapel")
      .then((res) => {
        setMapel(res.data.data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, []);

  const columns: TableColumn<DataRow>[] = [
    {
      name: "Nama Siswa",
      selector: (row) => row.user,
      sortable: true,
    },
    {
      name: "Nama Tugas",
      selector: (row) => row.task_title,
    },
    {
      name: "Mata Pelajaran",
      selector: (row) => row?.mapel,
    },
    {
      name: "Nilai",
      selector: (row) => row.score,
      sortable: true,
      style: {
        fontSize: "15px",
      },
    },
    {
      name: "Status",

      selector: (row: any) => conditionalScore(row.score),
    },
    {
      name: "Tanggal Pengerjaan",
      selector: (row) => moment(row.date).format("MMMM Do YYYY, h:mm:ss a"),
      sortable: true,
    },
    {
      name: "Aksi",
      cell: (row: any) => (
        <>
          <button
            onClick={() =>
              navigate(
                `/classroom/${id}/scoredetail/${row.task_id}/${row.user_id}`
              )
            }
            className="bg-green-500 p-2 text-gray-200 rounded-md mr-4"
          >
            <EyeOutlined /> Detail
          </button>
          <button
            onClick={() =>
              navigate(
                `/classroom/${id}/editscore/${row.task_id}/${row.user_id}`
              )
            }
            className="bg-yellow-500 p-2 text-gray-200 rounded-md mr-4"
          >
            <EditOutlined /> Edit
          </button>
        </>
      ),
    },
  ];

  const handleRange = (dates: any) => {
    if (dates) {
      let start = moment(dates[0]._d).subtract(1, "day").format("YYYY-MM-DD");
      let end = moment(dates[1]._d).add(1, "day").format("YYYY-MM-DD");

      setFilter([start, end]);
      return;
    }
    return setFilter([]);
  };

  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <>
        {" "}
        <Select
          defaultValue="Mata Pelajaran"
          style={{ width: 200 }}
          onChange={handleSelectClick}
          allowClear={false}
        >
          <Option value="">Mata Pelajaran</Option>
          {mapel?.map((data: any, key: any) => (
            <Option key={key} value={data?.nama}>
              {data?.nama}
            </Option>
          ))}
        </Select>
        <Search
          placeholder="Cari"
          allowClear
          style={{ width: 304 }}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </>
    );
    //eslint-disable-next-line
  }, [filterText, mapel, filteredItems]);

  React.useEffect(() => {
    if (scores && scores.data) {
      setLoading(false);
      setRows(scores.data);
    } else {
      setLoading(false);
      setRows([]);
    }
  }, [scores, id]);

  return (
    <div className="w-full flex flex-col mt-12 items-center justify-center">
      <div className="w-5/6 border p-5 shadow-md">
        <DataTable
          title="Daftar Nilai Siswa"
          columns={columns}
          data={filteredDate}
          pagination
          progressPending={loading}
          subHeader
          subHeaderComponent={
            <div style={{ width: "30.9rem" }} className="flex">
              <div className="mr-4">
                <DatePicker.RangePicker
                  style={{ width: "23rem" }}
                  format="DD/MM/YYYY"
                  placeholder={["Dari Tanggal", "Sampai Tanggal"]}
                  onChange={(e) => handleRange(e)}
                />
              </div>
              <ButtonPrint componentRef={componentRef} />
            </div>
          }
          actions={subHeaderComponentMemo}
          defaultSortFieldId={1}
          customStyles={customStyles}
        />

        <div className="w-full flex flex-row">
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
          {rows && (
            <div>
              <table className="border border-gray-300 mr-6">
                <tbody>
                  <tr className="border border-gray-300">
                    <th className="text-center font-semibold border border-gray-300 p-2">
                      Status
                    </th>
                    <th className="text-left font-semibold p-2">Persentase</th>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="text-center border border-gray-300 px-2">
                      Sangat Baik
                    </td>
                    <td className="text-center border border-gray-300 px-2">
                      {getAverage(89, 100, rows)} %
                    </td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="text-center border border-gray-300 px-2">
                      Baik
                    </td>
                    <td className="text-center border border-gray-300 px-2">
                      {getAverage(70, 89, rows)} %
                    </td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="text-center border border-gray-300 px-2">
                      Cukup
                    </td>
                    <td className="text-center border border-gray-300 px-2">
                      {getAverage(60, 70, rows)} %
                    </td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="text-center border border-gray-300 px-2">
                      Kurang
                    </td>
                    <td className="text-center border border-gray-300 px-2">
                      {getAverage(50, 60, rows)} %
                    </td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="text-center border border-gray-300 px-2">
                      Sangat Kurang
                    </td>
                    <td className="text-center border border-gray-300 px-2">
                      {getAverage(0, 50, rows)} %
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="hidden">
        <div ref={componentRef}>
          <AllScoreInClassPDF data={filteredDate} />
        </div>
      </div>
    </div>
  );
}
