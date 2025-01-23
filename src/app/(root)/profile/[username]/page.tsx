import { notFound } from "next/navigation";

import User from "~/database/user.model";
import dbConnect from "@/lib/mongoose";

interface Props {
  params: {
    username: string;
  };
}

const Profile = async ({ params }: Props) => {
  const { username } = params;

  await dbConnect();
  const user = await User.findOne({ username });

  if (!user) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="h1-bold text-dark100_light900">Profile</h1>
      <div>
        <p>Name: {user.name}</p>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        {user.bio && <p>Bio: {user.bio}</p>}
        {user.location && <p>Location: {user.location}</p>}
        {user.portfolio && <p>Portfolio: {user.portfolio}</p>}
      </div>
    </div>
  );
};

export default Profile;
