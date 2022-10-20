import { Upvote } from "./Upvote";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class Skill {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@OneToMany(() => Upvote, "skill")
	upvotes: Upvote[];

	/* relations: {
    upvotes: {
      type: "one-to-many",
      inverseSide: "skill",
      target: "Upvote",
    },
  }, */
}

//export default Skill
