import Link from "next/link";

const Header = () => {
  return(
    <header>
      <nav>
        <Link href={"/quiz"}>Sample Quiz</Link>
        <Link href={"/quiz/new"}>New Quiz</Link>
      </nav>
    </header>
  )
};
