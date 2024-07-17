export class CustomError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly message: string,
        public readonly nombreFuncion: string[],
        public readonly request: string

    ) {
        super(message)
    }

    static badRequest(message: string, nombreFuncion: string[], request: string) {
        return new CustomError(400, message, nombreFuncion, request)
    }

    static unauthorize(message: string, nombreFuncion: string[], request: string) {
        return new CustomError(401, message, nombreFuncion, request)
    }

    static forbidden(message: string, nombreFuncion: string[], request: string) {
        return new CustomError(403, message, nombreFuncion, request)
    }

    static notFound(message: string, nombreFuncion: string[], request: string) {
        return new CustomError(404, message, nombreFuncion, request)
    }
    static internalServer(message: string, nombreFuncion: string[], request: string) {
        return new CustomError(500, message, nombreFuncion, request)
    }
}