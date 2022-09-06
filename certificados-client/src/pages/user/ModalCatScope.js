import React, { useEffect, useState } from "react";

import { Form, Modal,Tree} from "antd";
import { Loading } from "../../shared/components";

import UserService from "../../service/UserService";
import { DownOutlined } from '@ant-design/icons';

const getAllScopeDetailByIdUserScope = async (id) => {
    const { scopeData } = await UserService.getAllScopeDetailByIdUserScope(id);
    
    return scopeData;
  }
const ModalCatScope = ( {modalFielVisibleCat, toggleModalFielCat, id = null,setId} ) => {
    const [loading, setLoading] = useState(false);
    const [Data,setData]= useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
      const getData = async () => {
        setLoading(true);
        //const  groupData  = await getById(id);
        //setData(groupData);
        const scope = id !== null ? await getAllScopeDetailByIdUserScope(id) : [];
        console.log(scope)
        setData(scope)
        setLoading(false);
      };
      if (id === null) {
        setData([]);
      } else {
        getData();
      }
    }, [id]);

    const cerrar =() =>{
        setId(null);
        setData([])
        toggleModalFielCat()
    }
    return (
        <>
                <Modal
                    onCancel={cerrar}
                    visible={modalFielVisibleCat}
                    width="50%"
                    zIndex={1040}
                    centered
                    title={`Asociaciones de alcance ${id}` }
                    footer={null}
                >
                <Loading loading={loading}>

                
                            <Tree
                                showLine
                                switcherIcon={<DownOutlined />}
                                defaultExpandedKeys={['0-0-0']}
                                treeData={Data}
                                height={433}

                            />
                       

                </Loading>
                </Modal> 
        </>
    )
}

export default ModalCatScope
