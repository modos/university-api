import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm"
import { Student } from "./Student"

@Entity({ name: "courses" })
export class Course {

    @PrimaryGeneratedColumn("increment")
    id: number

    @Column({unique: true})
    name: string

    @Column()
    grade: number

    @ManyToMany(type => Student, student => student.courses, {cascade: true})
    students: Student[]

}
