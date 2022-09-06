import React from "react";

import HomeInformation from "./HomeInformation";
import HomeStudent from "./HomeStudent";
import HomeStudentUpdateCareer from "./HomeStudentUpdateCareer";
import HomeSurveys from "./HomeSurveys";
import HomeAdmin from "./HomeAdmin";

export default function Home({ userProfile, getUserProfile }) {
  return (
    <>
      <HomeInformation userProfile={userProfile.userProfile} rol={userProfile.roles}/>
      {userProfile.studentProfile && (
        <>
          {userProfile.studentProfile.careerKey && <HomeStudent studentProfile={userProfile.studentProfile} />}
          {!userProfile.studentProfile.careerKey && <HomeStudentUpdateCareer getUserProfile={getUserProfile} />}
        </>
      )}
      {userProfile.surveys && <HomeSurveys surveys={userProfile.surveys} />}
      {!userProfile.adminProfile && <HomeAdmin adminProfile />}
    </>
  );
}
