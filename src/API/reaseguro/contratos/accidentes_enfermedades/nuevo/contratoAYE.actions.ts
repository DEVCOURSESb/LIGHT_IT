export const contratoAYEActions = () => {
  const token = ''
  fetch(
    "http://54.82.165.213:9080/ws_reaseguro_contratos_aye/api/v1/CaeGeneralesContratoRest/getAllRecords",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  )
    .then((resp) => resp.json())
    .then(console.log)
    .catch(console.log);
};
