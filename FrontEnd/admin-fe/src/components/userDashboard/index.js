import React, { useState, useEffect } from "react";
import { Table, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { searchFilterChange } from "../../redux/reducers/filter";
import { openToggle } from "../../redux/reducers/toggle";
import { Helmet } from "react-helmet-async";
import { useCookies } from "react-cookie";
import { adminApi } from "../../apis";
import Swal from "sweetalert2";
import moment from "moment";

export const UserDash = () => {
  document.body.style.overflow = "hidden";
  const [cookies] = useCookies(["rm_psw", "user_key"]);
  const [load, setLoad] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [temp, setTemp] = useState(0);
  const { Column } = Table;
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.filterData);
  const [globalState, setGlobalState] = useState({
    filteredInfo: null,
    sortedInfo: null,
  });

  useEffect(() => {
    filterUser("", page, "asc");
  }, []);

  useEffect(() => {
    setLoad(load);
  }, [load]);

  useEffect(() => {
    setTemp(temp);
  }, [temp]);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      console.log(filter.queryInput);
      // dispatch(searchFilterChange({ queryInput: "" }));
      setSearch("");
    }
  };

  const filterUser = async (query, pageNum, sort) => {
    setLoad(true);
    await adminApi
      .searchUsers(
        cookies.user_key.tokens.access.token,
        query,
        pageNum,
        8,
        sort
      )
      .then((res) => {
        setLoad(false);
        dispatch(
          searchFilterChange({
            queryInput: "",
            data: res.data.results,
            limit: 8,
            totalPages: res.data.totalPages,
            totalResults: res.data.totalResults,
            sortBy: sort,
          })
        );
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  const handleChange = (pagination, filters, sorter) => {
    // console.log("Various parameters", pagination, filters, sorter);
    setGlobalState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
    // console.log("global", globalState);
  };

  const handleBanUser = async (user) => {
    console.log(user.id);
    console.log("Ban");
    await adminApi
      .banUser(cookies.user_key.tokens.access.token, { userId: user.id })
      .then(async (res) => {
        console.log(res);
        await filterUser(search, page, "asc");
        Swal.fire({
          icon: "warning",
          title: `${user?.fullname} was banned `,
          showConfirmButton: false,
          timer: 1000,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: `User not found`,
          showConfirmButton: false,
          timer: 1000,
        });
        console.log(error);
      });
  };

  const handleUnBanUser = async (user) => {
    console.log(user.id);
    console.log("Unban");
    await adminApi
      .banUser(cookies.user_key.tokens.access.token, { userId: user.id })
      .then(async (res) => {
        console.log(res);
        await filterUser(search, page, "asc");
        Swal.fire({
          icon: "success",
          title: `${user?.fullname} was unBanned `,
          showConfirmButton: false,
          timer: 1000,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: `User not found`,
          showConfirmButton: false,
          timer: 1000,
        });
        console.log(error);
      });
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
                value={search}
                type="search"
                className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon2"
                onChange={(e) => {
                  setSearch(e.target.value);
                  filterUser(e.target.value, page, "asc");
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
                  filterUser(search, page, "asc");
                  setSearch("");
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
          {/* <button
            onClick={() => {
              // setSortDate(!sortDate);
              // setGlobalState({
              //   filteredInfo: null,
              //   sortedInfo: {
              //     order: `${sortDate ? "ascend" : "descend"}`,
              //     columnKey: "dateCreated",
              //   },
              // });
              // handleSort();
            }}
            className=" border-2 border-my-blue w-full rounded focus:outline-none"
          >
            <p className=" p-1">createdDate: {sortDate ? "asc" : "desc"} </p>
          </button> */}
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
          current: page,
          onChange: (pageNext) => {
            // console.log(page);
            setPage(pageNext);
            filterUser(search, pageNext, "asc");
            if (pageNext > page) {
              setTemp(temp + 8);
            } else {
              setTemp(temp - 8);
            }
          },
          defaultPageSize: 8,
          total: filter.totalResults,

          // showSizeChanger: true,
          // pageSizeOptions: ["5", "8", "10"],
        }}
        onChange={(pagination, filters, sorter) => {
          handleChange(pagination, filters, sorter);
        }}
        bordered={true}
        dataSource={filter.data}
        scroll={{ y: 440, x: 10 }}
        loading={load}
      >
        <Column
          render={(text, row) => <p> {text + temp} </p>}
          width={50}
          title="#"
          dataIndex="key"
          key="key"
        />
        <Column
          title="Name"
          width={200}
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
          dataIndex={"username"}
          key="username"
          width={200}
          render={(text, row) => <p> {text || <b>NaN</b>} </p>}
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
          width={140}
          // render={(text, row) => (
          //   <p> {moment().diff(moment(text).format("MM-DD-YYYY"), "days")} </p>
          // )}
          // defaultSortOrder={"ascend"}
          sortDirections={["descend", "ascend"]}
          sorter={(a, b) => new Date(a.birth) - new Date(b.birth)}
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
            { text: "Ban", value: "true" },
            { text: "UnBan", value: "false" },
          ]}
          width={100}
          title="Ban"
          dataIndex="isBanned"
          key="isBanned"
          render={(text, row) => <p> {text.toString()} </p>}
          filteredValue={globalState.filteredInfo?.isBanned || null}
          onFilter={(value, record) =>
            record.isBanned.toString().includes(value)
          }
          sortOrder={
            globalState.sortedInfo?.columnKey === "isBanned" &&
            globalState.sortedInfo?.order
          }
          ellipsis={true}
        />

        <Column
          title="Action"
          width={100}
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
                  <div className=" flex-col space-y-4 cursor-pointer mt-1 p-1  ">
                    <p
                      onClick={() => {
                        dispatch(
                          openToggle({
                            show: true,
                            user: text, //item of row
                          })
                        );
                      }}
                      className="flex focus:outline-none justify-center text-white bg-green-500 rounded-md"
                    >
                      <i className="fa fa-info p-1"></i>
                    </p>
                    <p
                      onClick={() => {
                        console.log(text);
                        if (text.isBanned === false) {
                          handleBanUser(text);
                        } else {
                          handleUnBanUser(text);
                        }
                      }}
                      className={`flex focus:outline-none justify-center text-white ${
                        text.isBanned === false ? `bg-red-500` : `bg-blue-500`
                      }   rounded-md`}
                    >
                      {text.isBanned === false ? (
                        <i className="fas fa-user-lock p-1 "></i>
                      ) : (
                        <i className="fas fa-lock-open p-1  "></i>
                      )}
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
