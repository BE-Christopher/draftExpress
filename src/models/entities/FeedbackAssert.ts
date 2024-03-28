import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./Base";
import { Feedback } from "./Feedback";

@Entity({ name: 'feedback_asserts' })
export class FeedbackAsserts extends BaseEntity {
    @Column({ nullable: false })
    url: string;

    @ManyToOne(() => Feedback, feedback => feedback.asserts)
    feedback: Feedback;
}
