import { Upvote } from "./../entities/Upvote";
import { Request, Response } from "express";
import datasource from "./../utils";

export default {
	create: async (req: Request, res: Response): Promise<void> => {
		const repository = datasource.getRepository(Upvote);

		const exitingUpvote = await repository.findOne({
			where: {
				skill: { id: req.body.skillId },
				wilder: { id: req.body.wilderId },
			},
		});

		if (exitingUpvote) {
			res.json(exitingUpvote);
		} else {
			const upvote = await repository.save({
				//upvote: 0,
				wilder: { id: req.body.wilderId },
				skill: { id: req.body.skillId },
			});
			res.json(upvote);
		}
	},
	upvote: async (req: Request, res: Response): Promise<void> => {
		const repository = datasource.getRepository("Upvote");

		const exitingUpvote = await repository.findOne({
			where: {
				id: req.params.upvoteId,
			},
		});

		if (exitingUpvote) {
			exitingUpvote.upvote += 1;

			await repository.save(exitingUpvote);

			res.json(exitingUpvote);
		} else {
			throw new Error("Doest not exist");
		}
	},
};
