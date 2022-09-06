import React, { useEffect, useState } from "react";
import { Row, Col, Input, Form, Modal, Switch, Space, DatePicker, InputNumber } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

import CertificateService from "../../service/CertificateService";

import alerts from "../../shared/alerts";
import { Loading, PrimaryButton, Subtitle } from "../../shared/components";

const colProps = {
    xs: { span: 24 },
    md: { span: 8 },
};
const rowProps = {
    style: { marginBottom: "1em" },
};
const validateMessages = {
    required: "¡Este campo es requerido!",
};
const validations = {
    score: [
        {
            required: true,
            validator: (rule, value) => {
                if (!isNaN(value) && parseFloat(value).toFixed(1) <= 10.0 && parseFloat(value).toFixed(1) > 0.0) {
                    return Promise.resolve();
                }
                return Promise.reject("Ingresa una calificación menor o igual a 10");
            },
        },
    ],
    default: [{ required: true }],
};

export default function CertificateValidateData({ student, reloadStudents, setStudent, editable }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [toggleEdit, setToggleEdit] = useState(false);

    useEffect(() => {
        const selectDataStudent = async () => {
            setLoading(true);
            const response = await CertificateService.selectDataStudent(student);
            //alert(JSON.stringify(response))
            setLoading(false);
            if (!response.success) return;
            setStudentData(response.studentData);
            setShowModal(true);
            
        }
        if (student === null) {
            setStudentData({});
            setToggleEdit(false);
            setShowModal(false);
        } else {
            selectDataStudent();
        }
    }, [student]);

    

    const handleFinishFailed = () => {
        alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
    };
    

    
    return (
        <Modal
            onCancel={() => {
                setStudent(null);
            }}
            visible={showModal}
            width="66%"
            zIndex={1040}
            centered
            title={"Alumno"}
        >
            <Loading loading={loading}>
                <Subtitle>Información del alumno</Subtitle>                
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Curp: </th>
                            <td>{studentData.curp}</td>
                            <td>{ studentData.curp ? <CheckCircleOutlined style={{ fontSize: '16px', color: 'green' }}  /> : <CloseCircleOutlined style={{ fontSize: '16px', color: 'red' }} />}</td>
                        </tr>
                        <tr>
                            <th>Nombre: </th>
                            <td>{studentData.name}</td>
                            <td>{ studentData.name ? <CheckCircleOutlined style={{ fontSize: '16px', color: 'green' }}  /> : <CloseCircleOutlined style={{ fontSize: '16px', color: 'red' }} />}</td>
                        </tr>
                        <tr>
                            <th>Primer Apellido: </th>
                            <td>{studentData.firstLastName}</td>
                            <td>{ studentData.firstLastName ? <CheckCircleOutlined style={{ fontSize: '16px', color: 'green' }}  /> : <CloseCircleOutlined style={{ fontSize: '16px', color: 'red' }} />}</td>
                        </tr>
                        <tr>
                            <th>Segundo Apellido: </th>
                            <td>{studentData.secondLastName}</td>
                            <td>{ studentData.secondLastName ? <CheckCircleOutlined style={{ fontSize: '16px', color: 'green' }}  /> : <CloseCircleOutlined style={{ fontSize: '16px', color: 'red' }} />}</td>
                        </tr>

                        <tr>
                            <th>Matrícula: </th>
                            <td>{studentData.enrollmentKey}</td>
                            <td>{ studentData.enrollmentKey ? <CheckCircleOutlined style={{ fontSize: '16px', color: 'green' }}  /> : <CloseCircleOutlined style={{ fontSize: '16px', color: 'red' }} />}</td>
                        </tr>
                        <tr>
                            <th>Periodo inicial: </th>
                            <td>{studentData.enrollmentStartDate}</td>
                            <td>{ studentData.enrollmentStartDate ? <CheckCircleOutlined style={{ fontSize: '16px', color: 'green' }}  /> : <CloseCircleOutlined style={{ fontSize: '16px', color: 'red' }} />}</td>
                        </tr>
                        <tr>
                            <th>Periodo final: </th>
                            <td>{studentData.enrollmentEndDate}</td>
                            <td>{ studentData.enrollmentEndDate ? <CheckCircleOutlined style={{ fontSize: '16px', color: 'green' }}  /> : <CloseCircleOutlined style={{ fontSize: '16px', color: 'red' }} />}</td>
                        </tr>
                        <tr>
                            <th>Calificacion final: </th>
                            <td>{studentData.finalScore}</td>
                            <td>{ studentData.finalScore ? <CheckCircleOutlined style={{ fontSize: '16px', color: 'green' }}  /> : <CloseCircleOutlined style={{ fontSize: '16px', color: 'red' }} />}</td>
                        </tr>
                        
                        <tr>
                            <th>Plantel: </th>
                            <td>{studentData.pdfFinalName}</td>
                            <td>{ studentData.pdfFinalName ? <CheckCircleOutlined style={{ fontSize: '16px', color: 'green' }}  /> : <CloseCircleOutlined style={{ fontSize: '16px', color: 'red' }} />}</td>
                        </tr>
                        <tr>
                            <th>CCT: </th>
                            <td>{studentData.cct}</td>
                            <td>{ studentData.cct ? <CheckCircleOutlined style={{ fontSize: '16px', color: 'green' }}  /> : <CloseCircleOutlined style={{ fontSize: '16px', color: 'red' }} />}</td>
                        </tr>
                        <tr>
                            <th>Carrera: </th>
                            <td>{studentData.careerName}</td>
                            <td>{ studentData.careerName ? <CheckCircleOutlined style={{ fontSize: '16px', color: 'green' }}  /> : <CloseCircleOutlined style={{ fontSize: '16px', color: 'red' }} />}</td>
                        </tr>
                        <tr>
                            <th>Clave Carrera: </th>
                            <td>{studentData.careerKey}</td>
                            <td>{ studentData.careerKey ? <CheckCircleOutlined style={{ fontSize: '16px', color: 'green' }}  /> : <CloseCircleOutlined style={{ fontSize: '16px', color: 'red' }} />}</td>
                        </tr>
                       
                        <tr>
                            <th>Tipo perfil: </th>
                            <td>{studentData.profileType}</td>
                            <td>{ studentData.profileType ? <CheckCircleOutlined style={{ fontSize: '16px', color: 'green' }}  /> : <CloseCircleOutlined style={{ fontSize: '16px', color: 'red' }} />}</td>
                        </tr>
                        
                    </tbody>
                </table>

               
            </Loading>
        </Modal>
    );
}
