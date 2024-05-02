import { envs } from "../../../config/envs"
import { RequestModel } from "../../../data/mongo/models/Request.model"

export const crearRequest = async (proceso: string[], req: String, estatus: Number, error?: Object) => {
    if ((estatus === 200 && !envs.GENERAREQUEST200)
        || estatus !== 200 && !envs.GENERAREQUESTERROR)
        return
    try {
        new RequestModel({
            proceso: proceso[0],
            archivo: proceso[1],
            estatus,
            request: req,
            error,

        }).save()
    } catch (error) {
        console.log(error)
    }
}