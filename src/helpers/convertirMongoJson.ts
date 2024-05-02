export const convertirMongoAJson = (vResultado: Object) => {
    return JSON.parse(JSON.stringify(vResultado));
}