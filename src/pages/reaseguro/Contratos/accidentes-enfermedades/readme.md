# Generales
En esta seccion se presenta la información general de un contrato.
- En la tabla moneda se muestra la información de las monedas agregadas, tiene un campo 'monActiva' referente a si estará activa para el contrato, la información se guarda en localStorage con llave CAE_MONEDA_CONTRATO.
- En la tabla operaciones ramos, se une información de dos catalogs, extensiones y operaciones ramos 3817, al agregar una extension existente previamente en la tabla se reemplaza con las nuevas operaciones.

Ambas tablas anteriormente descritas tienen "dos maneras de interpretar" ya que intermanente tienen un type en base a la estructura en DB pero tienen otra para almacenarse como información referente al contrato, en la tabla UI se usa el type de DB y en el almacenamiento el localStorage se usa el type para contrato.

para la informacion general del contrato se almacena en localStorage para el estado interno, para enviar a backend se almacena en 3 llaves, una para generales, otra para monedas y otra para operaciones ramos.