

# ConquerGame-API

El proyecto conqueGame es un juego de tablero en base en turnos, todos los jugadores tendran 13 piezas iniciales que pueden acomodar en el tablero donde el jugador lo desee, siempre 4 cuando no sobrepase el area de la neblina, despues de asignar sus piezas se iniciara la partida y cada jugador buscara derrotar al rey enemigo.
Cada pieza cuenta con su manera unicada de moverse, algunas teniendo mayores rangos de movimiento, otras pudiendo atacar a distancia y otras hasta pudiendo moverse hasta dos veces en el mismo turno.


## Pasos de instalacion del proyecto

Clonar el proyecto

```bash
  git clone git@github.com:AngelCertificatedProfessional/conquerGameAPI.git
```

Ir a la libreria del proyecto

```bash
  cd conquerGameAPI
```

Instalacione de dependecias

```bash
  npm install
```

Iniciar el proyecto

```bash
  npm run dev
```


## Paquetes utilizados

Los paquetes utilizados fueron los siguientes

```bash
npm init
npm install -D typescript @types/node ts-node-dev rimraf
npx tsc --init --outDir dist/ --rootDir src
npm install express
npm install --save-dev @types/express
npm install dotenv env-var
npm install compression
npm install cors
npm install --save-dev @types/cors
npm install --save bcryptjs
npm install mongoose
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
npm install socket.io
npm install express-validator
```
## Deployment

Para ejecutar este proyecto es necesario usar el sigueinte comando

```bash
  npm run dev
```
Para ejecutarlo en produccion es el siguiente

```bash
  npm run start
```

## Environment Variables

Para poder correr el proyecto,es necesario agregar las siguientes variables a tu archivo .env

`DB_CNN_STRING`= Tu conexion a mongo

`PORT`=PUERTO

`GENERAREQUEST200`=true

`GENERAREQUESTERROR`=true

`SECRET_JWT_SEED`=TuClaveSecreta

