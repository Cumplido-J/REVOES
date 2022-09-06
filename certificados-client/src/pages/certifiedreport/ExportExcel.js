import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { DownloadXlsxIcon, XlsxEmptyIcon } from '../../components/CustomIcons';
import { ButtonIcon } from '../../shared/components';

export const ExportExcel = ({filename, dataset,loading}) => {
    const hanldleOnExport = () => {
        console.log(dataset)
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(dataset);

        XLSX.utils.book_append_sheet(wb, ws, "myFile");
        XLSX.writeFile(wb, filename+".xlsx");
    }

    return (
        <>
            <ButtonIcon 
            loading={loading}          
            disabled={!dataset || dataset.length === 0}
            onClick={hanldleOnExport}
            size="small"
            transparent={true}
            tooltip={!dataset || dataset.length === 0 ? 'Sin Registros' : 'Descargar Reporte'}
            icon={!dataset || dataset.length === 0 ? <XlsxEmptyIcon /> : <DownloadXlsxIcon />}
        />
        </>
    );
}