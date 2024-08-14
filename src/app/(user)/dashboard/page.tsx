import { db } from "@/db";
import { eq } from "drizzle-orm";
import { quizzes } from "@/db/schema";
import { auth } from "@/auth";
import QuizzesTable, { Quiz } from "./quizzesTable";
import getUserMetrics from "@/app/actions/getUserMetrics";
import MetricCard from "./metricCard";
import getHeatMapData from "@/app/actions/getHeatMapData";
import insertDummyData from "@/app/actions/insertDummyData";
import SubmissionsHeatMap from "./heatMap";

const Page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <p>User not found</p>;
  }
 //await insertDummyData();

  const userQuizzes: Quiz[] = await db.query.quizzes.findMany({
    where: eq(quizzes.userId, userId),
  });

  const userData = await getUserMetrics();
  const heatMapData = await getHeatMapData();

  return (
    <div className="mt-4">
      <div className="grid grid=cols-1 md:grid-cols-4 gap-4 mb-6">
        {userData && userData.length > 0 ? (
          userData.map((metric) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
            />
          ))
        ) : (
          <p>No metrics found</p>
        )}
        {heatMapData ? <SubmissionsHeatMap data={heatMapData.data} /> : null}
      </div>
      <QuizzesTable quizzes={userQuizzes} />
    </div>
  );
};

export default Page;
