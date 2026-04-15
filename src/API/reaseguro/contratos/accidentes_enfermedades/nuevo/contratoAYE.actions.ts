export const contratoAYEActions = () => {
  fetch(
    "http://54.82.165.213:9080/ws_reaseguro_contratos_aye/api/v1/CaeGeneralesContratoRest/getAllRecords",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiZXRvIiwiaWF0IjoxNzc2MjczNTMxLCJleHAiOjE3NzYyNzUzMzF9.QdbBwhjlUrvXyfoyo-XQaMtYt-37oHNCADB1KGzmDgA`,
        "Content-Type": "application/json",
      },
    },
  )
    .then((resp) => resp.json())
    .then(console.log)
    .catch(console.log);
};
