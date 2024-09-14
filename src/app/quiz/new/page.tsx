import UploadDocument from "./UploadDocument";
import { auth } from "@/auth";
import { getUserSubscription } from "@/app/actions/userSubscriptions";
import { signIn } from "next-auth/react";
import { Lock, Flame } from "lucide-react";
import { useState } from "react";
import { getStripe } from "@/lib/stripe-client";
import { useRouter } from "next/navigation";
import { PRICE_ID } from "@/lib/utils";
import UpgradePlan from "../UpgradePlan";

const page = async () => {
  const session = await auth();
  const userId = await session?.user?.id;
  if (!userId) {
    signIn();
    return;
  }
  const subscribed: boolean | null | undefined = await getUserSubscription({
    userId,
  });

  return (
    <div className="flex flex-col flex-grow-1">
      <main className="py-11 flex flex-col text-center gap-4 items-center flex-1 mt-24">
        {!subscribed ? (
          <>
            <h2 className="text-3xl font-bold mb-4">
              What do you want to be quizzed on today?
            </h2>
            <UploadDocument />
          </>
        ) : (
          <UpgradePlan />
        )}
      </main>
    </div>
  );
};

export default page;
