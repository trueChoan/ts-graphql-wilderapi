import { Wilder } from "./../entities/Wilder";
import { In } from "typeorm";
import { Request, Response } from "express";
import datasource from "../utils";

export default {
	create: (req: Request, res: Response): void => {
		const repository = datasource.getRepository("Wilder");

		repository.query("INSERT INTO wilder(name) VALUES (?)", [req.body.name]).then(
			(id) => {
				repository.query("SELECT * FROM wilder WHERE id=?", [id]).then(
					(data) => {
						res.json(data[0]);
					},
					(err) => console.error(err)
				);
			},
			(err) => {
				console.error("Error: ", err);
				res.json({ success: false });
			}
		);
	},
	findAll: (req: Request, res: Response): void => {
		const repository = datasource.getRepository(Wilder);

		repository.find({ relations: ["upvotes", "upvotes.skill"] }).then((data) => {
			res.json(data);
		});
	},
	find: async (req: Request, res: Response): Promise<void> => {
		/**
		 * req.body → body request
		 * → req.params → /api/wilders/:wilderId
		 * req.query → /api/wilders?wilderId=...
		 */
		const wilderId = req.params.wilderId;

		// find 1 wilder by its ID
		const data = await datasource.getRepository("Wilder").findOneBy({ id: wilderId });

		res.json(data);
	},
	update: async (req: Request, res: Response): Promise<void> => {
		const wilderId = req.params.wilderId;
		const repository = datasource.getRepository(Wilder);

		const wilder = await repository.findOne({
			where: { id: wilderId },
			relations: ["skills"],
		});

		// Object.assign(wilder, req.body);
		wilder.name = req.body.name;
		wilder.skills = req.body.skills;

		const updatedWilder = await repository.save(wilder, { reload: true });
		res.json(updatedWilder);
	},
	delete: (req: Request, res: Response): void => {
		/**
		 * 2 options:
		 * - raw SQL → UPDATE
		 * - TypeORM: find + save
		 */
		const wilderId = req.params.wilderId;
		const repository = datasource.getRepository("Wilder");

		// raw SQL
		repository.query("DELETE FROM wilder WHERE id=?", [wilderId]).then(
			() => {
				res.json({ success: true });
			},
			(err) => {
				console.error("Error when removing: ", err);
				res.json({ success: false });
			}
		);

		/* // find 1 wilder by its ID
    // Google → typeorm get 1 item by ID
    repository.findOneBy({ id: wilderId }).then(
      (wilder) => {
        repository.remove(wilder).then(
          () => {
            res.json({ success: true });
          },
          (err) => {
            console.error("Error when removing: ", err);
            res.json({ success: false });
          }
        );
      },
      (err) => {
        console.error("Error when finding: ", err);
        res.json({ success: false });
      }
    ); */
	},
	addSkill: (req: Request, res: Response): void => {
		const wilderId = req.params.wilderId;
		const skillId = req.body.skillId;
		const manager = datasource.manager;

		manager.query("INSERT INTO wilder_skills_skill(wilderId, skillId) VALUES (?, ?)", [wilderId, skillId]).then(
			(id) => {
				manager
					.query(
						`
              SELECT wilder.id AS wilderId, wilder.name AS wilderName, skill.id AS skillId, skill.name AS skillName
              FROM wilder
              LEFT JOIN wilder_skills_skill AS wss ON wss.wilderId = wilder.id
              LEFT JOIN skill ON skill.id = wss.skillId
              WHERE wilder.id=?
            `,
						[wilderId]
					)
					.then((rows: any) => {
						// because of the left join, we got as many rows as the wilder has skills
						// we need to flatten them
						const wilder = {
							id: rows[0].wilderId,
							name: rows[0].wilderName,
							skills: rows // 1st remove all rows not related to skills, then map them to recreate skill entities
								.filter((row: any) => row.skillId !== null && row.skillId !== undefined)
								.map((row: any) => ({ id: row.skillId, name: row.skillName })),
						};
						res.json(wilder);
					});
			},
			(err) => {
				console.error("Error: ", err);
				res.json({ success: false });
			}
		);

		/*
    datasource
      .getRepository("Wilder")
      .findOneByOrFail({ id: wilderId })
      .then((wilderToUpdate) => {
        datasource
          .getRepository("Skill")
          .findOneByOrFail({ id: skillId })
          .then((skillToInsert) => {
            wilderToUpdate.skills.push(skillToInsert);
            datasource
              .getRepository("Wilder")
              .save(wilderToUpdate)
              .then(
                (updatedWilder) => {
                  res.json(updatedWilder);
                },
                (err) => {
                  console.error("Error when saving: ", err);
                  res.json({ success: false });
                }
              );
          });
      }); */
	},
	addSkills: async (req: Request, res: Response): Promise<void> => {
		const wilderId = req.params.wilderId;
		const skillsIds = req.body.skillsIds;
		const repository = datasource.getRepository("Wilder");

		const wilder = await repository.findOneByOrFail({ id: wilderId });
		const skills = await datasource.getRepository("Skill").find({ where: { id: In(skillsIds) } });

		wilder.skills = skills;

		const updatedWilder = await repository.save(wilder);
		res.json(updatedWilder);
	},
};
