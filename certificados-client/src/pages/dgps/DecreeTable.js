import React from "react";
import { Table } from "antd";
import { useState } from "react";

import { EditOutlined } from "@ant-design/icons";
import { ButtonIconLink } from "../../shared/components";

import { columnProps } from "../../shared/columns";


const columns = [
    {
        ...columnProps,
        title: <EditOutlined />,
        width: '10%',
        render: (row) => {

            return (<>
                <ButtonIconLink
                    tooltip="Editar"
                    icon={<EditOutlined />}
                    color="green"
                    link={`/Dgp/Decreto/Editar/${row.id}`}
                />
            </>);
        },
    },

    {
        ...columnProps,
        title: "Estado",
        width: '20%',
        render: (row) => {
            return (
                row.name
            )
        }
    },
    {
        ...columnProps,
        title: "Abreviación",
        align: 'left',
        render: (row) => {
            return (
                row.abbreviation
            )
        }
    },
    {
        ...columnProps,
        title: "Municipio",
        align: 'left',
        render: (row) => {
            return (
                row.cityName
            )
        }
    },
    {
        ...columnProps,
        title: "Número de Decreto",
        align: 'left',
        render: (row) => {
            return (
                row.decreeNumber
            )
        }
    },
    {
        ...columnProps,
        title: "Fecha de Decreto",
        align: 'left',
        render: (row) => {
            return (
                row.decreeDate
            )
        }
    },
];
export default function DecreeTable({ dataset }) {
    const [schoolId, setSchoolId] = useState(null);

    return (
        <>
            <p style={{ marginTop: "2em" }}>
                <strong>Registros encontrados: </strong> {dataset.length}
            </p>
            <Table
                style={{ marginTop: "1em" }}
                pagination={false}
                rowKey="id"
                pagination={{ position: ["topLeft", "bottomLeft"] }}
                bordered
                columns={columns}
                dataSource={dataset}
                size="small"
            />
            <p style={{ marginTop: "2em" }}>
                <strong>Registros encontrados: </strong> {dataset.length}
            </p>
        </>
    );
}


