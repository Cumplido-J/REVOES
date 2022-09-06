import React from "react";
import { Table } from "antd";

import Columns, { columnProps } from "../../shared/columns";

import { ButtonExcel } from "./StudentFormat/component";
import { ExportExcel } from "./StudentMasiveLoadGraduates/ExportExcel";

function getCleanedString(cadena) {
    // Definimos los caracteres que queremos eliminar
    var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

    // Los eliminamos todos
    for (var i = 0; i < specialChars.length; i++) {
        cadena = cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
    }

    // Lo queremos devolver limpio en minusculas
    cadena = cadena.toLowerCase();

    // Quitamos espacios y los sustituimos por _ porque nos gusta mas asi
    cadena = cadena.replace(/ /g, "_");

    // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
    cadena = cadena.replace(/á/gi, "a");
    cadena = cadena.replace(/é/gi, "e");
    cadena = cadena.replace(/í/gi, "i");
    cadena = cadena.replace(/ó/gi, "o");
    cadena = cadena.replace(/ú/gi, "u");
    cadena = cadena.replace(/ñ/gi, "n");
    return cadena.toUpperCase();
}

const columns = [

    Columns.carrerKey,
    Columns.careerName,
    {
        ...columnProps,
        title: "Formato CSV",
        render: (row) => {

            let modulo = row.module;

            const data = row.student.map((s) => (
                {
                    CURP: s.curp,
                    NOMBRE: s.name,
                    PRIMER_APELLIDO: s.firstLastName,
                    SEGUNDO_APELLIDO: s.secondLastName,
                    MATRICULA: s.enrollmentKey,
                    CCT: s.cct,
                    CLAVE_CARRERA: s.carrerKey,
                    NOMBRE_CARRERA: s.careerName,
                    PROMEDIO: '',
                }
            ));

            for (let i = 0; i < data.length; i++) {
                let k = "";
                for (let j in modulo) {
                    k = getCleanedString(modulo[j].module)
                    data[i]['' + k + ''] = ''
                }
            }
            const color = "blue";
            return (
                <>
                    <ButtonExcel dataset={data} filename={`FORMAT_${row.carrerKey}`} color={color} />
                </>
            );
        },
    },
    {
        ...columnProps,
        title: "Formato XLSX",
        render: (row) => {

            let modulo = row.module;

            const data = row.student.map((s) => (
                {
                    CURP: s.curp,
                    NOMBRE: s.name,
                    PRIMER_APELLIDO: s.firstLastName,
                    SEGUNDO_APELLIDO: s.secondLastName,
                    MATRICULA: s.enrollmentKey,
                    CCT: s.cct,
                    CLAVE_CARRERA: s.carrerKey,
                    NOMBRE_CARRERA: s.careerName,
                    PROMEDIO: '',
                }
            ));

            for (let i = 0; i < data.length; i++) {
                let k = "";
                for (let j in modulo) {
                    k = getCleanedString(modulo[j].module)
                    data[i]['' + k + ''] = ''
                }
            }
            const color = "blue";
            return (
                <>
                    <ExportExcel dataSet={data} fileName={`FORMAT_${row.carrerKey}`} />
                </>
            );
        },
    },
];

export default function StudentFormatTable({ dataset }) {
    return <>
        <Table
            style={{ marginTop: "1em" }}
            pagination={false}
            rowKey="carrerKey"
            bordered
            pagination={{ position: ["topLeft", "bottomLeft"] }}
            columns={columns}
            dataSource={dataset}
            size="small" />
    </>
}
