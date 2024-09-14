import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 min-h-screen text-white">
      <main className="flex justify-center items-center flex-1">
        <Card className="max-w-md mx-auto shadow-lg border-white">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-white">
              Welcome to StudySmart📚
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-white">
              StudySmart is an AI-powered application designed to assist
              students in preparing for exams by generating mock tests from
              their uploaded study materials. By leveraging advanced AI models,
              StudySmart helps students focus on key areas and practice with
              custom-generated questions tailored to their materials.
            </p>
            <div className="mt-6">
            <Link href="api/auth/signin">
              <Button >
                Get Started
              </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
