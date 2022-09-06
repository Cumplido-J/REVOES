import React from "react";


export default ({children, permissions, roles={}}) => {


    if (roles.length<1) {
      return (
        <>
          {
            children
          }
        </>
      );
    } else {
      const rol= roles.find(rol => rol.description1===permissions)
        return (
          <>
            {

              rol != null ? '': children 

            }
          </>
        );
    }
  };