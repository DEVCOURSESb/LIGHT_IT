export interface Usuario {
    id:                    number;
    apellidoMaterno:       string;
    apellidoPaterno:       string;
    clave:                 string;
    codigoVerificacion:    string;
    correoElectronico:     string;
    esActivo:              number;
    fechaActualizacion:    string;
    fechaFinSesion:        string;
    fechaInicioSesion:     string;
    fechaRegistro:         string;
    fechaSolicitud:        string;
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
