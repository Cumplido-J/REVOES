import React, { useEffect, useState } from "react";
import { Form, Row, Col, Input,Card,Tree, Alert  } from "antd";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { validateCurp } from "../../shared/functions";
import { ButtonCustomLink, Loading, PrimaryButton, SearchSelect } from "../../shared/components";
import { statusSexo, studentStatusCatalog } from "../../shared/catalogs";
import Alerts from "../../shared/alerts";
import CatalogService from "../../service/CatalogService";
import { DownOutlined } from '@ant-design/icons';
import UserService from "../../service/UserService";


const colProps = {
    xs: { span: 24 },
    md: { span: 8 },
  };
  const rowProps = {
    style: { marginBottom: "1em" },
  };
  const validations = {
    curp: [
      {
        required: true,
        validator: (_, value) => {
          return validateCurp(value) ? Promise.resolve() : Promise.reject("¡Ingresa una CURP correcta!");
        },
      },
    ],
    name: [{ required: true, message: "¡El nombre es requerido!" }],
    firstLastName: [{ required: true, message: "¡El apellido paterno es requerido!" }],
    email: [{ required: true, message: "¡El email es requerido!", type: "email" }],
    stateId: [{ required: true, message: "¡El estado es requerido!" }],
    schoolId: [{ required: true, message: "¡El plantel es requerido!" }],
    status: [{ required: true, message: "¡El estatus es requerido!" }],
    role: [{ required: true, message: "¡El rol es requerido!" }],
    cargoId: [{ required: true, message: "¡El cargo es requerido para certificar!" }],
    cargoIdTitular: [{ required: true, message: "¡El cargo es requerido para titular!" }],
    rfc: [{ required: true, message: "¡El campo rfc es requerido!" }],
    sexo: [{ required: true, message: "¡El campo sexo es requerido!" }],
    group: [{ required: true, message: "¡El grupo es requerido!" }],
    scope: [{ required: true, message: "¡El alcance es requerido!" }],
    password: [{ required: true, message: "¡La contraseña es requerida!" }],
    passwordConfirm: [
      { required: true, message: "La confirmación de contraseña es requerida" },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue("password") === value) return Promise.resolve();
          return Promise.reject("¡Las contraseñas deben coincidir!");
        },
      }),
    ],
  };


async function getRole() {
    const response = await CatalogService.getRoleCatalogs();
    return response.states.map((role) => ({ id: role.id, description: role.description2 }));
}

const getGroup = async () => {
  const {groups} = await CatalogService.getAllGroups();
  
  return groups.map((role) => ({ id: role.id, description: role.description1 }));
}

async function getCargo() {
  const response = await CatalogService.getCargoCatalogs();
  return response.states.map((cargo) => ({ id: cargo.id, description: cargo.description1 }));
}

const getAllScope = async () => {
  const {scope} = await UserService.getAllScope()
  return scope.map((cargo) => ({ id: cargo.id, description: cargo.description1 }));
}

const getPermission = async (id) => {
  const {permissionData} = await UserService.findByPermissionOfGroup(id);
  const resultChildren= permissionData.map((permission,row) => ({ key: '0-0-'+row, title: permission.title }));
  return [{ title:'Permisos que el grupo contiene',key:'0-0', 
      children: 
        resultChildren,
  }]
}

async function getCargos() {
  const response = await CatalogService.getCargosCatalogs();
  return response.cargos.map((cargo) => ({ id: cargo.id, description: cargo.description1 }));
}


const getSuggestion = async (data) => {
  const { suggestionData } = await UserService.SuggestionGroupAndPermiissionData({
    idGroup : 0,
    idPermission : data
  });
  return suggestionData;
}

const getAllScopeDetailByIdUserScope = async (id) => {
  const { scopeData } = await UserService.getAllScopeDetailByIdUserScope(id);
  
  return scopeData;
}

async function getStates() {
  const response = await CatalogService.getStateCatalogs();
  return response.states.map((state) => ({ id: state.id, description: state.description1 }));
}

const UserFormNew = ({ userData, onSubmit }) => {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [catalogs, setCatalogs] = useState({ roles: [], states: [], schools: [],cargos: [], scope:[]});
    const [addPassword, setAddPassword] = useState(true);
    const [dataRol, setDataRol] = useState(false);
    const [dataPermission, setDataPermission] = useState([])
    const [dataSuggestion, setDataSuggestion] = useState([])
    const [dataScope, setDataScope] = useState([])
    const [dataGroup, setDataGroup] = useState([])
    const [disabledCargo, setDisabledCargo] = useState(false);
    const [disabledCargoType, setDisabledCargoType] = useState(false);
    const [catalogs2, setCatalogs2] = useState({cargos: []});
    const [state, setState] = useState([]);
    const [activeCargo, setActiveCargo] = useState(false);

    useEffect(() => {
      
      getLoadData();
      getLoadDataTitulacion();
    }, []);

    useEffect(() => {
      if (!userData) return;
      setLoading(true);
      onActivegroup();
      form.setFieldsValue({ ...userData });
      setAddPassword(false);
      
      onChangesuggestionTheGroup(userData.roleId);
      getInfoCargo(userData);
      onChangeGroup(userData.groupId) 
      onChangeScope(userData.scopeId)
      setDataRol(true);
      setLoading(false);
    }, [userData, form]);

    const getInfoCargo =async(userData)=>{
      if(userData.roleId === 6 || userData.roleId ===8 || userData.roleId ===1){
      setDisabledCargo( true );
      setActiveCargo( userData.cargoIdTitulo >0 ? true : false );
      setDisabledCargoType(  userData.roleId);
      }
    }

    const getLoadDataTitulacion =async()=>{
      const cargos = await getCargos();
     
      const states = await getStates();
      setCatalogs2({ cargos});
      setState(states);
    }

    const getLoadData = async () => {
      setLoading(true);
      const roles = await getRole();

      const states = [];

      const cargos = await getCargo();

      const scope = await getAllScope();
     
      setCatalogs({roles,states,schools: [], cargos, scope});
      setLoading(false);
    };






    const handleFinish = async (values) => {
        setLoading(true);
        await onSubmit(values);
        setLoading(false);
    };
    
    const handleFinishFailed = () => {
      
        Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
    };
    
    const onChangeRole = async (value) => {
    
      if(value === 6){
        setDisabledCargo(true);
        setDisabledCargoType(6);
        const cargos = await getCargos();
        setCatalogs2({ cargos});
        const states = await getStates();
        setState(states);

      }
      else if(value ===8){
        setDisabledCargo(true);
        setDisabledCargoType(8);
        const cargos = await getCargos();
        setCatalogs2({ cargos});
        const states = await getStates();
        setState(states);

      }else if(value ===1){
        setDisabledCargo(true);
        setDisabledCargoType(6);
        const cargos = await getCargos();
        setCatalogs2({ cargos});
        const states = await getStates();
        setState(states);

      }
      else{
        setDisabledCargo(false);
        setDisabledCargoType(0);
      }

      setLoading(true);
      setDataRol(true);
      onActivegroup()
      
      onChangesuggestionTheGroup(value);
      setLoading(false);
    };

    const onActivegroup  = async () => {
      const group = await getGroup();
      
     setDataGroup(group)
    }

    const onChangesuggestionTheGroup = async (value) => {
      const suggestion = suggestionTheGroup(value);
      const suggestionData = await getSuggestion(suggestion);
      setDataSuggestion(suggestionData);
    }

    const onChangeGroup = async (value) => {
      setLoading(true);
      const permissions = value !== undefined ? await getPermission(value):[];
      setDataPermission(permissions)
      setLoading(false);
    };

    const onChangeScope = async (value) => {
      setLoading(true);
      const scope = value !== undefined ? await getAllScopeDetailByIdUserScope(value):[];
      setDataScope(scope)
      setLoading(false);
    };

    const suggestionTheGroup =(value)=>{
      switch (value) {
        case 1:
          return [13];
        case 3:
          return [15];
        case 4:
          return [16,17];
        case 5:
          return [22,18,23,19];
        case 6:
          return [20];
        case 7:
          return [24];
        case 8:
          return [25];
        default:
          return [];
      }
    }


    return (
        <>
            <Loading loading={loading}>
                <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
                    <Card title="Datos generales"  >
                        <Row {...rowProps}>
                        <Form.Item name="id" >
                            <Input type="hidden" style={{ width: "90%" }} />
                        </Form.Item>

                        <Col {...colProps}>
                            <Form.Item label="USERNAME:" name="username" rules={validations.curp}>
                            <Input placeholder="USERNAME" style={{ width: "90%" }} />
                            </Form.Item>
                        </Col>
                        <Col {...colProps}>
                            <Form.Item label="Nombre:" name="name" rules={validations.name}>
                            <Input placeholder="Nombre" style={{ width: "90%" }} />
                            </Form.Item>
                        </Col>
                        <Col {...colProps}>
                            <Form.Item label="Apellido paterno:" name="firstLastName" rules={validations.firstLastName}>
                            <Input placeholder="Apellido paterno" style={{ width: "90%" }} />
                            </Form.Item>
                        </Col>
                        </Row>
                        <Row {...rowProps}>
                        <Col {...colProps}>
                            <Form.Item label="Apellido materno:" name="secondLastName">
                            <Input placeholder="Apellido materno" style={{ width: "90%" }} />
                            </Form.Item>
                        </Col>
                        <Col {...colProps}>
                            <Form.Item label="Email:" name="email" rules={validations.email}>
                            <Input placeholder="Email" type="email" style={{ width: "90%" }} />
                            </Form.Item>
                        </Col>
                        <Col {...colProps}>
                            <Form.Item label="Estatus:" name="statusId" rules={validations.status}>
                            <SearchSelect dataset={studentStatusCatalog} />
                            </Form.Item>
                        </Col>
                        </Row>
                    </Card>
                    <br/>
                    <Card title="Rol y grupo de permisos"  >  
                        
                        <Row {...rowProps}>
                        <Col span={12}>
                        <Form.Item label="Rol:" name="roleId" rules={validations.role} >
                            <SearchSelect dataset={catalogs.roles} onChange={onChangeRole} />
                        </Form.Item>
                        </Col>
                        {dataRol &&(
                        <Col span={12}>
                        <Form.Item label="Sugerencia del grupo que el rol contiene:" name="LBT1">   
                        <Tree
                          showLine
                          switcherIcon={<DownOutlined />}
                          defaultExpandedKeys={['0-0-0']}
                          treeData={dataSuggestion}
                          height={233}
                        />
                        </Form.Item>
                        </Col>
                      )}          
                        
 
                      </Row>
                      <Row {...rowProps}>
              {dataRol &&(
                        <Col span={12}>
                        <Form.Item label="Grupo de permisos:" name="groupId" rules={validations.group} >
                            <SearchSelect dataset={dataGroup} onChange={onChangeGroup} />
                        </Form.Item>
                        </Col>
              )}
              {dataRol &&(
                        <Col   span={12}>
                        <Form.Item label="Permisos que contiene el grupo seleccionado:" name="LBT2">
                        <Tree
                          showLine
                          switcherIcon={<DownOutlined />}
                          defaultExpandedKeys={['0-0-0']}
                          treeData={dataPermission}
                          height={233}
                        />
                        </Form.Item>
                        </Col>
              )}       
                      

                    </Row>
                    </Card>  
                    <br/>
                    <Card title="Alcance del usuario">
                      <Loading loading={loading}>
                        <Row {...rowProps}>
                          <Col span={12}>
                          <Form.Item label="Alcance:" name="scopeId" rules={validations.scope} >
                            <SearchSelect dataset={catalogs.scope} onChange={onChangeScope} />
                          </Form.Item>
                          </Col>
                          <Col  span={12}>
                          <Form.Item label="Información de alcance:" name="LBT3">
                              <Tree
                                showLine
                                switcherIcon={<DownOutlined />}
                                defaultExpandedKeys={['0-0-0']}
                                treeData={dataScope}
                                height={233}

                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        </Loading>
                    </Card>
                    <br/>

              { disabledCargo  && (
                    <Card title="Cargo para certificar o titular">
                        <Row style={{ marginBottom: "1em" }}>
                          <Col xs={{ span: 24 }}>
                            <Alert
                              message={<strong>Certificación o titulación</strong>}
                              description={
                                <>
                                  <p>A continuación se muestra dos listas desplegable con las siguientes clausulas:</p>
                                  <ul>
                                  {( disabledCargoType === 6 ||  disabledCargoType === 1) &&(  
                                    <li>Sí a elegido el rol certificación tendra el campo cargo para certificar obligatorio,
                                      el campo cargo para titular es opcional en este caso de ser seleccionado se clonará la 
                                      informacion de datos personales en una tabla adicional para otorgar el registro de titulación.
                                     <br/> <strong>Dicho campo puede estar vacío si unicamente desea certificar</strong>
                                      .</li>
                                  )}  
                                  { disabledCargoType === 8 &&(
                                      <li>Sí a elegido el rol titulación tendra el campo cargo para titular obligatorio,
                                      el campo cargo para certificación es opcional en este caso de ser seleccionado se agregará la 
                                      informacion del cargo y podrá certificar con los permisos adecuados.
                                     <br/>
                                     <strong> Dicho campo puede estar vacío si unicamente desea titular pero no podra certificar</strong>
                                      .</li>
                                  )}
                                </ul>
                                </>
                              }
                              type="warning"
                              showIcon
                            />
                          </Col>
                        </Row>  
                        <Row {...rowProps}>
                          <Col {...colProps}>
                              <Form.Item label="Cargo para certificación:" name="cargoId" 
                                rules={ disabledCargoType === 6 ? validations.cargoId : '' }
                               
                               >
                              <SearchSelect dataset={catalogs.cargos} />
                              </Form.Item>
                          </Col>
                       
                          <Col {...colProps}>
                              <Form.Item label="Cargo para titular:" name="cargoIdTitulo" 
                                rules={  disabledCargoType === 8 ? validations.cargoIdTitular : '' } 
                              >
                              <SearchSelect dataset={catalogs2.cargos} onChange={(value)=>{  value > 0 ? setActiveCargo(true) : setActiveCargo(false) }  } />
                              </Form.Item>
                          </Col>
                        { activeCargo  &&(
                            <Col {...colProps}>
                                <Form.Item label="Sexo:" name="sexo" rules={validations.sexo}>
                                <SearchSelect dataset={statusSexo} />
                                </Form.Item>
                            </Col>
                        )}
                        </Row>
                        <Row>
                        { activeCargo  &&(
                          <Col {...colProps}>
                            <Form.Item label="RFC:" name="rfc" rules={ validations.rfc }>
                              <Input placeholder="RFC" style={{ width: "90%" }} />
                            </Form.Item>
                          </Col> 
                        )}  
                        { activeCargo  &&(
                          <Col {...colProps}>
                            <Form.Item label="Estado:" name="stateId" rules={ validations.stateId }>
                              <SearchSelect  dataset={state}/>
                            </Form.Item>
                          </Col>
                          )}

                        </Row>
                      
                    </Card>
              )}  
                    <br/>
            {addPassword === true && (
                    <Card title="Contraseña"  >  
                    <Row {...rowProps}>

                        <Col {...colProps}>
                            <Form.Item label="Contraseña:" name="password" rules={validations.password}>
                            <Input.Password placeholder="Contraseña" style={{ width: "90%" }} />
                            </Form.Item>
                        </Col>
                        
                        <Col {...colProps}>
                            <Form.Item label="Confirmación de contraseña:" name="passwordConfirm" rules={validations.passwordConfirm}>
                            <Input.Password placeholder="Confirmación de contraseña" style={{ width: "90%" }} />
                            </Form.Item>
                        </Col>
                        
                    </Row>
                    </Card>  
            )}
                        <br/>

                    <Row {...rowProps}>
                    <Col {...colProps}>
                        <ButtonCustomLink link="/Usuarios" size="large" icon={<ArrowLeftOutlined />} color="red">
                        Regresar a la lista de usuarios
                        </ButtonCustomLink>
                    </Col>
                    <Col {...colProps}>
                        <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
                        Guardar usuario
                        </PrimaryButton>
                    </Col>
                    </Row>
                </Form>
            </Loading>
        </>
    )
}

export default UserFormNew
