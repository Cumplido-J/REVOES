import React, { useEffect, useState } from "react";
import {Switch, Space,} from "antd";
import {Loading, Title } from "../../shared/components";
import { getFullName } from "../../shared/functions";
import CatalogService from "../../service/CatalogService";
import SchoolService from "../../service/SchoolService";
import MapMexico from "./MapMexico";

export default function HomeInformation({ userProfile,rol }) {
    const fullName = getFullName(userProfile.name, userProfile.firstLastName, userProfile.secondLastName);
    const [toggleEdit, setToggleEdit] = useState(false);
    const [states,setStates]=useState([]);
    const [schoolList, setSchoolList] = useState([]);
    useEffect(() => {
      async function getStates() {
        if(rol!=3){
        const response = await CatalogService.getStateCatalogs();
        if (!response) return;
        if(response.states.length > 1){
          setStates([]);
        }else{
          setStates(response.states[0]);
          await getSchools();
        }
      }
    }
      getStates();
    }, []);
    
    const getSchools = async function () {
      const response = await SchoolService.schoolByState(states.id);
      if(response.schoolList.length > 1){
        setSchoolList([]);
      }else{
        setSchoolList(response.schoolList[0]);
      }
    };
    return (
      <>
        <Title>Información general
        </Title>
        <p>
          Bienvenido <strong>{fullName}</strong>
        </p>
        <p>
          <strong>CURP: </strong> {userProfile.curp}
        </p>
        {(rol==4 || rol==5 || rol==1 ) &&
        <Space size="middle" style={{ marginBottom: "1em" }}>
            <strong>Desea cargar información del mapa </strong>
            <Switch
              checkedChildren="Si"
              unCheckedChildren="No"
              onChange={() => {
                setToggleEdit(!toggleEdit);
              }}
              checked={toggleEdit}
            />
          </Space>
          }
          {rol==1 && !toggleEdit && (
            <>
            &nbsp;
            </>
          )}  
        {rol==1 && toggleEdit && !states.id &&  !schoolList.idschool && <MapMexico  stateId={0} schoolId={0} msj={"Nacional"} reseteo={1}/>} 
        {(rol==4 || rol==5 ) && toggleEdit && states.id && !schoolList.idschool && <MapMexico  stateId={states.id} schoolId={0} msj={states.description1} reseteo={2}/>}
        {(rol==4 || rol==5 ) && toggleEdit && states.id &&  schoolList.idschool&& <MapMexico  stateId={states.id} schoolId={schoolList.idschool} msj={schoolList.name} reseteo={2}/>}                 
      </>
    );
  }