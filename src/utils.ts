import { Upvote } from "./entities/Upvote";
import { Wilder } from "./entities/Wilder";
import { DataSource } from "typeorm"; // import deconstruit de import typeorm from type orm
import { Skill } from "./entities/Skill";

const datasource: any = new DataSource({
	type: "sqlite",
	database: "./wilders.db",
	synchronize: true,
	entities: [Skill, Wilder, Upvote],
	logging: ["query", "error"],
});

export default datasource;
