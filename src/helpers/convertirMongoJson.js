exports.convertirMongoAJson = (vResultado) => {
    return JSON.parse(JSON.stringify(vResultado));
}