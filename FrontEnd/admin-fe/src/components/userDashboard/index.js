import React, { useState, useEffect } from "react";
import { Table, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { searchFilterChange } from "../../redux/reducers/filter";
import { Helmet } from "react-helmet-async";

// import { useStore, actions } from "../../contextApi";

export const UserDash = () => {
  const { Column } = Table;
  document.body.style.overflow = "hidden";
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.filterData);
  // useEffect(() => {
  //   console.log("Filter", filter.queryInput);
  // }, [filter.queryInput]);

  const [globalState, setGlobalState] = useState({
    filteredInfo: null,
    sortedInfo: null,
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
    },
    data: [],
  });
  const [sortDate, setSortDate] = useState(false);

  const dataSource = [
    {
      key: "1",
      fullname: "a",
      username: "caube.vui",
      birth: 132,
      email: "10 Downing Street",
      ban: "Ban",
      createAt: "07/02/2000",
      gender: "male",
    },
    {
      key: "2",
      fullname: "c",
      username: "caube.vui2",
      birth: 42,
      email: "10 Downing Street",
      ban: "Ban",
      createAt: "07/02/2000",
      gender: "male",
    },
    {
      key: "3",
      fullname: "b",
      username: "tieuthu.vui2",
      birth: 52,
      email: "10 Downing Street",
      ban: "UnBan",
      createAt: "07/02/2000",
      gender: "other",
    },
    {
      key: "4",
      fullname: "e",
      username: "rrac.vui2",
      birth: 62,
      email: "10 Downing Street",
      ban: "Ban",
      createAt: "07/02/2000",
      gender: "female",
    },
    {
      key: "5",
      fullname: "d",
      username: "mtp",
      birth: 72,
      email: "10 Downing Street",
      ban: "Ban",
      createAt: "07/02/2000",
      gender: "female",
    },
    {
      key: "6",
      fullname: "f",
      username: "jack",

      birth: 82,
      email: "10 Downing Street",
      ban: "Ban",
      createAt: "07/02/2000",
      gender: "other",
    },
    {
      key: "7",
      fullname: "g",
      username: "jack",

      birth: 92,
      email: "10 Downing Street",
      ban: "Ban",
      createAt: "07/02/2000",
      gender: "other",
    },
    {
      key: "8",
      fullname: "h",
      username: "mr.bean",

      birth: 12,
      email: "10 Downing Street",
      ban: "Ban",
      createAt: "07/02/2000",
      gender: "female",
    },
    {
      key: "9",
      fullname: "i",
      username: "longNam",
      birth: 22,
      email: "10 Downing Street",
      ban: "UnBan",
      createAt: "07/02/2000",
      gender: "male",
    },
  ];

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      console.log(filter.queryInput);
      dispatch(searchFilterChange(""));
    }
  };

  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setGlobalState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
    console.log("global", globalState);
  };

  return (
    <div className="">
      <Helmet>
        <title>User DashBoard</title>
      </Helmet>
      <div className=" w-full mt-2 p-2 flex items-center ">
        <div className="flex justify-start">
          <div className="mb-3 xl:w-96">
            <div className="input-group relative flex items-stretch w-full mb-4">
              <input
                value={filter.queryInput}
                type="search"
                className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon2"
                onChange={(e) => {
                  dispatch(searchFilterChange(e.target.value));
                }}
                onKeyDown={(e) => {
                  handleEnter(e);
                }}
              />
              <button
                className="btn inline-block px-6 py-2.5 bg-my-blue text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out  items-center"
                type="button"
                id="button-addon2"
                onClick={() => {
                  dispatch(searchFilterChange(""));
                }}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="search"
                  className="w-4"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className=" ml-2 mb-6 flex items-center space-x-2">
          <button
            onClick={() => {
              setSortDate(!sortDate);
              setGlobalState({
                filteredInfo: null,
                sortedInfo: {
                  order: `${sortDate ? "ascend" : "descend"}`,
                  columnKey: "dateCreated",
                },
              });
            }}
            className=" border-2 border-my-blue w-full rounded focus:outline-none"
          >
            <p className=" p-1">createdDate: {sortDate ? "asc" : "desc"} </p>
          </button>
          <button
            onClick={() => {
              setGlobalState({
                filteredInfo: null,
                sortedInfo: null,
              });
            }}
            className=" border-2 border-my-blue w-full rounded focus:outline-none"
          >
            <p className=" p-1"> Clear filters</p>
          </button>
        </div>
      </div>

      <Table
        size={"default"}
        pagination={{
          position: ["bottomRight"],
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["5", "8", "10"],
        }}
        onChange={(pagination, filters, sorter) => {
          handleChange(pagination, filters, sorter);
        }}
        bordered={true}
        dataSource={dataSource}
        scroll={{ y: 440, x: 10 }}
        loading={false}
      >
        <Column width={50} title="#" dataIndex="key" key="key" />
        <Column
          title="Name"
          dataIndex="fullname"
          key="fullname"
          filteredValue={globalState.filteredInfo?.fullname || null}
          onFilter={(value, record) => record.fullname.includes(value)}
          sorter={(a, b) => a.fullname.localeCompare(b.fullname)}
          sortDirections={["descend", "ascend"]}
          sortOrder={
            globalState.sortedInfo?.columnKey === "fullname" &&
            globalState.sortedInfo?.order
          }
          ellipsis={true}
        />
        <Column
          title="Username"
          dataIndex="username"
          key="username"
          filteredValue={globalState.filteredInfo?.username || null}
          onFilter={(value, record) => record.username.includes(value)}
          sorter={(a, b) => a.username.localeCompare(b.username)}
          sortDirections={["descend", "ascend"]}
          sortOrder={
            globalState.sortedInfo?.columnKey === "username" &&
            globalState.sortedInfo?.order
          }
          ellipsis={true}
        />
        <Column title="Email" dataIndex="email" key="email" />
        <Column
          title="Birth"
          dataIndex="birth"
          key="birth"
          width={100}
          // defaultSortOrder={"ascend"}
          sortDirections={["descend", "ascend"]}
          sorter={(a, b) => a.birth - b.birth}
          sortOrder={
            globalState.sortedInfo?.columnKey === "birth" &&
            globalState?.sortedInfo.order
          }
          ellipsis={true}
        />
        <Column
          filters={[
            { text: "Female", value: "female" },
            { text: "Male", value: "male" },
            { text: "Other", value: "other" },
          ]}
          width={100}
          title="Gender"
          dataIndex="gender"
          key="gender"
          filteredValue={globalState.filteredInfo?.gender || null}
          onFilter={(value, record) => record.gender.indexOf(value) === 0}
          sortOrder={
            globalState.sortedInfo?.columnKey === "gender" &&
            globalState.sortedInfo?.order
          }
          // sorter={(a, b) => a.gender.length - b.gender.length}
          ellipsis={true}
        />
        <Column
          filters={[
            { text: "Ban", value: "Ban" },
            { text: "UnBan", value: "UnBan" },
          ]}
          width={100}
          title="Is Ban"
          dataIndex="ban"
          key="ban"
          filteredValue={globalState.filteredInfo?.ban || null}
          onFilter={(value, record) => record.ban.indexOf(value) === 0}
          sortOrder={
            globalState.sortedInfo?.columnKey === "ban" &&
            globalState.sortedInfo?.order
          }
          // sorter={(a, b) => a.ban.length - b.ban.length}
          ellipsis={true}
        />

        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <div className=" group z-50 ">
                <div
                  className=" w-16
                 flex justify-center items-center "
                >
                  <button className=" focus:outline-none  cursor-pointer ">
                    <i className="fas fa-edit text-base"></i>
                  </button>
                </div>
                <div className=" hidden group-hover:block z-50 border-2 bg-transparent border-gray-200 shadow-lg">
                  <div className=" flex-col space-y-2 cursor-pointer mt-1 p-1  ">
                    <p
                      onClick={() => {
                        console.log(text);
                        console.log(record);
                      }}
                      className="flex focus:outline-none justify-center text-white bg-green-500 rounded-md"
                    >
                      <i className="fa fa-info p-1"></i>
                    </p>
                    <p className="flex focus:outline-none justify-center text-white bg-red-500  rounded-md">
                      <i className="fa fa-ban p-1"></i>
                    </p>
                    {/* <p className="flex focus:outline-none justify-center text-white bg-red-500 rounded-md">
                      <i className="fa fa-trash p-1"></i>
                    </p> */}
                  </div>
                </div>
              </div>
            </Space>
          )}
        />
      </Table>
    </div>
  );
};
