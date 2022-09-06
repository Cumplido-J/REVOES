import React, { useEffect, useState } from "react";
import { Divider, Table, Tag } from "antd";
import { SettingOutlined, CheckOutlined, CloseOutlined, CheckCircleOutlined } from "@ant-design/icons";
import StudentSettingService from "../../service/StudentSettingService";
import { Loading, PrimaryButton, ButtonIconLink } from "../../shared/components";
import alerts from "../../shared/alerts";


export default function StudentSetting(props) {
    const { curp } = props.match.params;
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const studentRole = async (curp) => {
        setLoading(true);
        const response = await StudentSettingService.selectUserRole(curp);
        if (!response.roles) return;
        setRoles(response.roles);
        setLoading(false);
    }
    useEffect(() => {
        studentRole(curp);
    }, [curp]);

    const assignRole = async (studentId) => {
        if (studentId == null) return;
        setLoading(true);
        const response = await StudentSettingService.assignRole(studentId);
        if (!response.success) return;
        await studentRole(curp);
        setLoading(false);
        alerts.success("Proceso correcto", "Rol asignado correctamente");
    }

    const onloadSetting = async () => {
        await studentRole(curp);
    }

    const columns = [
        {
            title: 'Alumno',
            dataIndex: 'curp',
            key: 'curp',
        },
        {
            title: 'Rol',
            dataIndex: 'roleName',
            key: 'roleName',
            render: (text, record) => (
                <>
                    {record.roleName && (
                        <Tag color="green" key='loser'>
                            {record.roleName}
                        </Tag>
                    )}
                    {!record.roleName && (
                        <PrimaryButton icon={<CheckCircleOutlined />} onClick={() => assignRole(record.studentId)} loading={loading} size="small" fullWidth={false}>
                            Asignar rol
                        </PrimaryButton>
                    )}
                </>
            ),
        },
        {
            title: 'Estatus de Logueo',
            dataIndex: 'statusSignIn',
            key: 'statusSignIn',
            render: (text, record) => (
                <>
                    {record.statusSignIn && (<CheckOutlined style={{ fontSize: '18px', color: '#73d13d' }} />)}
                    {!record.statusSignIn && (<CloseOutlined style={{ fontSize: '18px', color: '#ff4d4f' }} />)}
                </>
            ),
        },
        {
            title: 'Estatus del Alumno',
            dataIndex: 'statusStudent',
            key: 'statusStudent',
            render: (text, record) => (
                <>
                    {record.statusStudent && (<CheckOutlined style={{ fontSize: '18px', color: '#73d13d' }} />)}
                    {!record.statusStudent && (<CloseOutlined style={{ fontSize: '18px', color: '#ff4d4f' }} />)}
                </>
            ),
        },
    ];
    return (
        <>
            <Loading loading={loading}>

                <Divider orientation="left">
                    <ButtonIconLink
                        tooltip="Ajustes"
                        icon={<SettingOutlined />}
                        color="green"
                        onClick={() => onloadSetting()}
                    />  Configuraciones</Divider>
                <Table dataSource={roles} columns={columns} />
                <hr></hr>
                <br></br>
            </Loading>
        </>
    );
}