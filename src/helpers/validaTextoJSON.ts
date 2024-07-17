export const validaTextoJSON = (texto: string) => {
    try {
        JSON.parse(texto);
        return true
    } catch (e) {
        return false;
    }
}