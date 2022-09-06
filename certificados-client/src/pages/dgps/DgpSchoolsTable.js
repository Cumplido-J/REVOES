import React from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { Modal, Row, Col, Breadcrumb, Tooltip, Button } from "antd";
import { useEffect, useState } from "react";

import { UnorderedListOutlined, MergeCellsOutlined, EditOutlined, WarningOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { ButtonIcon, ButtonIconLink } from "../../shared/components";

import { columnProps } from "../../shared/columns";
import SchoolSerchCareer from "./SchoolSerchCareer";
import { userHasRole } from "../../shared/functions";
import SchoolCombination from "./SchoolCombination";


const columns = ( combination, toggleModal, userHasRole, userProfile) => [
    {
        ...columnProps,
        title: <EditOutlined />,
        width: '5%',
        render: (row) => {

            return (<>

                {(userHasRole.dev(userProfile.roles)) && (
                    <ButtonIconLink
                        tooltip="Editar"
                        icon={<EditOutlined />}
                        color="green"
                        link={`/Dgp/Planteles/Editar/${row.id}`}
                    />
                )}                

            </>);
        },
    },
    {
        ...columnProps,
        title: <UnorderedListOutlined />,
        width: '5%',
        render: (row) => {

            return (<>
               
                {row.hasACareer === true ? (
                    <ButtonIcon
                        onClick={() => toggleModal(row.id)}
                        tooltip="Lista de carreras"
                        icon={<UnorderedListOutlined style={{ fontSize: '20px', color: '#000' }} />}
                        color="black"
                    />) : (
                        <ButtonIcon
                        tooltip="Sin carreras"
                        icon={<EyeInvisibleOutlined style={{ fontSize: '20px', color: '#000' }} />}
                        color="black"
                    />
                    )}

            </>);
        },
    },
    {
        ...columnProps,
        title: <MergeCellsOutlined />,
        width: '5%',
        render: (row) => {
            return (<>
                {(userHasRole.dev(userProfile.roles)) && (
                    /*<Tooltip title="Asignar Carreras">
                        <Link to={`/Dgp/Carreras/${row.id}`}>
                            <MergeCellsOutlined style={{ fontSize: '20px', color: '#08c' }} />
                        </Link>
                    </Tooltip>*/
                    <ButtonIcon
                    onClick={() => combination(row.id)}
                    tooltip="Asignar Carreras"
                    icon={<MergeCellsOutlined style={{ fontSize: '20px', color: '#08c' }} />}
                    color="black"
                />
                )}
                {(!userHasRole.dev(userProfile.roles)) && (
                    <Tooltip title="Restringido"><WarningOutlined style={{ fontSize: '20px', color: 'orange' }} /></Tooltip>

                )}
            </>
            );
        },
    },
    {
        ...columnProps,
        title: "Clave en DGP",
        width: '20%',
        sorter: (a, b)=> a.clave - b.clave,
        render: (row) => {
            return (
                row.clave
            )
        }
    },
    {
        ...columnProps,
        title: "Plantel en DGP",
        align: 'left',
        sorter: (a, b)=> a.school.length - b.school.length,
        render: (row) => {
            return (
                row.school
            )
        }
    },
];
export default function DgpSchoolsTable({ dataset, userProfile, stateId, getSchoolDgp }) {
    const [schoolId, setSchoolId] = useState(null);
    const [combination, setCombination] = useState(null);

    return (
        <>
            <p style={{ marginTop: "2em" }}>
                <strong>Registros encontrados: </strong> {dataset.length}
            </p>
            <Table
                style={{ marginTop: "1em" }}
                pagination={true}
                rowKey="id"
                pagination={{ position: ["topLeft", "bottomLeft"] }}
                bordered
                columns={columns(setCombination, setSchoolId, userHasRole, userProfile)}
                dataSource={dataset}
                size="small"
            />
            <p style={{ marginTop: "2em" }}>
                <strong>Registros encontrados: </strong> {dataset.length}
            </p>

            <SchoolSerchCareer schoolId={schoolId} setSchoolId={setSchoolId} />
            <SchoolCombination combination={combination} setCombination={setCombination} userProfile={userProfile} stateId={stateId} getSchoolDgp={getSchoolDgp} />
        </>
    );
}


