import { ErrorMessage, IErrorPayload } from "./responseHandler";

interface IBaseController { }

export class BaseController implements IBaseController {
    errorMessage = new ErrorMessage();
    errorResponse(error: IErrorPayload) {
        throw error;
    }
} 
