import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Table, Divider, Tag } from "antd";
export const UserDash = () => {
  document.body.style.overflow = "hidden";
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      birth: 32,
      email: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      birth: 42,
      email: "10 Downing Street",
    },
    {
      key: "3",
      name: "John",
      birth: 42,
      email: "10 Downing Street",
    },
    {
      key: "4",
      name: "John",
      birth: 42,
      email: "10 Downing Street",
    },
    {
      key: "5",
      name: "John",
      birth: 42,
      email: "10 Downing Street",
    },
    {
      key: "6",
      name: "John",
      birth: 42,
      email: "10 Downing Street",
    },
    {
      key: "7",
      name: "John",
      birth: 42,
      email: "10 Downing Street",
    },
    {
      key: "8",
      name: "John",
      birth: 42,
      email: "10 Downing Street",
    },
    {
      key: "10",
      name: "John",
      birth: 42,
      email: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Birth",
      dataIndex: "birth",
      key: "birth",
    },
    {
      title: "Global Ban",
      dataIndex: "isban",
      key: "isban",
    },
  ];

  return (
    <div className="">
      <Table
        pagination={{
          defaultPageSize: 8,
          showSizeChanger: true,
          pageSizeOptions: ["8", "25", "20"],
        }}
        dataSource={dataSource}
        columns={columns}
        scroll={{ y: 440, x: 10 }}
      />
    </div>
  );
};
