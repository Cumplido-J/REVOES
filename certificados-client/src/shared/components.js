import React from "react";
import { Link } from "react-router-dom";

import { FileExcelOutlined } from "@ant-design/icons";
import { volcano, green, gold, red, blue, geekblue } from "@ant-design/colors";
import { Button, Select, Skeleton, Spin, Tooltip } from "antd";
import { downloadCsv,downloadCsvAnswer, downloadCsvAnswerGraduated, downloadCsvGraduatedState, downloadCsvGraduatedSchool, downloadCsvGraduatedSchoolCareer, downloadCsvEnrollmentSchool, downloadCsvEnrollmentSchoolCareer, downloadCsvStudyLevelState, downloadCsvStudyLevelSchool, downloadCsvStudyLevelSchools, downloadCsvMasiveLoadGraduates, downloadXlsxMasiveGraduates} from "./functions";
import { CsvIcon, XlsxIcon } from "../components/CustomIcons";

const primaryColor = "#9d2449";

export function PageLoading({ children, loading }) {
  if (!loading) return children;
  return (
    <div
      className="container"
      style={{ marginTop: "2em", marginBottom: "2em" }}
    >
      <Skeleton active paragraph={{ rows: 5 }} />
    </div>
  );
}

export function Loading({ children, loading }) {
  return (
    <Spin tip="Cargando..." size="large" spinning={loading}>
      {children}
    </Spin>
  );
}
export function PrimaryButton({
  children,
  icon,
  loading,
  size,
  fullWidth,
  disabled,
  onClick,
}) {
  let primaryStyle = {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
  };

  primaryStyle.width = !fullWidth ? "90%" : "100%";
  if (!size) size = "middle";
  if (!loading) loading = false;

  const otherProps = {};
  if (onClick) otherProps.onClick = onClick;
  return (
    <Button
      htmlType="submit"
      type="primary"
      size={size}
      loading={loading}
      icon={icon}
      style={primaryStyle}
      disabled={disabled}
      {...otherProps}
    >
      {children}
    </Button>
  );
}
export function Title({ children }) {
  return (
    <>
      <h2 style={{ fontWeight: "600", color: "#404041" }}>{children}</h2>
      <hr className="red" />
    </>
  );
}
export function Subtitle({ children }) {
  return (
    <>
      <h3 style={{ fontWeight: "600", color: "#404041" }}>{children}</h3>
      <hr className="red" />
    </>
  );
}

export function SearchSelect({ onChange, dataset, value, disabled, mode }) {
  let tooltip = "";
  let style = { width: "90%" };

  if (!value) value = null;
  else {
    tooltip = dataset.find((el) => el.id === value);
    tooltip = tooltip ? tooltip.description : "";
  }

  if (!onChange) onChange = (value) => {
    return value;
  };

  return (
    <Tooltip title={tooltip}>
      <Select
        mode={mode ? mode : false}
        disabled={disabled}
        allowClear
        showSearch
        placeholder="Selecciona una opción"
        optionFilterProp="children"
        onChange={onChange}
        value={value}
        style={style}
      >
        {dataset.map((element) => {
          return (
            <Select.Option
              key={element.id}
              title={element.description}
              value={element.id}
            >
              {element.description}
            </Select.Option>
          );
        })}
      </Select>
    </Tooltip>
  );
}

export function SearchInputSelect({ onChange, onSearch, dataset, value, disabled, mode }) {
  let tooltip = "";
  let style = { width: "90%" };

  if (!value) value = null;
  else {
    tooltip = dataset.find((el) => el.id === value);
    tooltip = tooltip ? tooltip.description : "";
  }

  if (!onChange) onChange = () => {};

  return (
    <Tooltip title={tooltip}>
      <Select
        mode={mode ? mode : false}
        disabled={disabled}
        allowClear
        showSearch
        placeholder="Selecciona una opción"
        optionFilterProp="children"
        onChange={onChange}
        value={value}
        style={style}
        filterOption={false}
        defaultActiveFirstOption={false}
        showArrow={false}
        notFoundContent={null}
        onSearch={onSearch}
      >
        {dataset.map((element) => {
          return (
            <Select.Option
              key={element.id}
              title={element.description}
              value={element.id}
            >
              {element.description}
            </Select.Option>
          );
        })}
      </Select>
    </Tooltip>
  );
}

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
  type = "primary",
  width,
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
  else if (color === "redCDMX")
    style = { backgroundColor: primaryColor, borderColor: primaryColor };
  else if (color === "geekblue")
    style = {
      backgroundColor: geekblue.primary,
      borderColor: geekblue.primary,
    };
  if (disabled) style.color = "#d0d0d0";
  if (!width) style.width = !fullWidth ? "90%" : "100%";
  else if (width) style.width = width;

  return (
    <Tooltip title={tooltip} placement="top">
      <Button
        type={type}
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
export function ButtonCustomLink({
  link,
  icon,
  color,
  children,
  loading,
  disabled,
  size,
}) {
  return (
    <Link to={link}>
      <ButtonCustom
        color={color}
        icon={icon}
        loading={loading}
        disabled={disabled}
        size={size}
      >
        {children}
      </ButtonCustom>
    </Link>
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
  if (!onClick) onClick = () => {};
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

export function ButtonIconLink({
  tooltip,
  icon,
  onClick,
  color,
  link,
  transparent,
  size,
  tooltipPlacement,
}) {
  return (
    <Link to={link}>
      <ButtonIcon
        color={color}
        icon={icon}
        onClick={onClick}
        tooltip={tooltip}
        transparent={transparent}
        size={size}
        tooltipPlacement={tooltipPlacement}
      />
    </Link>
  );
}

export function ButtonIconHref({
  tooltip,
  icon,
  color,
  size,
  href,
  transparent,
  tooltipPlacement,
  loading = false,
}) {
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
        type="link"
        shape="circle"
        size={size}
        icon={icon}
        href={href}
        loading={loading}
      />
    </Tooltip>
  );
}

export function ButtonExcel({ dataset, filename, loading }) {
  const downloadExcel = async () => {
    downloadCsv(dataset, filename);
  };

  return (
    <ButtonCustom
      loading={loading}
      disabled={!dataset || dataset.length === 0}
      color="green"
      icon={<FileExcelOutlined />}
      fullWidth={true}
      onClick={downloadExcel}
    >
      Exportar a excel
    </ButtonCustom>
  );
}

export function ButtonExcelAnswer({ dataset, filename, loading }) {
  const downloadExcel = async () => {
    downloadCsvAnswer(dataset, filename);
  };

  return (
    <ButtonCustom
      loading={loading}
      disabled={!dataset || dataset.length === 0}
      color="green"
      icon={<FileExcelOutlined />}
      fullWidth={true}
      onClick={downloadExcel}
    >
      Descarga de respuestas de encuesta
    </ButtonCustom>
  );
}
export function ButtonExcelAnswerGraduated({ dataset, filename, loading }) {
  const downloadExcel = async () => {
    downloadCsvAnswerGraduated(dataset, filename);
  };

  return (
    <ButtonCustom
      loading={loading}
      disabled={!dataset || dataset.length === 0}
      color="green"
      icon={<FileExcelOutlined />}
      fullWidth={true}
      onClick={downloadExcel}
    >
      Descarga de respuestas de encuesta
    </ButtonCustom>
  );
}

///reporte graduados titulados
export function ButtonExcelReportGraduatedState({ dataset, filename, loading }) {
  const downloadExcel = async () => {
    downloadCsvGraduatedState(dataset, filename);
  };

  return (
    <ButtonCustom
      loading={loading}
      disabled={!dataset || dataset.length === 0}
      color="green"
      icon={<FileExcelOutlined />}
      fullWidth={true}
      onClick={downloadExcel}
    >
      Descarga por Edo.
    </ButtonCustom>
  );
}

export function ButtonExcelReportGraduatedSchool({ dataset, filename, loading }) {
  const downloadExcel = async () => {
    downloadCsvGraduatedSchool(dataset, filename);
  };

  return (
    <ButtonCustom
      loading={loading}
      disabled={!dataset || dataset.length === 0}
      color="green"
      icon={<FileExcelOutlined />}
      fullWidth={true}
      onClick={downloadExcel}
    >
      Descarga por Plantel
    </ButtonCustom>
  );
}

export function ButtonExcelReportGraduatedSchoolCareer({ dataset, filename, loading }) {
  const downloadExcel = async () => {
    downloadCsvGraduatedSchoolCareer(dataset, filename);
  };

  return (
    <ButtonCustom
      loading={loading}
      disabled={!dataset || dataset.length === 0}
      color="green"
      icon={<FileExcelOutlined />}
      fullWidth={true}
      onClick={downloadExcel}
    >
      Descarga por Carrera
    </ButtonCustom>
  );
}


//descrga reporte matriculacion por escuela
export function ButtonExcelReportEnrollmentSchool({ dataset, filename, loading }) {
  const downloadExcel = async () => {
    downloadCsvEnrollmentSchool(dataset, filename);
  };

  return (
    <ButtonCustom
      loading={loading}
      disabled={!dataset || dataset.length === 0}
      color="green"
      icon={<FileExcelOutlined />}
      fullWidth={true}
      onClick={downloadExcel}
    >
      Descarga por Plantel
    </ButtonCustom>
  );
}

//descrga reporte matriculacion por carrera
export function ButtonExcelReportEnrollmentSchoolCareer({ dataset, filename, loading }) {
  const downloadExcel = async () => {
    downloadCsvEnrollmentSchoolCareer(dataset, filename);
  };

  return (
    <ButtonCustom
      loading={loading}
      disabled={!dataset || dataset.length === 0}
      color="green"
      icon={<FileExcelOutlined />}
      fullWidth={true}
      onClick={downloadExcel}
    >
      Descarga por Carrera
    </ButtonCustom>
  );
}

//Reporte nivel estudios
export function ButtonExcelReportStudyLevelState({ dataset, filename, loading }) {
  const downloadExcel = async () => {
    downloadCsvStudyLevelState(dataset, filename);
  };

  return (
    <ButtonCustom
      loading={loading}
      disabled={!dataset || dataset.length === 0}
      color="green"
      icon={<FileExcelOutlined />}
      fullWidth={true}
      onClick={downloadExcel}
    >
      Descarga por Edo.
    </ButtonCustom>
  );
}

export function ButtonExcelReportStudyLevelSchools({ dataset, filename, loading }) {
  const downloadExcel = async () => {
    downloadCsvStudyLevelSchools(dataset, filename);
  };

  return (
    <ButtonCustom
      loading={loading}
      disabled={!dataset || dataset.length === 0}
      color="green"
      icon={<FileExcelOutlined />}
      fullWidth={true}
      onClick={downloadExcel}
    >
      Descarga por Plantel
    </ButtonCustom>
  );
}

export function ButtonExcelReportStudyLevelSchool({ dataset, filename, loading }) {
  const downloadExcel = async () => {
    downloadCsvStudyLevelSchool(dataset, filename);
  };

  return (
    <ButtonCustom
      loading={loading}
      disabled={!dataset || dataset.length === 0}
      color="green"
      icon={<FileExcelOutlined />}
      fullWidth={true}
      onClick={downloadExcel}
    >
      Descarga por Plantel
    </ButtonCustom>
  );
}

//PARA CARGA_MASIVA_6TO
export function ButtonExcelMasiveLoadGraduates({ filename, loading }) {
  const downloadExcel = async () => {
    downloadCsvMasiveLoadGraduates(filename);
  };

  return (
    <ButtonIcon
      /*loading={loading}
      color="green"
      icon={<FileExcelOutlined />}
      fullWidth={true}
      onClick={downloadExcel}*/
      loading={loading}
      onClick={downloadExcel}
      size="small"
      transparent={true}
      tooltip="Descargar CSV"
      icon={<CsvIcon />}
    >
      Descarga csv plantilla
    </ButtonIcon>
  );
}

export function ButtonExcelGraduationXlsx({filename, loading}) { 
  const downloadExcel = async () => {
    downloadXlsxMasiveGraduates(filename);
  };

  return (
    <ButtonIcon
      loading={loading}
      onClick={downloadExcel}
      size="small"
      transparent={true}
      tooltip="Descargar XLSX"
      icon={<XlsxIcon />}
    >
      Descarga xlsx plantilla
    </ButtonIcon>
  );
 }