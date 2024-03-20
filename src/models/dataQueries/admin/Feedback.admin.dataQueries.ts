import { FeedbackBaseDataQuery, IFeedbackDataQuery } from "../base/Feedback.base.dataQueries";

interface IAdminDataQuery extends IFeedbackDataQuery { }

class AdminFeedbackQuery extends FeedbackBaseDataQuery implements IAdminDataQuery { }

export const adminFeedbackQuery = new AdminFeedbackQuery();
