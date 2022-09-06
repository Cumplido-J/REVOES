import React, { useEffect, useState } from 'react'
import { Row, Col, Timeline, Divider, Alert, Tooltip } from "antd";
import { SafetyCertificateOutlined, FileDoneOutlined, UnorderedListOutlined, RollbackOutlined, ArrowUpOutlined, CheckOutlined, WarningOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { Loading, } from "../../../shared/components";
import Alerts from "../../../shared/alerts";

import StudentService from '../../../service/StudentService';
import StudentRecordModal from './StudentRecordModal';
import { userHasRole } from "../../../shared/functions";


async function studentRecordSelect(curp) {
    const response = StudentService.studentRecordSelect(curp);
    return response;
}
async function selectRecordCourse(recordId) {
    const response = StudentService.selectRecordCourse(recordId);
    return response;
}


export default function StudentRecord({ userProfile, studentData, curp }) {
    const [loading, setLoading] = useState(true);
    const [studentId, setStudentId] = useState();
    const [data, setData] = useState({});
    const [record, setRecord] = useState([]);
    const [subject, setSubject] = useState([]);
    const [history, setHitory] = useState([]);
    const [course, setCourse] = useState([]);
    const [calf, setCalf] = useState([]);
    const [school, setSchool] = useState('');
    const [career, setCareer] = useState('');
    const [endign, setEndign] = useState(0);
    const [partial, setPartial] = useState(0);
    const [abrogate, setIAbrogate] = useState(0);

    const getStudentRecord = async () => {
        setLoading(true);
        const response = await studentRecordSelect(curp);
        if (!response.dataRecord) return;
        setLoading(false);
        setStudentId(response.dataRecord.studentId);
        setData(studentData); setEndign(response.dataRecord.endign);
        setPartial(response.dataRecord.partial); setIAbrogate(response.dataRecord.abrogate);
        if (response.dataRecord.studentData) setHitory(response.dataRecord.studentData);
        setSchool(history.schoolName); setCareer(history.careerName);
        if (response.dataRecord.recordData) setRecord(response.dataRecord.recordData);
        if (response.dataRecord.subjectData) setSubject(response.dataRecord.subjectData);
        setCalf(response.dataRecord.subjectData);

    }



    useEffect(() => {
        getStudentRecord();


    }, [curp, studentData, studentId]);

    const onSearchCourse = async (recorid, school, career) => {
        setLoading(true);
        const response = await selectRecordCourse(recorid);
        if (!response.dataCourse) return;
        setCourse(response.dataCourse);
        setSubject(response.dataCourse);
        setSchool(school);
        setCareer(career);
        setLoading(false);
    }

    const onChangeCourse = async (subj, school, career) => {
        setLoading(true);
        if (!subj) setLoading(false);
        setSubject(subj);
        setSchool(school);
        setCareer(career);
        setLoading(false);
    }

    const returnCourseRecors = async (subject, studentId) => {
        setLoading(true);
        const response = await StudentService.returnCourseRecors(subject, studentId);
        if (response.success) {
            setLoading(false);
            Alerts.success("Notificación", "Registro retornado correctamente");
            await getStudentRecord();
        }

    }

    const deleteRowRecord = async (subject, studentId) => {
        const response = await StudentService.deleteRowRecord(subject, studentId);
        if (response.success) {
            Alerts.success("Notificación", "Reegistro eliminado correctamente");
            await getStudentRecord();
        }
    }
    //alert(JSON.stringify("->"+partial))
    return (
        <>
            <Loading loading={loading}>

                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={12}>
                        <Divider orientation="left" plain>
                            <h5><SafetyCertificateOutlined /> Certificados emitidos</h5>
                        </Divider>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={2}></Col>
                            <Col className="gutter-row" span={22}>
                                <br></br>
                                {curp && (
                                    <Timeline>

                                        <Timeline.Item>
                                            {endign > 0 ? (
                                                <StudentRecordModal menssage={`Certificado de Termino: ${endign} `} type={1} curp={curp} studentId={studentId} />
                                            ) : (<p>{`Certificado de Termino: ${endign >= 0 ? endign : 0} `}</p>)}
                                        </Timeline.Item>


                                        <Timeline.Item>
                                            {partial > 0 ? (
                                                <StudentRecordModal menssage={`Cetificado Parcial: ${partial}`} type={2} curp={curp} studentId={studentId} />
                                            ) : (<p>{`Certificado Parcial: ${partial >= 0 ? partial : 0} `}</p>)}
                                        </Timeline.Item>


                                        <Timeline.Item>
                                            {abrogate > 0 ? (
                                                <StudentRecordModal menssage={`Certificado Abrogado: ${abrogate}`} type={3} curp={curp} studentId={studentId} />
                                            ) : (<p>{`Certificado abrogado: ${abrogate >= 0 ? abrogate : 0} `}</p>)}
                                        </Timeline.Item>

                                        {/*{!data.partialCertificate && !data.isPortability && !data.abrogadoCertificate && (
                                            <Alert message="No hay certificados emitidos" type="info" showIcon />
                                        )}*/}
                                    </Timeline>
                                )}
                            </Col>
                        </Row>


                    </Col>

                    <Col className="gutter-row" span={12}>
                        <Divider orientation="left" plain>
                            <h5><FileDoneOutlined /> Datos del Alumno</h5>
                        </Divider>
                        <table className='table table-striped'>
                            {data && (
                                <tbody>

                                    <tr>
                                        <th>Email</th>
                                        <td>{data.email}</td>
                                    </tr>
                                    <tr>
                                        <th>CURP</th>
                                        <td>{data.curp}</td>
                                    </tr>
                                    <tr>
                                        <th>Matrícula</th>
                                        <td>{data.enrollmentKey}</td>
                                    </tr>
                                    <tr>
                                        <th>Nombre</th>
                                        <td>{data.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Primer apellido</th>
                                        <td>{data.firstLastName}</td>
                                    </tr>
                                    <tr>
                                        <th>Segundo apellido</th>
                                        <td>{data.secondLastName}</td>
                                    </tr>
                                    <tr>
                                        <th>Generación</th>
                                        <td>{data.generation}</td>
                                    </tr>

                                </tbody>
                            )}
                        </table>
                    </Col>

                    <Col className="gutter-row" span={24}>
                        <hr></hr>
                        <Divider orientation="left" plain>
                            <h5><SafetyCertificateOutlined /> Datos de procedencia</h5>
                        </Divider>



                        <div className="table-responsive">
                            <table className='table table-striped'>
                                <thead style={{ backgroundColor: '#0C231E', color: '#ffffff' }}>
                                    <tr>
                                        <th>Colegio</th>
                                        <th>CCT</th>
                                        <th>Plantel</th>
                                        <th>Carrera</th>
                                        <th>Estatus</th>
                                        <th><h6><RollbackOutlined /></h6></th>
                                        <th><h6><DeleteOutlined /></h6></th>
                                        <th><h6><UnorderedListOutlined /></h6></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history && (
                                        <tr>
                                            <td>{history.stateName}</td>
                                            <td>{history.cct}</td>
                                            <td>{history.schoolName}</td>
                                            <td>{history.careerName}</td>
                                            <td>{history.studentStatusId ? <Tooltip placement="topLeft" title="Activo"><CheckOutlined style={{ fontSize: '18px', color: '#389e0d' }} /> </Tooltip> : <CloseOutlined />}</td>
                                            <td>
                                                <WarningOutlined style={{ fontSize: '18px', color: 'orange' }} />
                                                {/*<button type='button' className='btn btn-success btn-sm' disabled='false'><RollbackOutlined /></button>*/}
                                            </td>
                                            <td>
                                                <WarningOutlined style={{ fontSize: '18px', color: 'orange' }} />
                                            </td>
                                            <td>
                                                <Tooltip placement="topLeft" title="Semestres en curso">

                                                    <button type='button' onClick={() => onChangeCourse(calf, history.schoolName, history.careerName)} className='btn btn-primary btn-sm'><UnorderedListOutlined /></button>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    )}
                                    {record.map(r => {

                                        return (
                                            <>
                                                <tr>
                                                    <td>{r.stateName}</td>
                                                    <td>{r.cct}</td>
                                                    <td>{r.schoolName}</td>
                                                    <td>{r.careerName}</td>
                                                    <td>{r.studentStatusId ? <Tooltip placement="topLeft" title="Hitorial"><ArrowUpOutlined style={{ fontSize: '18px', color: '#000000' }} /> </Tooltip> : "No"}</td>
                                                    <td>
                                                        <Tooltip placement="topLeft" title="Retornar historial">
                                                            {userHasRole.dev(userProfile.roles) ? <button type='button' onClick={() => returnCourseRecors(r, studentId)} className='btn btn-success btn-sm'><RollbackOutlined /></button> : <WarningOutlined style={{ fontSize: '18px', color: 'orange' }} />}
                                                        </Tooltip>
                                                    </td>
                                                    <td>
                                                        <Tooltip placement="topLeft" title="Eliminar historial">
                                                            {userHasRole.dev(userProfile.roles) ? <button type='button' onClick={() => deleteRowRecord(r, studentId)} className='btn btn-warning btn-sm'><DeleteOutlined /></button> : <WarningOutlined style={{ fontSize: '18px', color: 'orange' }} />}
                                                        </Tooltip>
                                                    </td>
                                                    <td>
                                                        <Tooltip placement="topLeft" title="Semestres cursados">
                                                            <button type='button' onClick={() => onSearchCourse(r.id, r.schoolName, r.careerName)} className='btn btn-primary btn-sm'><UnorderedListOutlined /></button>
                                                        </Tooltip>
                                                    </td>
                                                </tr>
                                            </>
                                        );

                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={24}>
                        <Divider orientation="left" >
                            <h5><UnorderedListOutlined /> Semestres cursados o en proceso</h5>
                        </Divider>
                        {subject.length > 0 && (
                            <table className='table table-sm' style={{ backgroundColor: '#0C231E', color: '#ffffff' }}>
                                <tbody>
                                    <tr>
                                        <th style={{ textAlign: 'right' }} width='10%'>Plantel: </th>
                                        <td style={{ textAlign: 'left' }} width='40%'>{school}</td>
                                        <th style={{ textAlign: 'right' }} width='10%'>Carrera: </th>
                                        <td style={{ textAlign: 'left' }} width='40%'>{career}</td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                        {subject.length == 0 && (
                            <Alert
                                message={<strong>ATENCIÓN</strong>}
                                description={
                                    <>
                                        <p>¡Por el momento no hay registros parciales que mostrar!</p>


                                    </>
                                }
                                type="info"
                                showIcon
                            />
                        )}
                    </Col>
                    {subject.length > 0 && (
                        <Col className="gutter-row" span={24}>


                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col className="gutter-row" md={12}>
                                    <UpdateTreeData subject={subject} semestre={1} />
                                </Col>

                                <Col className="gutter-row" md={12}>
                                    <UpdateTreeData subject={subject} semestre={2} />
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col className="gutter-row" span={12}>
                                    <UpdateTreeData subject={subject} semestre={3} />
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <UpdateTreeData subject={subject} semestre={4} />
                                </Col>
                            </Row>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col className="gutter-row" span={12}>
                                    <UpdateTreeData subject={subject} semestre={5} />
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <UpdateTreeData subject={subject} semestre={6} />
                                </Col>
                            </Row>

                        </Col>
                    )}
                </Row>
            </Loading>
        </>
    )
}


function UpdateTreeData({ subject, semestre }) {
    //alert(JSON.stringify(subject))
    return (<>
        <Divider orientation="left" plain>
            <h5><SafetyCertificateOutlined /> {`${semestre}°`} Semestre</h5>
        </Divider>
        <table className="table table-striped table-bordered table-sm" style={{ fontSize: '12px' }}>
            <thead className="thead-inverse" style={{ backgroundColor: '#0C231E', color: '#ffffff' }}>
                <tr>
                    <th>Materias</th>
                    <th>Créditos</th>
                    <th>Calificaciones</th>
                </tr>
            </thead>
            <tbody>
                {subject.map(node => {
                    if (node.periodNumber == semestre) {
                        return (
                            <>
                                <tr>
                                    <td>{node.name}</td>
                                    <td>{node.credits}</td>
                                    <td>{node.score}</td>
                                </tr>
                            </>
                        );
                    }
                })}
            </tbody>
        </table>
    </>);
}