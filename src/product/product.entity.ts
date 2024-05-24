import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ProductStatus } from "./enum/product-status";

@Entity({ name: "products" })
export class Product {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "creator_id", type: "uuid" })
    creatorId: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ name: "picture_url" })
    pictureUrl: string;

    @Column({ name: "starting_price", nullable: true })
    startingPrice: number;

    @Column({ type: "enum", enum: ProductStatus })
    status: ProductStatus;

    @Column({ name: "auction_deadline", type: "timestamp" })
    auctionDeadline: Date;

    @Column({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    constructor(
        creatorId: string,
        name: string,
        description: string,
        pictureUrl: string,
    ) {
        this.creatorId = creatorId;
        this.name = name;
        this.description = description;
        this.pictureUrl = pictureUrl;
        this.createdAt = new Date();
        this.status = ProductStatus.PENDING;
    }
}