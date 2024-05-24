import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "bids" })
export class Bid {

    @PrimaryColumn({ type: "uuid" })
    id: string;

    @Column({ name: "product_id", type: "uuid" })
    productId: string;

    @Column({ name: "user_id", type: "uuid" })
    userId: string;

    @Column()
    amount: number;

    @Column({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    contructor(
        productId: string,
        userId: string,
        amount: number
    ) {
        this.productId = productId;
        this.userId = userId;
        this.amount = amount;
        this.createdAt = new Date();
    }

}