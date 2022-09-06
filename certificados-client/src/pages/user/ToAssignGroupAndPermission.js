import React, { useEffect, useState } from "react";

import {  Row,Modal,Transfer  } from "antd";
import { Loading } from "../../shared/components";

import UserService from "../../service/UserService";

import Alerts from "../../shared/alerts";

const ToAssignGroupAndPermission = ({modalFielVisibleToAssign, toggleModalFielToAssign, id = null,setId, nameRol}) => {
    const [loading, setLoading] = useState(false);
    //const [Data,setData]= useState([]);
    //const [form] = Form.useForm();


    const cerrar =() =>{
        
        toggleModalFielToAssign()
        setId(null);
    }



    const [mockData, setMockData] = useState([]);
    const [targetKeys, setTargetKeys] = useState([]);

    useEffect(() => {


        if (id === null) {
            setTargetKeys([]);
            setMockData([]);
        }else {
            getData();

        }  

    }, [id]);

    const getData = async () => {
        setLoading(true);
        const  {permissionData} = await UserService.getfindByPermissionNotAssignedToGroup(id);
        const newTargetKeys = [];
        const newMockData = [];

        permissionData.map((permission) => {
            const data = {
                key: permission.key,
                title: permission.title,
                description: 'description of content$',
            };
            if (permission.position===1) {
                newTargetKeys.push(data.key);
            }
            newMockData.push(data);
            

        })
        setTargetKeys(newTargetKeys);
        setMockData(newMockData);
        setLoading(false);
    };

    const onChange = (newTargetKeys, direction, moveKeys) => {
        console.log(newTargetKeys, direction, moveKeys);
        setTargetKeys(newTargetKeys);
        

        if(direction === 'left'){
            setLoading(true);
            
            addPermissionTheGroup( {
                idGroup : id,
                idPermission : moveKeys} );  
            setLoading(false);
        }
        else if(direction === 'right'){
            setLoading(true);
            removePermissionTheGroup({
                idGroup : id,
                idPermission : moveKeys} );  
            setLoading(false);
        }
    };

    const addPermissionTheGroup = async (idGroup,idPermission) => {
        const response = await UserService.addPermissionTheGroup(idGroup,idPermission);
        if (!response.success) return;
        Alerts.success("Permiso asociado", "Permiso asociado correctamente");
    };

    const removePermissionTheGroup = async (idGroup,idPermission) => {
        const response = await UserService.removePermissionTheGroup(idGroup,idPermission);
        if (!response.success) return;
        Alerts.success("Permiso removido", "Permiso removido correctamente");
    };

    return (
        <>
            <Modal
                onCancel={cerrar}
                visible={modalFielVisibleToAssign}
                width="70%"
                zIndex={1040}
                centered
                title={`Asignar grupo y permiso al grupo ${nameRol} con el ID ${id}` }
                footer={null}
            >
            <Loading loading={loading}>
                
            <Row align="center">
                <Transfer
                    titles={['Permisos asignados', 'Permisos disponibles']}
                    dataSource={mockData}
                    targetKeys={targetKeys}
                    onChange={onChange}
                    render={item => item.title}
                   
                    pagination
                    listStyle={{
                        width: 400,
                        height: 400,
                    }}
                    operations={['Quitar', 'Agregar']} 
                    showSearch

 
                />
                <br/>

            </Row>
            </Loading>
            </Modal>  
        </>
    )
}

export default ToAssignGroupAndPermission
