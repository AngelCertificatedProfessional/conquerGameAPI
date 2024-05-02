export const getFuncName = () => {
    const stack: string | undefined = new Error().stack;
    const functionName = stack?.split("\n")[2]?.split(" ")[5] || '';
    const lineNumber = stack?.split("\n")[2]?.split(" ")[6] || '';
    return [functionName, lineNumber];
}