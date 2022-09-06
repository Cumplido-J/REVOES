import React from "react";

import Icon from "@ant-design/icons";

import XmlSvg from "../icons/xml.svg";
import CloseSvg from "../icons/close.svg";
import PdfSvg from "../icons/pdf.svg";
import GroupSvg from "../icons/group.svg";
import XlsxSvg from "../icons/IconXLSX.svg";
import CsvSvg from "../icons/IconCSV.svg";
import DownloadXlsx from "../icons/IconXlsxDownload.svg";
import XlsxEmptySvg from "../icons/IconXlsxEmpty.svg";

export const PdfIcon = () => <Icon component={() => <img src={PdfSvg} alt="" />} />;
export const XmlIcon = () => <Icon component={() => <img src={XmlSvg} alt="" />} />;
export const CloseIcon = () => <Icon component={() => <img src={CloseSvg} alt="" />} />;
export const GroupIcon = () => <Icon component={() => <img src={GroupSvg} alt="" />} />;
export const XlsxIcon = () => <Icon component={() => <img src={XlsxSvg} width="35" alt="" />} />;
export const CsvIcon = () => <Icon component={() => <img src={CsvSvg} width="35" alt="" />} />;
export const DownloadXlsxIcon = () => <Icon component={() => <img src={DownloadXlsx} width="35" alt="" />} />;
export const XlsxEmptyIcon = () => <Icon component={() => <img src={XlsxEmptySvg} width="35" alt="" />} />;
