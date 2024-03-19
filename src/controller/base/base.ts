import { IErrorPayload } from "./responseHandler";

interface IBaseController { }

export class BaseController implements IBaseController {
    errorResponse(error: IErrorPayload) {
        throw error;
    }
} 
