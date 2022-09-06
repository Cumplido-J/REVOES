import React from "react";
import { Link } from "react-router-dom";
import { Table, Typography, Progress } from "antd";
import { columnProps } from "../../shared/columns";
import { stringCompare } from "../../shared/functions";

const { Text } = Typography;

export default function DegreeReportCountryTable({ dataset }) {
    const totalTitulo = dataset.reduce((prev, next) => prev + next.totalFinised, 0);

    const columnas = [
        {
            ...columnProps,
            width: '60%',
            sorter: (a, b) => stringCompare(a, b, "cct"),
            title: "Estado de la república",
            render: (row) => {
                return row.totalFinised != 0 ? (<Link to={`/Degree/Estatal/${row.stateId}/${row.generation}`}>{row.stateName}</Link>) : (<div>{row.stateName}</div>);
            },
        },
        {
            ...columnProps,
            sorter: (a, b) => a.totalFinised - b.totalFinised,
            title: 'Total de Títulos',
            dataIndex: 'totalFinised',
        },
        {
            ...columnProps,
            sorter: (a, b) => a.totalFinised - b.totalFinised,
            title: 'Total de Títulos',
            render: (row) => {
                return <Progress percent={Math.ceil((row.totalFinised * 100) / totalTitulo)} steps={10} size="small" />;
            },

        },

    ];


    return <>
        <Table
            rowKey="stateId"
            columns={columnas}
            dataSource={dataset}
            pagination={false}
            bordered
            summary={(pageData) => {
                let totalBorrow = 0;
                pageData.forEach(({ totalFinised }) => {
                    totalBorrow += totalFinised;
                });
                return (
                    <>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} style={{ align: 'center' }}><center>TOTAL</center></Table.Summary.Cell>
                            <Table.Summary.Cell index={1} style={{ align: 'center' }}>
                                <center>
                                    <Text type="danger">{totalBorrow}</Text>
                                </center>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2} style={{ align: 'center' }}>
                                <center>
                                    <Progress percent={(totalTitulo * 100) / totalTitulo} steps={10} size="small" />
                                </center>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </>
                );
            }}
        />
    </>
}
