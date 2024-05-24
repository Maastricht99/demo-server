import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "users" })
export class User {

    @PrimaryColumn({ type: "uuid" })
    id: string;

    @Column({ name: "first_name" })
    firstName: string;

    @Column({ name: "last_name" })
    lastName: string;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}