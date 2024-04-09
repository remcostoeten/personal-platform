import type { NextApiRequest, NextApiResponse } from "next";

type User = {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[]>,
) {
  const users: User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane@example.com",
      imageUrl: "https://via.placeholder.com/150",
    },
  ];

  res.status(200).json(users);
}
