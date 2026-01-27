export const downloadFileFromBase64 = (base64Data: string, fileName: string, mimeType: string): void => {
  // enlace de descarga a partir de los datos en base64 y el tipo MIME
  const linkSource = `data:${mimeType};base64,${base64Data}`;
  
  // ancla de descarga
  const downloadLink = document.createElement('a');
  
  // enlace del atributo href al URL de datos
  downloadLink.href = linkSource;
  
  // establece el atributo de descarga para especificar el nombre y la extensión del archivo
  downloadLink.download = fileName;
  
  // agrega el enlace al body del documento
  document.body.appendChild(downloadLink);
  
  // clic programático en el enlace para iniciar la descarga
  downloadLink.click();
  
  // limpia eliminando el enlace del documento
  document.body.removeChild(downloadLink);
}