exports.getFuncName = () => {
    return [new Error().stack.split("\n")[2].split(" ")[5],new Error().stack.split("\n")[2].split(" ")[6]];
}