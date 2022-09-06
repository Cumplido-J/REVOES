import React from "react";
import { Table, Input, Row, Col } from "antd";
import { useState } from "react";

import { SearchOutlined } from "@ant-design/icons";

import { columnProps } from "../../shared/columns";


const columns = [

    {
        ...columnProps,
        title: "Clave",
        width: '10%',
        render: (row) => {
            return (
                row.clave
            )
        }
    },
    {
        ...columnProps,
        title: "Nombre de Carrera",
        align: 'left',
        render: (row) => {
            return (
                row.carrer
            )
        }
    },
    {
        ...columnProps,
        title: "Carrera en DGP",
        align: 'left',
        render: (row) => {
            return (
                row.name
            )
        }
    },
    {
        ...columnProps,
        title: "Modalidad",
        align: 'left',
        width: '15%',
        render: (row) => {
            return (
                row.modality
            )
        }
    },
    {
        ...columnProps,
        title: "Nivel",
        align: 'left',
        width: '15%',
        render: (row) => {
            return (
                row.level
            )
        }
    },

];

const rowProps = {
    style: { marginBottom: "1em" },
};
export default function DgpCareerListTable({ dataset }) {
    const [schoolId, setSchoolId] = useState(null);
    const [searchs, setSearchs] = useState("");

    function search(rows) {
        //constantes para busqueda de todas las columnas
        const columns = rows[0] && Object.keys(rows[0]);
        return rows.filter((row) =>
            columns.some(
                (column) =>
                    row[column].toString().toLowerCase().indexOf(searchs.toLowerCase()) > -1))
    }
    return (
        <>
            <Row {...rowProps}>
                <Col xs={24} sm={12} xl={12}>
                    <label>{}</label><br></br>
                    <Input type="text" addonBefore="Búsqueda:" allowClear addonAfter={<SearchOutlined />} style={{ width: "90%" }} placeholder="Búsqueda libre" value={searchs} onChange={(e) => setSearchs(e.target.value)} />

                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <p style={{ marginTop: "2em" }}>
                        <strong>Registros encontrados: </strong> {dataset.length}
                    </p>
                </Col>
            </Row>
            <div>
            </div>

            <Table
                style={{ marginTop: "1em" }}
                pagination={false}
                rowKey="id"
                pagination={{ position: ["topLeft", "bottomLeft"] }}
                bordered
                columns={columns}
                dataSource={search(dataset)}
                size="small"
            />
            <p style={{ marginTop: "2em" }}>
                <strong>Registros encontrados: </strong> {dataset.length}
            </p>

        </>
    );
}


