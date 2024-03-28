import { FeedbackBaseDataQuery, IFeedbackDataQuery } from "../base/Feedback.base.dataQueries";

interface IBuyerFeedbackQuery extends IFeedbackDataQuery { }

class BuyerFeedbackQuery extends FeedbackBaseDataQuery implements IBuyerFeedbackQuery { }

export const buyerFeedbackQuery = new BuyerFeedbackQuery();
