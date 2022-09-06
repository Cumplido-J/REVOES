import React, { useEffect, useState } from "react";

import {  Row,Modal,Transfer  } from "antd";
import { Loading } from "../../shared/components";

import UserService from "../../service/UserService";

import Alerts from "../../shared/alerts";

const ModalToAssignCatScopeAndScope = ({modalFielVisibleToAssign, toggleModalFielToAssign, id = null, setId}) => {
    const [loading, setLoading] = useState(false);
    
    const cerrar =() =>{
        
        toggleModalFielToAssign()
        setId(null);
        setTargetKeys([])
        setMockData([])
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
        const  {scopeData} = await UserService.findByPermissionNotAssignedToScope(id);
        const newTargetKeys = [];
        const newMockData = [];
        console.log(scopeData)
        scopeData.map((permission) => {
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
            
            addPermissionTheScope( {
                idGroup : id,
                idPermission : moveKeys} );  
            setLoading(false);
        }
        else if(direction === 'right'){
            setLoading(true);
            removePermissionTheScope({
                idGroup : id,
                idPermission : moveKeys} );  
            setLoading(false);
        }
    };

    const addPermissionTheScope = async (idGroup,idPermission) => {
        const response = await UserService.addPermissionTheScope(idGroup,idPermission);
        if (!response.success) return;
        Alerts.success("Alcance asociado", "Alcance asociado correctamente");
    };

    const removePermissionTheScope = async (idGroup,idPermission) => {
        const response = await UserService.removePermissionTheScope(idGroup,idPermission);
        if (!response.success) return;
        Alerts.success("Alcance removido", "Alcance removido correctamente");
    };

    return (
        <>
            <Modal
                onCancel={cerrar}
                visible={modalFielVisibleToAssign}
                width="75%"
                zIndex={1040}
                centered
                title={`Asignar Catálogo de alcance y alcance al ID ${id}` }
                footer={null}
            >
            <Loading loading={loading}>
            <Row align="center">
            <Transfer
                    titles={['Alcance asociados', 'Alcance sin asosaciones']}
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
            </Row>
            </Loading>
            </Modal>
        </>
    )
}

export default ModalToAssignCatScopeAndScope
