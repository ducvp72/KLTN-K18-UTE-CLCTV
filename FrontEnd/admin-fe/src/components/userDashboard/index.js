import React, { useState, useEffect, useRef } from "react";
import { Table, Space, Input, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";

import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

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
    // console.log("temp", temp);
  }, [temp]);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      filterUser(search, page, "asc");
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
    await adminApi
      .banUser(cookies.user_key.tokens.access.token, { userId: user.id })
      .then(async (res) => {
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

  const searchInput = useRef(null);

  const [searchId, setSearchId] = useState({
    searchText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    setSearchId(searchId);
  }, [searchId]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchId({
      ...searchId,
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchId({ ...searchId, searchText: "" });
  };

  const getColumnSearchProps = (dataIndex) => {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => {
              // console.log("Key", e.target.value);
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchId({
                  searchText: selectedKeys[0],
                  searchedColumn: dataIndex,
                });
              }}
            >
              Filter
            </Button>
          </Space>
        </div>
      ),

      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : "",
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current.select(), 100);
        }
      },

      render: (text) =>
        searchId.searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchId.searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    };
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
        size={"small"}
        pagination={{
          size: "default",
          position: ["bottomRight"],
          current: page,
          onChange: (pageNext) => {
            // console.log("pageCurrent", page);
            // console.log("pageNext", pageNext);
            filterUser(search, pageNext, "asc");
            if (pageNext === 1) {
              setTemp(0);
            }
            if (pageNext > page) {
              // setTemp(temp + 8);

              setTemp(Math.abs(temp + (pageNext - page) * 8));
            }
            if (pageNext < page && pageNext !== 1) {
              setTemp(temp - (page - pageNext) * 8);
            }
            setPage(pageNext);
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
          width={50}
          title={<b className=" font-bold"> # </b>}
          // dataIndex="key"
          key="key"
          render={(text, record) => (
            <div
              className={`  font-bold ${
                text.isBanned === true && `text-red-600`
              }`}
            >
              <p> {text.key + temp} </p>
            </div>
          )}
        />
        <Column
          title="Id"
          // width={"100px"}
          {...getColumnSearchProps("id")}
          // dataIndex="id"
          key="id"
          filteredValue={globalState.filteredInfo?.id || null}
          render={(text, record) => (
            <div className="">
              <p
                onClick={() => {
                  Swal.fire({
                    icon: "info",
                    title: `${text.id} `,
                    // showConfirmButton: false,
                    // timer: 1000,
                  });
                }}
                className={`ml-2 cursor-pointer ${
                  text.isBanned === true && `text-red-600 font-bold`
                }`}
              >
                {text.id[0]}
                {text.id[1]}
                {text.id[2]}
                {text.id[3]}
                {text.id[4]}
                ********
              </p>
            </div>
          )}
          // onFilter={(value, record) => record.fullname.includes(value)}
          // sorter={(a, b) => a.fullname.localeCompare(b.fullname)}
          // sortDirections={["descend", "ascend"]}
          // sortOrder={
          //   globalState.sortedInfo?.columnKey === "fullname" &&
          //   globalState.sortedInfo?.order
          // }
          ellipsis={true}
        />

        <Column
          title="Name"
          // {...getColumnSearchProps("id")}
          width={200}
          // dataIndex="id"
          key="fullname"
          filteredValue={globalState.filteredInfo?.fullname || null}
          render={(text, record) => (
            <div
              className={`${
                text.isBanned === true && `text-red-600 font-bold`
              }`}
            >
              {text.isBanned === true && (
                <i className=" mr-2 fas fa-user-lock"></i>
              )}

              {text.fullname.toString()}
            </div>
          )}
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
          width={120}
          render={(text, record) => <p> {text || <b>NaN</b>} </p>}
          filteredValue={globalState.filteredInfo?.username || null}
          onFilter={(value, record) => record.username.includes(value)}
          sorter={(a, b) =>
            a.username ?? "NaN".localeCompare(b.username ?? "NaN")
          }
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
          render={(text, record) => <p> {text.toString()} </p>}
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
              <div className=" group z-50 flex justify-center ">
                <div
                  className=" w-16
                 flex justify-center items-center "
                >
                  <button className=" focus:outline-none  cursor-pointer ">
                    <i className="fas fa-edit text-base"></i>
                  </button>
                </div>
                <div className=" bg-blue-300 rounded-xl hidden w-11/12 group-hover:mt-5 group-hover:block group-hover:absolute z-50 border-2  border-gray-200 shadow-lg">
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
