import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Task {
    @PrimaryKey()
    id!: number;

    @Property()
    title!: string;

    @Property({ nullable: true })
    description?: string;

    @Property({ default: false })
    completed?: boolean = false;

    @Property({ onCreate: () => new Date() })
    createdAt?: Date = new Date();


    @Property({ onUpdate: () => new Date(), nullable: true })
    updatedAt?: Date;
}