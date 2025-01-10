import { Button } from "@/components/ui/button";
import { auth, signOut } from "~/auth";
import ROUTES from "~/constants/routes";

const Home = async () => {
  const session = await auth();
  console.log(session);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <h1 className="font-space-grotesk text-8xl font-bold">Hello world</h1>
      <h1 className="text-8xl font-bold">Hello world</h1>
      <form
        className="px-10 pt-[100px]"
        action={async () => {
          "use server";
          await signOut({ redirectTo: ROUTES.SIGN_IN });
        }}
      >
        <Button type="submit">Log Out</Button>
      </form>
    </main>
  );
};

export default Home;
