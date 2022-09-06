import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { DownloadXlsxIcon, XlsxEmptyIcon } from '../../../components/CustomIcons';
import { ButtonIcon } from '../../../shared/components';

export const ExportExcel = ({fileName, dataSet}) => {
    const [sheetData, setSheetData] = useState(null);

    useEffect(() => {
        setSheetData(dataSet);
    }, [dataSet]);
    const hanldleOnExport = () => {
        console.log(sheetData)
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(sheetData);

        XLSX.utils.book_append_sheet(wb, ws, "myFile");
        XLSX.writeFile(wb, fileName+".xlsx");
    }

    return (
        <>
            {/*<Button icon={<DownloadXlsxIcon />} onClick={hanldleOnExport}>Descargar excel</Button>*/}
            
            <ButtonIcon           
            disabled={!sheetData || sheetData.length === 0}
            onClick={hanldleOnExport}
            size="small"
            transparent={true}
            tooltip={!sheetData || sheetData.length === 0 ? 'Sin Registros' : 'Descargar Formato'}
            icon={!sheetData || sheetData.length === 0 ? <XlsxEmptyIcon /> : <DownloadXlsxIcon />}
        />
        </>
    );
}