import React from "react";
import { Link } from "react-router-dom";

import { HomeOutlined, PlusOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Row, Col, Breadcrumb, Button } from "antd";

import { Loading, SearchSelect, Title, ButtonCustomLink } from "../../shared/components";
import { useEffect, useState } from "react";

import DegreeCatalogService from "../../service/DegreeCatalogService";
import DgpSchoolsTable from "./DgpSchoolsTable";
import { userHasRole } from "../../shared/functions";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};

async function getStates() {
  const response = await DegreeCatalogService.getStates();
  return response.degreeStates.map((degreeState) => ({ id: degreeState.id, description: degreeState.description1 }));
}

export default function DgpSchools(props) {
  const { userProfile } = props;
  const [catalogs, setCatalogs] = useState({ states: [], schools: [] });
  const [dgpState, setDgpState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stateId, setStateId] = useState();

  const addSchoolButtonProps = {
    link: "/Dgp/Planteles/Add",
    icon: <PlusCircleOutlined />,
    color: "gold",
    fullWidth: false,
  };

  useEffect(() => {
    async function loadState() {
      const states = await getStates();
      setCatalogs({ states, schools: [] });
    }
    loadState();
  }, []);

  const getSchoolDgp = async (stateId) => {
    setLoading(true);
    if (stateId == "") return setLoading(false);
    const response = await DegreeCatalogService.getSchools(stateId);
    if (!response) return;
    const schools = response.schools.map((school) => ({
      id: school.id,
      clave: school.clave,
      school: school.name,
      hasACareer: school.hasACareer,
      totalCareer: school.totalCareer
    }));
    setCatalogs({ ...catalogs, schools });
    setLoading(false);
  }

  useEffect(() => {
    if (dgpState) {
      getSchoolDgp(dgpState);
      setStateId(dgpState);
    } else {
      setLoading(false);
    }

  }, [dgpState]);

  return (
    <div>
      <DgpSchoolsHeader />
      <Loading loading={loading}>
        <Row {...rowProps}>
          <Col {...colProps}>
            <label>Estados: </label>{"  "}
            <SearchSelect dataset={catalogs.states} onChange={setDgpState} value={dgpState} />
          </Col>
          <Col {...colProps} >

          </Col>
          <Col {...colProps}>
            <br></br>
            {(userHasRole.dev(userProfile.roles)) && (
              <ButtonCustomLink {...addSchoolButtonProps}>
                Agregar plantel
              </ButtonCustomLink>
            )}
          </Col>
        </Row>
        <hr />
        <DgpSchoolsTable dataset={catalogs.schools} userProfile={userProfile} stateId={stateId} getSchoolDgp={getSchoolDgp} />
      </Loading>

    </div>
  );
}

function DgpSchoolsHeader() {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <Link to="/Dgp/Planteles" style={{ color: "black" }}>
            <span>Planteles en DGP</span>
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Lista de Planteles en DGP</Title>
        </Col>
      </Row>
    </>
  );
}
