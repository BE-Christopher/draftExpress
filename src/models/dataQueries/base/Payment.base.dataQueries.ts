import { DeepPartial, UpdateResult } from "typeorm";
import { Payment } from "../../entities";
import AppDataSource from "../../data-source";
import { EPaymentStatus } from "../../../interfaces";

export interface IPaymentBaseDataQuery {
    initPayment(payload: DeepPartial<Payment>): Promise<Payment>;
    updatePaymentStatus(id: number, status: EPaymentStatus): Promise<UpdateResult>;
}

const paymentTb = AppDataSource.getRepository(Payment);

export class PaymentBaseDataQuery implements IPaymentBaseDataQuery {
    async initPayment(payload: DeepPartial<Payment>) {
        const newPayment = await paymentTb.create(payload);
        await paymentTb.save(newPayment);
        return newPayment;
    }

    updatePaymentStatus(id: number, status: EPaymentStatus) {
        return paymentTb.update(id, { paidStatus: status });
    }
}
