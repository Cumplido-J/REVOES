import React, { useEffect, useState } from "react";
import {
  Redirect,
  Switch,
  Route,
  withRouter,
  useHistory,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPermissions } from "../reducers/permissions/actions/setUserPermissions";

import { PageLoading } from "../shared/components";

import AppService from "../routes/AppService";

import LoginService from "../service/LoginService";

import NotFound from "../pages/NotFound";
import Login from "../pages/login/Login";
import Home from "../pages/home/Home";
import Navigation from "./Navigation";
import StudentPrivacyMessage from "../pages/StudentPrivacyMessage";

function App(props) {
  const [userProfile, setUserProfile] = useState({ userProfile: null });
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [availableMenus, setAvailableMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const dispatch = useDispatch();

  const getUserProfile = async () => {
    const permissions = {
      permissions: [],
      stateId: [],
      schoolId: [],
      period: null,
    };
    const response = await LoginService.getUserProfile();
    if (response.success && Object.keys(response.userProfile).length) {
      const permissionsResponse = await LoginService.getPermissions();
      if (permissionsResponse.success && permissionsResponse.permissions) {
        permissions.permissions = permissionsResponse.permissions;
        permissions.stateId = permissionsResponse.stateId;
        permissions.schoolId = permissionsResponse.schoolId;
        permissions.userProfile = response.userProfile;
        permissions.period = permissionsResponse.periodo;
      }
    }
    dispatch(
      setPermissions(
        permissions.permissions,
        permissions.stateId,
        permissions.schoolId,
        response.userProfile,
        permissions.period
      )
    );
    setUserProfile(response.userProfile);
    setLoading(false);
  };

  const logout = async () => {
    LoginService.logout(props.history);
    dispatch(setPermissions([], null, null, {}));
    await getUserProfile();
    window.location.reload();
  };

  useEffect(() => {
    getUserProfile();
    history.listen(() => {
      getUserProfile();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const routes = AppService.getAvailableRoutes(userProfile);
    const menus = AppService.getAvailableMenus(userProfile);
    setAvailableRoutes(routes);
    setAvailableMenus(menus);
  }, [userProfile]);

  if (
    userProfile &&
    userProfile.studentProfile &&
    userProfile.studentProfile.noticeOfPrivacyAccepted === false
  ) {
    return (
      <StudentPrivacyMessage
        {...props}
        logout={logout}
        getUserProfile={getUserProfile}
      />
    );
  }
  return (
    <Navigation
      {...props}
      logout={logout}
      userProfile={userProfile}
      availableMenus={availableMenus}
    >
      <PageLoading loading={loading}>
        <Switch>
          <Route
            exact
            path="/Login"
            render={(props) => {
              if (userProfile.userProfile)
                return <Redirect to={{ pathname: "/" }} />;
              return <Login {...props} getUserProfile={getUserProfile} />;
            }}
          />
          <Route
            exact
            path="/"
            render={(props) => {
              if (!userProfile.userProfile)
                return <Redirect to={{ pathname: "/Login" }} />;
              return (
                <Home
                  {...props}
                  userProfile={userProfile}
                  getUserProfile={getUserProfile}
                />
              );
            }}
          />
          {availableRoutes.map(({ path, Component }, index) => {
            return (
              <Route
                key={index}
                exact
                path={path}
                render={(props) => {
                  return (
                    <Component
                      {...props}
                      userProfile={userProfile}
                      getUserProfile={getUserProfile}
                    />
                  );
                }}
              />
            );
          })}
          <Route component={NotFound} />
        </Switch>
      </PageLoading>
    </Navigation>
  );
}

export default withRouter(App);
