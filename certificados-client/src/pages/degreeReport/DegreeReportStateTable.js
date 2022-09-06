import React from "react";
import { Link } from "react-router-dom";
import { Table, Typography } from "antd";

import { columnProps } from "../../shared/columns";
import { stringCompare } from "../../shared/functions";
const { Text } = Typography;

export default function DegreeReportStateTable({ dataset }) {
  const columnas = [
    {
      ...columnProps,
      title: "Planteles en DGP",
      width: '60%',
      sorter: (a, b) => stringCompare(a, b, "cct"),
      render: (row) => {
        return row.totalFinised != 0 ? (
          <Link to={`/Degree/Plantel/${row.schoolId}/${row.generation}`}>
            {row.cct} - {row.schoolName}
          </Link>
        ) : (<div>{row.cct} - {row.schoolName}</div>);
      },
    },
    {
      ...columnProps,
      sorter: (a, b) => a.totalFinised - b.totalFinised,
      title: 'Total de Títulos',
      dataIndex: 'totalFinised',
    },
  ];
  return (
    <>

      <Table
        style={{ marginTop: "1em" }}
        rowKey="cct"
        bordered
        pagination={false}
        columns={columnas}
        dataSource={dataset}
        size="small"
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
              </Table.Summary.Row>

            </>
          );
        }}
      />
    </>
  );
}
