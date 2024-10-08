import { auth, signOut } from "@/auth";
import { Button } from "./button";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { NavMenu } from "@components/NavMenu";

function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
        window.location.href = "/"; // Redirect to home page after sign out
      }}
    >
      <Button type="submit" variant="ghost">Sign Out</Button>
    </form>
  );
}




const Header = async () => {
  const session = await auth();
  return (
    <header>
      <nav className="px-4 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link href={session?.user ? "/dashboard" : "/"} passHref>
            <h1 className="text-3xl font-bold cursor-pointer">Study Smart📚</h1>
          </Link>
          <div>
            {session?.user ? (
              <div className="flex items-center gap-4">
                {session.user.name && session.user.image && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <Image
                          src={session.user.image}
                          alt={session.user.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <NavMenu />
                  </DropdownMenu>
                )}
                <SignOut />
              </div>
            ) : (
              <Link href="/api/auth/signin">
                <Button variant="link" className="rounded-xl border">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
