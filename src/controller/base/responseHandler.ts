import { Response } from "express";

export interface IErrorPayload {
    code?: number;
    error?: any;
}

class ResponseHandler {
    successHandler(res: Response, data: any) {
        return res.status(200).json(data);
    }

    errorHandler(res: Response, error: any) {
        return res.status(error?.code ?? 500).json(error);
    }
}

export class ErrorMessage {
    required(field: any) {
        return field === null || field === undefined ? 'is required' : undefined;
    }

    isDeleted(field: string) {
        return `${field} is has been disable or deleted`;
    }

    isExisted(field: string) {
        return `${field} is already existed`;
    }

    doesExisted(field: string) {
        return `${field} does existed`;
    }

    invalidRole(field: string) {
        return `${field} has invalid role or already have store`;
    }
}

export default new ResponseHandler();
