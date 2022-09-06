import { createStore, combineReducers } from "redux";
import groupsReducer from "./groups/groupsReducer";
import groupsPeriodsReducer from "./groups-periods/groupsPeriodsReducer";
import teachersReducer from "./teachers/teachersReducer";
import asignacionReducer from "./asignacion/asignacionReducer";
import asignaturasDocenteReducer from "./asignaturasDocente/asignaturasDocenteReducer";
import intersemestralReducer from "./intersemestralReducer/intersemestralReducer";
import asignaturaRecursamientoIntersemestralDocenteReducer from "./asignaturaRecursamientoIntersemestral/asignaturaRecursamientoIntersemestralReducer";
import permissionsReducer from "./permissions/permissionsReducer";
import studentsReducer from "./studentsReducer/studentsReducer";
import academicRecordReducer from "./academicRecordReducer/academicRecordReducer";
import applicantsReducer from "./applicantsReducer/applicantsReducer";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local storage controller

const rootReducer = combineReducers({
  asignacionReducer,
  asignaturasDocenteReducer,
  asignaturaRecursamientoIntersemestralDocenteReducer,
  intersemestralReducer,
  groupsReducer,
  teachersReducer,
  permissionsReducer,
  groupsPeriodsReducer,
  studentsReducer,
  academicRecordReducer,
  applicantsReducer,
});

const persistConfig = {
  key: "root", // LocalStorageKey
  storage, // local storage controller
  whitelist: ["permissionsReducer"], // Lista de estados de reducers a persistir
  timeout: null, // No timeout
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configurar persistencia de datos aqui si se necesita.
const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
