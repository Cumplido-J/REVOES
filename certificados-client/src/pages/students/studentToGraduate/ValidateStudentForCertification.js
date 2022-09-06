import React, { useEffect, useState } from "react";
import {
  ButtonCustom,
  PrimaryButton,
  SearchSelect,
} from "../../../shared/components";
import { SyncOutlined } from "@ant-design/icons";
import { Typography, Form, Col, Row, DatePicker } from "antd";
import Modal from "antd/lib/modal/Modal";
import SearchTable from "./SearchTable";
import alerts from "../../../shared/alerts";
import StudentService from "../../../service/StudentService";
import CatalogService from "../../../service/CatalogService";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";
import moment from "moment";
import { generationCatalog } from "../../../shared/catalogs";
import { async } from "q";

const styles = {
  colProps: {
    xs: { span: 24 },
    md: { span: 8 },
  },
  rowProps: {
    style: { marginBottom: "1em" },
  },
};

const ValidateStudentForCertification = ({ students = [], onSync, stateSelected }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generationSelected, setGenerationSelected] = useState(false);
  const [periodsEnd, setPeriodsEnd] = useState([]);
  const [form] = Form.useForm();

  const handleOpen = () => {
    setShowModal(true);
    alerts.info(
      "Nota",
      "Los alumnos que se validen para certificación ya no aparecerán en los filtros de alumnos por egresar"
    );
  };

  const handleClose = () => {
    form.setFieldsValue({
      periodo_inicio: "",
      periodo_termino: "",
      generacion: "",
    });
    setShowModal(false);
  };

  const handleSync = async ({
    periodo_inicio,
    periodo_termino,
    generacion,
  }) => {
    setLoading(true);
    const data = {};
    if (periodo_inicio)
      data.periodo_inicio = moment(periodo_inicio).format("YYYY/MM/DD");
    if (periodo_termino)
      data.periodo_termino = moment(periodo_termino).format("YYYY/MM/DD");
      //data.periodo_termino = periodo_termino;
    if (generacion) data.generacion = generacion;
    const syncResponse = await StudentService.syncStudentsGradesForCertificates(
      students.map((s) => s.usuario_id),
      data
    );
    if (syncResponse && syncResponse.success) {
      alerts.success("Listo", syncResponse.message);
      onSync();
      handleClose();
    }
    setLoading(false);
  };

  const handleSelectGeneration = async (value) => {
    let currentDate = new Date();
    if(currentDate.getFullYear() === parseInt(value.split('-')[1])) {
      const response = await CatalogService.getCertificationPeriodsConfig({
        generacion: value,
        estado_id: stateSelected
      });
      if(response && response.success) {
        if(response?.type?.config_periodo) {
          setPeriodsEnd([
            { id: response?.type?.config_periodo.periodo_uno, description: response?.type?.config_periodo.periodo_uno },
            { id: response?.type?.config_periodo.periodo_dos, description: response?.type?.config_periodo.periodo_dos },
            { id: response?.type?.config_periodo.periodo_tres, description: response?.type?.config_periodo.periodo_tres }
          ]);
          form.setFieldsValue({periodo_inicio: moment(response?.type?.config_periodo.periodo_inicio)});
        }
        setGenerationSelected(currentDate.getFullYear() === parseInt(value.split('-')[1]));
      }
    }
  };

  const handleOnFinish = () => {
    form.submit();
  };

  return (
    <PermissionValidator
      permissions={[
        permissionList.SINCRONIZAR_CALIFICACIONES_PARA_CERTIFICADOS,
      ]}
      allPermissions={true}
    >
      <Typography.Paragraph>
        Los alumnos irregulares no podrán ser seleccionados para validarse para
        certificación.
      </Typography.Paragraph>
      <ButtonCustom
        disabled={!students.length}
        icon={<SyncOutlined />}
        onClick={handleOpen}
        fullWidth={true}
      >
        Validar alumnos seleccionados para certificación
      </ButtonCustom>
      <Modal
        width="100%"
        visible={showModal}
        title="Validar alumnos seleccionados para certificación"
        confirmLoading={loading}
        onOk={handleOnFinish}
        onCancel={handleClose}
      >
        <Typography.Title level={5}>Nota</Typography.Title>
        <Typography.Paragraph>
          Los alumnos que se validen para certificación ya no aparecerán en los
          filtros de alumnos por egresar.
        </Typography.Paragraph>
        <Typography.Paragraph>
          Los alumnos irregulares no podrán ser seleccionados para este proceso.
        </Typography.Paragraph>
        <Typography.Title level={5}>Alumnos seleccionados</Typography.Title>
        <SearchTable students={students} readOnly={true} />
        <Typography.Title level={5}>
          Modificar periodo de termino y periodo fin
        </Typography.Title>
        <Typography.Paragraph>
          Al seleccionar generación, periodo inicio y periodo fin modificará
          estos datos para todos los alumnos de la tabla. Si un valor no es
          definido aquí, se tomaran los valores que tenga registrados los
          alumnos seleccionados.
        </Typography.Paragraph>
        <Form form={form} onFinish={handleSync} layout="vertical">
          <Row {...styles.rowProps}>
            <Col {...styles.colProps}>
              <Form.Item label="Generación" name="generacion">
                <SearchSelect onChange={(value) => handleSelectGeneration(value)} dataset={generationCatalog} />
              </Form.Item>
            </Col>
            {generationSelected && (
              <>
                <Col {...styles.colProps}>
                  <Form.Item label="Periodo inicio" name="periodo_inicio">
                    <DatePicker format="DD/MM/YYYY" style={{ width: "90%" }} />
                  </Form.Item>
                </Col>
                <Col {...styles.colProps}>
                  <Form.Item label="Periodo fin" name="periodo_termino">
                    {/* <DatePicker format="DD/MM/YYYY" style={{ width: "90%" }} /> */}
                    <SearchSelect dataset={periodsEnd} />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
        </Form>
      </Modal>
    </PermissionValidator>
  );
};

export default ValidateStudentForCertification;
