import React, { useEffect, useState } from "react";
import { Modal, Form, Table, Input, Space, Popconfirm } from "antd";
import { Loading, ButtonIcon, ButtonIconLink } from "../../shared/components";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import alerts from "../../shared/alerts";

import SchoolService from "../../service/SchoolService";

const { Column, ColumnGroup } = Table;
const { confirm } = Modal;

export default function SchoolEquivalentData({ school, setSchool }) {
    const [loading, setLoading] = useState(true);
    const [schoolData, setSchoolData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const getCareerData = async () => {
            setLoading(true);
            setLoading(false);
            setShowModal(true);
        };
        if (school === null) {
            setSchoolData([]);
            setShowModal(false);
        } else {
            getCareerData();
            searchSchoolData(school);
        }
    }, [school]);

    const searchSchoolData = async function (school) {
        if (!school) return;
        setLoading(true);
        const response = await SchoolService.selectSchoolEquivalent(school)
        setLoading(false);
        const datos = response.schoolData.map((s) => (
            {
                schoolId: s.schoolId,
                cct: s.cct,
                pdfName: s.pdfName,
                cityId: s.cityId,
                cityName: s.cityName,
                state: s.state,
                stateId: s.stateId,
                gender: s.gender
            }
        ));
        setSchoolData(datos);
    };

    const deleteRow = async function (school) {
        form.setFieldsValue({ ...school });
        const confirmDelete = async (values) => {
            if (!values) return;
            setLoading(true);
            const response = await SchoolService.deleteSchoolEquivalent(values);
            if (!response.success) return;
            alerts.success("Registro Eliminado !", "Registro eliminado correctamente");
            await searchSchoolData();
            setLoading(false);
        };

        Modal.confirm({
            title: '¿Seguro que desea eliminar este registro?',
            icon: <ExclamationCircleOutlined />,
            content: (
                <>
                    <Form form={form} onFinish={confirmDelete} layout="vertical">
                        <Form.Item name="schoolId">
                            <Input type="hidden" />
                        </Form.Item>
                    </Form>
                </>
            ),
            okText: 'Aceptar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: form.submit,
            onCancel() {
                console.log('Cancel');
            },
            centered: true,
            zIndex: 1040,

        });
    }


    return (
        <Modal
            onCancel={() => {
                setSchool(null);
            }}
            visible={showModal}
            width="80%" zIndex={1040} centered title={"Plantel Equivalente"} footer={null} >

            <Loading loading={loading}>

                <Table dataSource={schoolData}>
                    <Column title="Estado" dataIndex="state" key="state" />
                    <Column title="Municipio" dataIndex="cityName" key="cityName" />
                    <Column title="CCT" dataIndex="cct" key="cct" />
                    <Column
                        title="Género"
                        key="gender"
                        render={(text, record) => (
                            <Space size="middle">
                                {record.gender == 1 ? 'El' : 'La'}
                            </Space>
                        )}
                    />
                    <Column title="Nombre Pdf" dataIndex="pdfName" key="pdfName" />
                    <Column
                        title="Action"
                        key="action"
                        render={(text, record) => (
                            <Space size="middle">

                                <ButtonIconLink
                                    tooltip="Vista Equivalencia"
                                    icon={<EditOutlined />}
                                    color="green"
                                    link={`/PlantelesEquivalentes/Edit/${record.cct}/${record.schoolId}/${record.stateId}`}
                                />
                                {"  |  "}
                                <ButtonIcon
                                    onClick={() => deleteRow(record)}
                                    tooltip="Eliminar Equivalencia"
                                    icon={<DeleteOutlined />}
                                    color="red"
                                />

                            </Space>
                        )}
                    />
                </Table>,

            </Loading>
        </Modal>
    );
}