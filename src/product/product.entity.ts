import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "products" })
export class Product {

    @PrimaryColumn({ type: "uuid" })
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
        this.createdAt = new Date()
    }
}