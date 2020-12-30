import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { v4 } from 'uuid';
import errors from '../errors';
import delay from '../utils/delay';
import path from 'path';

interface Options {
	timeout: number;
	polling: number;
};

interface Captcha {
	id: string;
	solved: boolean;
	active: boolean;
	googleKey: string;
	pageURL: string;
	solution?: string;
}

class NoCaptchaToSolve extends Error {
	constructor() {
		super();
		Object.setPrototypeOf(this, NoCaptchaToSolve.prototype);
		this.name = "NoCaptchaToSolve";
		this.message = "There are no captcha available in stack to solve";
	}
}

export default class Manual {
	private captchaBank: Captcha[];
	private options: Options;

	constructor(options: Options = { timeout: 60000, polling: 500 }) {
		this.captchaBank = [];
		this.options = options;

		const app = express();
		app.use(bodyParser.json());
		app.use(cors({
			origin: '*'
		}));

		const staticPath = path.join(__dirname, "..", "public");
		
		app.use("/", express.static(staticPath));

		app.get("/captcha", (req, res) => {
			try {
				const captcha = this.fetchInactiveCaptcha();
				res.json(captcha);
			} catch (err) {
				res.status(400).json({
					error: "No Captcha available to solve",
				});
			};
		});

		app.post("/submit", (req, res) => {
			interface input {
				id: string;
				token: string;
			}

			const body: input = req.body;
			
			for (let i in this.captchaBank) {
				if (this.captchaBank[i].id === body.id) {
					this.captchaBank[i].solved = true;
					this.captchaBank[i].solution = body.token;
				};
			};
			
			res.json({
				"success": true
			})
		});

		app.listen(3000);
	};

	async reCaptchaV2(googleKey: string, pageURL: string) {
		const id = this.createTask(googleKey, pageURL);
		let solution = "";
		while (solution === "") {
			try {
				solution = this.fetchCaptchaByID(id);
			} catch (err) {
				if (err instanceof errors.CaptchaNotReady) {
					await delay(this.options.polling);
				} else {
					throw err;
				};
			};
		};
		
		return solution;
	};

	private createTask(googleKey: string, pageURL: string) {
		const id = v4();
		this.captchaBank.push({
			id,
			solved: false,
			googleKey,
			pageURL,
			active: false,
		});

		return id;
	};

	/**
	 * 
	 * @param id Captcha Task ID
	 * @description Returns the captcha solution if done, otherwise, throws error
	 */
	private fetchCaptchaByID(id: string): string {		
		for (let c in this.captchaBank) {			
			const task = this.captchaBank[c];
			if (task.id === id) {
				if (task.solution !== undefined) {
					// Remove from active solutions so there are less operations when getting new captcha to solve
					this.captchaBank.splice(parseInt(c), 1);
					return task.solution;
				} else {
					throw new errors.CaptchaNotReady();
				};
			};
		};

		throw new errors.WrongCaptchaID();
	};

	private fetchInactiveCaptcha() {
		let captcha: Captcha | undefined;

		for (let c in this.captchaBank) {
			const cap = this.captchaBank[c];
			if (cap.active === false) {
				captcha = cap;
				this.captchaBank[c].active = true;
				break;
			}
		}

		if (captcha === undefined) {
			throw new NoCaptchaToSolve();
		} else {
			return captcha;
		}
	}
};
