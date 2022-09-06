import { Component } from "react";
import FolioData from "../pages/folio/FolioData";
import FolioSearch from "../pages/folio/FolioSearch";
import FolioDataDegree from "../pages/serachfoliodegree/FolioDataDegree.js";
import FolioSearchDegree from "../pages/serachfoliodegree/FolioSearchDegree";

export default {
  folioSearch: {
    path: "/Folio",
    Component: FolioSearch,
    Permissions: [],
  },
  folioData: {
    path: "/Folio/:folio",
    Component: FolioData,
    Permissions: [],
  },
  folioSearchDegree: {
    path: "/FolioDegree",
    Component: FolioSearchDegree,
    Permissions: [],
  },
  folioDataDegree: {
    path: "/FolioDegree/:folio",
    Component: FolioDataDegree,
    Permissions: [],
  },
};
