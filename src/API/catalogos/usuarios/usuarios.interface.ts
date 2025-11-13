export interface Usuarios {
    id:                    number;
    apellidoMaterno:       string;
    apellidoPaterno:       string;
    clave:                 string;
    codigoVerificacion:    string;
    correoElectronico:     string;
    esActivo:              number;
    fechaActualizacion:    Date;
    fechaFinSesion:        Date;
    fechaInicioSesion:     Date;
    fechaRegistro:         Date;
    fechaSolicitud:        Date;
    nombre:                string;
    password:              string;
    perfilClave:           string;
    username:              string;
    enabled:               boolean;
    accountNonLocked:      boolean;
    authorities:           Authority[];
    credentialsNonExpired: boolean;
    accountNonExpired:     boolean;
}

export interface Authority {
    authority: string;
}
