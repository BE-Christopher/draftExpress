import { DeepPartial } from "typeorm";
import { FeedbackBaseDataQuery, IFeedbackDataQuery } from "../base/Feedback.base.dataQueries";
import { Feedback } from "../../entities";

interface IUserFeedbackQuery extends IFeedbackDataQuery {
    createFeedback(payload: DeepPartial<Feedback>): Promise<Feedback>;
}

class UserFeedbackQuery extends FeedbackBaseDataQuery implements IUserFeedbackQuery {
    async createFeedback(payload: DeepPartial<Feedback>) {
        const newFeedback = await this.feedbackTb.create(payload);
        await this.feedbackTb.save(newFeedback);

        return newFeedback;
    }
}

export const userFeedbackQuery = new UserFeedbackQuery();
