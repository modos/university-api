import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm"
import { Course } from "./Course"

@Entity({ name: "students" })
export class Student {

    @PrimaryGeneratedColumn("increment")
    id: number

    @Column({unique: true})
    student_id: number

    @Column({nullable: true})
    average: number

    @ManyToMany(type => Course, course => course.students)
    
    @JoinTable()
    courses: Course[]

    @UpdateDateColumn()
    last_updated: Date

}
