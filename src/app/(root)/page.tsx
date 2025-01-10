import { auth, signOut } from "~/auth";
import ROUTES from "~/constants/routes";

const Home = async () => {
  const session = await auth();
  console.log(session);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <h1 className="font-space-grotesk text-8xl font-bold">Hello world</h1>
      <h1 className="text-8xl font-bold">Hello world</h1>
    </main>
  );
};

export default Home;
