"use client";
import React, { useEffect, useState } from "react";
import { UserItem } from "./UserItem";

interface User {
  name: string;
  email: string;
  imageUrl: string;
}

export default function RecentSidebar() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchStatus = () => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      });
  };

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        const validUsers = data.filter((user: User) => user.email && user.uid);
        setUsers(validUsers);
        console.log("dd", validUsers);
      });
  }, []);

  return (
    <div className="h-full w-96 bg-slate-50 border-r flex flex-col">
      <div className="h-16 border-b px-4 flex items-center justify-center space-x-4">
        <div className="px-4 py-4 border-b-4 border-b-blue-500">All</div>
        <div className="px-4 py-4 ">Archived</div>
      </div>
      <button onClick={fetchStatus}>Fetch</button>
      <div className="h-full">
        {users.map((user, index) => (
          <UserItem
            key={index}
            name={user.name}
            email={user.email}
            imageUrl={user.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
