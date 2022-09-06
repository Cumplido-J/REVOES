import React from "react";
import { Table, Typography } from "antd";

import Columns from "../../shared/columns";

const columns = [
    Columns.schoolName,
    Columns.careerName,
    Columns.curp,
    Columns.enrollmentKey,
    Columns.name,
    Columns.firstLastName,
    Columns.secondLastName,
    Columns.folioNumber,
    Columns.generation,
    Columns.timbrado,
    Columns.inicio,
    Columns.termino

];
export default function DegreeReportSchoolTable({ dataset }) {
    return (
        <>
            <Table style={{ marginTop: "1em" }}
                rowKey="curp"
                bordered
                pagination={{ position: ["topRight", "bottomLeft"] }}
                columns={columns} scroll={{ x: columns.length * 300 }}
                dataSource={dataset.students}
                size="small"             
            />
        </>
    );
}
