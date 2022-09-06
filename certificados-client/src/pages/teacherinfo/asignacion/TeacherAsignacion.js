import React from "react";

import Breadcrumb from '../../../components/BreadCrumb';
import TitleBar from '../../../components/TitleBar';
import TableAsignaciones from './TableAsignaciones';

export default () => {
    const breadCrumbLinks = [
        {
          text: "Mis asignaciones",
          path: false,
        },
    ];

    return (
        <>
            <Breadcrumb links={breadCrumbLinks} />
            <TitleBar>Mis Asignaciones</TitleBar>
            <TableAsignaciones />
        </>
    )
}