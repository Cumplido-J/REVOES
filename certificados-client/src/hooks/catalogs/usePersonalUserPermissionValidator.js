import { useEffect, useState } from 'react'
import CatalogService from '../../service/CatalogService';



export const getData = async () => {
    const url = await CatalogService.getPersonalRole();
    const {roles} = url
    return roles
}


export const usePersonalUserPermissionValidator = () => {
    const [state, setState] = useState({})

      useEffect(() => {
         getData()
         .then(role => setState(role))
      }, [])
    return state;
}
