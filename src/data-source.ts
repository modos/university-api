import "reflect-metadata"
import { DataSource } from "typeorm"
import { Course } from "./entity/Course"
import { Student } from "./entity/Student"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "1234",
    database: "university",
    synchronize: true,
    logging: false,
    entities: [Student, Course],
    migrations: [],
    subscribers: [],
})
