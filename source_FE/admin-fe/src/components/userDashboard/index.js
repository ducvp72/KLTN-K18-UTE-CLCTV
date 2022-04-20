import React, { useState, useEffect } from "react";
import { Table, Space } from "antd";
import { useStore, actions } from "../../contextApi";

export const UserDash = () => {
  document.body.style.overflow = "hidden";
  const { Column } = Table;
  const [state, dispatch] = useStore(useStore);

  const { key, query } = state;

  useEffect(() => {
    dispatch(actions.setSearchQuey("User"));
  }, []);

  const dataSource = [
    {
      key: "1",
      fullname: "Mike",
      birth: 32,
      email: "10 Downing Street",
    },
    {
      key: "2",
      fullname: "John",
      birth: 42,
      email: "10 Downing Street",
    },
    {
      key: "3",
      fullname: "John",
      birth: 42,
      email: "10 Downing Street",
    },
    {
      key: "4",
      fullname: "John",
      birth: 42,
      email: "10 Downing Street",
    },
    {
      key: "5",
      fullname: "John",
      birth: 42,
      email: "10 Downing Street",
    },
    {
      key: "6",
      fullname: "John",
      birth: 42,
      email: "10 Downing Street",
    },
    {
      key: "7",
      fullname: "John",
      birth: 42,
      email: "10 Downing Street",
    },
    {
      key: "8",
      fullname: "John",
      birth: 42,
      email: "10 Downing Street",
    },
    {
      key: "10",
      fullname: "John",
      birth: 42,
      email: "10 Downing Street",
    },
  ];

  const value = `Result ${key} + ${query}`;
  return (
    <div className="">
      <div className=" bg-red-500"> {value} </div>
      <Table
        pagination={{
          defaultPageSize: 8,
          showSizeChanger: true,
          pageSizeOptions: ["8", "25", "20"],
        }}
        dataSource={dataSource}
        // columns={columns}
        scroll={{ y: 440, x: 10 }}
      >
        <Column width={50} title="#" dataIndex="number" key="index" />
        <Column title="Name" dataIndex="fullname" key="fullname" />
        <Column title="Username" dataIndex="username" key="username" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Birth" dataIndex="birth" key="birth" />
        <Column width={100} title="Global ban" dataIndex="ban" key="ban" />
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <div className=" group z-50">
                <button className=" focus:outline-none text-my-blue cursor-pointer border-2 border-my-blue rounded-md ">
                  <p className=" p-1 text-sm">Options</p>
                </button>
                <div className=" hidden group-hover:block z-50 border-2 bg-transparent border-gray-200 shadow-lg">
                  <div className=" flex-col space-y-2 cursor-pointer mt-1 p-1  ">
                    <p className="flex focus:outline-none justify-center text-white bg-green-500 rounded-md">
                      <i class="fa fa-info p-1"></i>
                    </p>
                    <p className="flex focus:outline-none justify-center text-white bg-black rounded-md">
                      <i class="fa fa-ban p-1"></i>
                    </p>
                    <p className="flex focus:outline-none justify-center text-white bg-red-500 rounded-md">
                      <i className="fa fa-trash p-1"></i>
                    </p>
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
