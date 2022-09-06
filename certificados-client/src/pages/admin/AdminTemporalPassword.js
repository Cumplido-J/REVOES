import React, { useState, useEffect } from "react";

import alerts from "../../../src/shared/alerts";
import AdminService from "../../service/AdminService";
import { Subtitle, ButtonCustom, Loading } from "../../shared/components";

export default function AdminTemporalPassword() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const countTemporalPasswords = async () => {
    setLoading(true);
    const response = await AdminService.countTemporalPasswords();
    setLoading(false);
    if (!response.success) return;
    setCount(response.count);
  };

  useEffect(() => {
    countTemporalPasswords();
  }, []);

  const updateTemporalPasswords = async () => {
    setLoading(true);
    const response = await AdminService.updateTemporalPasswords();
    setLoading(false);
    if (!response.success) return;
    alerts.success(response.message);
    countTemporalPasswords();
  };

  return (
    <>
      <Loading loading={loading}>
        <Subtitle>Contraseñas temporales</Subtitle>
        <p>
          Actualmente hay: <strong>{count}</strong> alumnos con contraseña temporal
        </p>
        <ButtonCustom color="red" onClick={updateTemporalPasswords}>
          Actualizar contraseñas
        </ButtonCustom>
      </Loading>
    </>
  );
}
