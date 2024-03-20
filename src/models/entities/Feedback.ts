import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./Base";
import { User } from "./User";
import { FeedbackAsserts } from "./FeedbackAssert";
import { Product } from "./Product";

@Entity({ name: 'feedbacks' })
export class Feedback extends BaseEntity {
    @Column({ name: 'date_posted', nullable: false })
    datePosted: Date;

    @Column({ nullable: false, default: 50 })
    rating: number;

    @Column({ nullable: true })
    content: string;

    @ManyToOne(() => User, user => user.feedbacks)
    author: User;

    @OneToMany(() => FeedbackAsserts, feedbackAsserts => feedbackAsserts.id)
    asserts: FeedbackAsserts[];

    @ManyToOne(() => Product, product => product.feedbacks)
    product: Product;
}
