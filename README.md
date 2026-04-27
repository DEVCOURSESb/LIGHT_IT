# LIGHT IT

Este es un fork de la latino con cambio de colorimetría de a cuerdo con Light It, la rama main va de la mano del main del repositorio original.

> [!WARNING]
> Como la rama main va de la mano del repositorio original, las características nuevas sobre este repositorio deben de ir exclusivamente en la rama production, en caso de necesitar replicar funcionalidad de la latino en este repositorio, siempre y cuando ya estén en main, basta con hacer un sync de main y un rebase en production de main. Esta estrategia evita caer en conflictos innecesarios cada vez que necesitemos hacer un sync.

## Para ejecutar con éxito este proyecto es necesario seguir estos pasos:

1. Clonar el repositorio
``` 
git clone https://github.com/LIGHTITREPORTES/LIGHT_IT.git
```

2. Cambiar de path
``` 
cd LIGHT_IT
```

3. Clonar el repositorio
``` 
git switch production
```

4. Instalar dependencias
``` 
npm i
```

4. Renombrar el archivo env.example a .env y cambiar únicamente las IPs según corresponda

5. Ejecutar el proyecto
``` 
npm run dev
```

