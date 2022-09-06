import React from "react";

import { StopOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import { volcano, green, gold, red, blue, geekblue } from "@ant-design/colors";
import { Button, Tooltip } from "antd";
import { CsvIcon, DownloadXlsxIcon, XlsxEmptyIcon } from "../../../components/CustomIcons";

export function ButtonCustom({
    icon,
    onClick,
    color,
    children,
    loading,
    disabled,
    size,
    fullWidth,
    tooltip,
}) {
    if (!size) size = "middle";
    if (!loading) loading = false;
    if (!disabled) disabled = false;

    let style = {};
    if (color === "green")
        style = { backgroundColor: green.primary, borderColor: green.primary };
    else if (color === "volcano")
        style = { backgroundColor: volcano.primary, borderColor: volcano.primary };
    else if (color === "gold")
        style = { backgroundColor: gold.primary, borderColor: gold.primary };
    else if (color === "red")
        style = { backgroundColor: red.primary, borderColor: red.primary };
    else if (color === "blue")
        style = { backgroundColor: blue.primary, borderColor: blue.primary };
    else if (color === "geekblue")
        style = {
            backgroundColor: geekblue.primary,
            borderColor: geekblue.primary,
        };
    if (disabled) style.color = "#d0d0d0";
    style.width = !fullWidth ? "90%" : "100%";

    return (
        <Tooltip title={tooltip} placement="top">
            <Button
                type="primary"
                size={size}
                icon={icon}
                style={style}
                loading={loading}
                onClick={onClick}
                disabled={disabled}
            >
                {children}
            </Button>
        </Tooltip>
    );
}


export function ButtonIcon({
    tooltip,
    icon,
    onClick,
    color,
    size,
    transparent,
    tooltipPlacement,
    loading = false,
    disabled = false,
}) {
    if (!onClick) onClick = () => { };
    let style = {};
    if (color === "green")
        style = { color: green.primary, borderColor: green.primary };
    else if (color === "volcano")
        style = { color: volcano.primary, borderColor: volcano.primary };
    else if (color === "gold")
        style = { color: gold.primary, borderColor: gold.primary };
    else if (color === "red")
        style = { color: red.primary, borderColor: red.primary };
    else if (color === "blue")
        style = { color: blue.primary, borderColor: blue.primary };
    else if (color === "geekblue")
        style = { color: geekblue.primary, borderColor: geekblue.primary };
    if (!size) size = "small";
    if (transparent) style.borderColor = "transparent";
    return (
        <Tooltip title={tooltip} placement={tooltipPlacement || "right"}>
            <Button
                style={style}
                type="ghost"
                shape="circle"
                size={size}
                icon={icon}
                onClick={onClick}
                loading={loading}
                disabled={disabled}
            />
        </Tooltip>
    );
}

export function ButtonExcel({ dataset, filename, loading, color }) {
    const downloadExcel = async () => {
        downloadCsv(dataset, filename);
    };

    return (<>
        {/*<ButtonCustom
            loading={loading}
            disabled={!dataset || dataset.length === 0}
            color={color}
            icon={!dataset || dataset.length === 0 ? <StopOutlined /> : <CloudDownloadOutlined />}
            fullWidth={true}
            onClick={downloadExcel}
            tooltip={!dataset || dataset.length === 0 ? 'Sin Registros' : 'Descargar Formato'}
        >
            {!dataset || dataset.length === 0 ? 'Sin Registros' : 'Descargar Formato'}
        </ButtonCustom>*/}
        <ButtonIcon
            loading={loading}
            disabled={!dataset || dataset.length === 0}
            onClick={downloadExcel}
            size="small"
            transparent={true}
            tooltip={!dataset || dataset.length === 0 ? 'Sin Registros' : 'Descargar Formato'}
            icon={!dataset || dataset.length === 0 ? <XlsxEmptyIcon /> : <CsvIcon />}
        />
    </>
    );
}

export function downloadCsv(dataset, fileName) {
    const ShowLabel = true;
    var arrData = typeof dataset != "object" ? JSON.parse(dataset) : dataset;
    if (arrData.length > 0 && arrData[0].key) {
        arrData.forEach((element) => {
            delete element.key;
        });
    }
    // eslint-disable-next-line
    var CSV = "" + "";

    var row = "";
    var index;
    if (ShowLabel) {
        for (index in arrData[0]) {
            row += index + ",";
        }

        row = row.slice(0, -1);

        CSV += row + "\r";
    }

    for (var i = 0; i < arrData.length; i++) {
        row = "";

        for (index in arrData[i]) {
            if (arrData[i][index] == null) arrData[i][index] = "";
            row += `"${arrData[i][index]
                .toString()
                .replace('"', "")
                .replace('"', "")
                .replace('"', "")
                .replace('"', "")}",`;
        }

        row.slice(0, row.length - 1);

        CSV += row + "\r\n";
    }

    if (CSV === "") {
        alert("Invalid data");
        return;
    }

    var uri = "data:text/csv;charset=utf-8," + escape(CSV);

    var link = document.createElement("a");
    link.href = uri;

    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}