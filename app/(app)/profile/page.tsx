import { currentUser } from "@clerk/nextjs";

import { prismadb } from "@/lib/prismadb";
import { PprofileContainer } from "@/components/profile-container";

const ProfilePage = async () => {
  // current state
  const user = await currentUser();

  if (!user) {
    throw new Error("User no authendication");
  }

  let challengePreferences = await prismadb.challengePreferences.findUnique({
    where: { userId: user.id },
  });

  if (!challengePreferences) {
    challengePreferences = await prismadb.challengePreferences.create({
      data: { userId: user.id, challengeId: "EASY" },
    });
  }

  // request new model
  return (
    <div className="max-w-screen-lg m-10 lg:mx-auto">
      <PprofileContainer challengePreferences={challengePreferences} />
    </div>
  );
};

export default ProfilePage;
