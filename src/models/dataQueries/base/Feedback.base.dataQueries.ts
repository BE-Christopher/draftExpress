import AppDataSource from "../../data-source";
import { Feedback } from "../../entities";

export interface IFeedbackDataQuery {
    getList(payload: IGetFeedbackQuery): Promise<Feedback[]>;
}

export type IGetFeedbackQuery = {
    limit: number,
    page: number,
    authorId?: number,
    productId?: number,
};

export class FeedbackBaseDataQuery implements IFeedbackDataQuery {
    feedbackTb = AppDataSource.getRepository(Feedback);

    getList(payload: IGetFeedbackQuery) {
        return this.feedbackTb.find(
            {
                select: {
                    id: true,
                    content: true,
                    rating: true,
                    datePosted: true,
                    author: {
                        id: true,
                        name: true
                    },
                    product: {
                        id: true,
                        name: true,
                    },
                    asserts: {
                        id: true,
                        url: true,
                    }
                },
                where: {
                    author: {
                        id: payload.authorId
                    },
                    product: {
                        id: payload.productId
                    }
                },
                relations: {
                    asserts: true,
                    author: true,
                    product: true,
                },
                skip: (payload.page - 1) + payload.limit,
                take: payload.limit,
            }
        );
    }
}
