import mongoose from "mongoose";
import request from "supertest";

import app from "../app.js";
import User from "../models/User.js";

const { DB_TEST_HOST } = process.env;

// describe("test /api/users/register route", () => {
// 	let server = null;
// 	beforeAll(async () => {
// 		await mongoose.connect(DB_TEST_HOST);
// 		server = app.listen(3000);
// 	},20000);

// 	afterAll(async () => {
// 		await mongoose.connection.close();
// 		server.close();
// 	},20000);

// 	// afterEach(async () => {
// 	// 	await User.deleteMany();
// 	// },20000);

// 	test("test /api/users/register with correctData", async () => {
// 		const signupData = {
// 			email: "Cat@cat.ct",
// 			password: "123456",
// 		};
// 		const { body, statusCode } = await request(app).post("/api/users/register").send(signupData);

// 		expect(statusCode).toBe(201);
// 		expect(body.email).toBe(signupData.email);

// 		const user = await User.findOne({ email: signupData.email });
// 		expect(user.email).toBe(signupData.email);
// 	},20000);
// });

describe("test /api/users/login route", () => {
	let server = null;
	beforeAll(async () => {
		await mongoose.connect(DB_TEST_HOST);
		server = app.listen(3000);
	},20000);

	afterAll(async () => {
		await mongoose.connection.close();
		server.close();
	},20000);

	// afterEach(async () => {
	// 	await User.deleteMany();
	// },20000);

	test("test /api/users/login with correctData", async () => {
		const signinData = {
			email: "Cat@cat.ct",
			password: "123456",
		};

		const {body, status} = await request(app)
		.post("/api/users/login")
		.send(signinData) 
		.set("Accept", "application/json");
		expect(status).toEqual(200);
		expect(body).toBeDefined();
	

		const user = await User.findOne({ email: signinData.email});
		expect(user.token).not.toBeNull();
		expect(user.email).toBe(signinData.email);
	},20000);
});
 