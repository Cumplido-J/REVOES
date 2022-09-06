import React, { useEffect, useState } from "react";
import { Table, Tooltip, Popconfirm } from "antd";
import { columnProps } from "../../shared/columns";
import { Link } from "react-router-dom";
import { DeleteOutlined, WarningOutlined, CloseOutlined } from "@ant-design/icons";
import { userHasRole } from "../../shared/functions";


const columns = (setDeleteRow, userHasRole, userProfile) => [

    {
        ...columnProps,
        title: "Clave en DGP",
        width: '20%',
        render: (row) => {
            return (
                row.clave
            )
        }
    },
    {
        ...columnProps,
        title: "Carrera en DGP",
        align: 'left',
        render: (row) => {
            return (
                row.career
            )
        }
    },
    {
        ...columnProps,
        title: <DeleteOutlined />,
        width: '5%',
        render: (row) => {
            return (<>
                {(userHasRole.dev(userProfile.roles)) && (
                    <Tooltip title="Eliminar">
                        <Popconfirm
                            title="Desea eliminar?"
                            onConfirm={() => setDeleteRow(row.id)}
                            okText="Si"
                            cancelText="No"
                            placement="topRight"
                        >
                            <Link to="#" tooltip="Eliminar"><CloseOutlined  style={{ fontSize: '16px', color: '#f5222d' }} theme="outlined" /></Link>
                        </Popconfirm>
                    </Tooltip>
                )}
                {(!userHasRole.dev(userProfile.roles)) && (
                    <Tooltip title="Restringido"><WarningOutlined style={{ fontSize: '20px', color: 'orange' }} /></Tooltip>

                )}
            </>
            );
        },
    },
];
export default function DgpSchoolsTable({ dataset, userProfile, deleteCombination }) {
    const [deleteRow, setDeleteRow] = useState(null);
    useEffect(() => {
        if (deleteRow != null) {
            deleteCombination(deleteRow);
        }
    }, [deleteRow]);



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
                columns={columns(setDeleteRow, userHasRole, userProfile)}
                dataSource={dataset}
                size="small"
            />
            <p style={{ marginTop: "2em" }}>
                <strong>Registros encontrados: </strong> {dataset.length}
            </p>
        </>
    );
}
