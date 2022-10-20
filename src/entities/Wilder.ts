import { Upvote } from "./Upvote";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class Wilder {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@OneToMany(() => Upvote, "wilder")
	upvotes: Upvote[];
}
