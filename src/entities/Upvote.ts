import { Wilder } from "./Wilder";
import { Skill } from "./Skill";
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne } from "typeorm";

@Entity()
export class Upvote {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: 0 })
	upvote: number;

	@ManyToOne(() => Skill, "upvotes")
	skill: Skill;
	@ManyToOne(() => Wilder, "upvotes", { onDelete: "CASCADE" })
	wilder: Wilder;

	/*  relations: {
    wilder: {
      type: "many-to-one",
      inverseSide: "upvotes",
      target: "Wilder",
    },
    skill: {s
      type: "many-to-one",
      inverseSide: "upvotes",
      target: "Skill",
    },
  }, */
}
