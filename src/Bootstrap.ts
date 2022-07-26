import { AppDataSource } from "./data-source"
import { Course } from "./entity/Course";
import { Student } from "./entity/Student"

export const createStudent = async (student: Object) => {
    const studentRepo = AppDataSource.getRepository(Student);

    try {
        const data = studentRepo.create(student);
        await studentRepo.save(data);
        return data;
    } catch (error) {
        console.log(error);
        return false;
    }

}

export const findAllStudents = async () => {
    const studentRepo = AppDataSource.getRepository(Student);

    try {
        const data = await studentRepo.find({join: {
            alias: 'student',
            leftJoinAndSelect: {
                "courses": "student.courses"
            }
        }});
        return { ...data, size: data.length };
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const updateStudent = async (old_id: number, new_id: number) => {
    const studentRepo = AppDataSource.getRepository(Student);

    try {
        const data = await studentRepo.createQueryBuilder().update({ student_id: new_id }).where({ student_id: old_id }).returning('*').execute();
        return data.raw[0];
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const deleteStudent = async (studentid: number) => {
    const studentRepo = AppDataSource.getRepository(Student);

    try {
        const data = await studentRepo.createQueryBuilder().delete().where({ student_id: studentid }).returning('*').execute();
        return data.raw[0];
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const createCourseForStudent = async (studentid, courseData) => {
    const studentRepo = AppDataSource.getRepository(Student);
    const courseRepo = AppDataSource.getRepository(Course);

    try {
        const student = await studentRepo.findOne({ where: { student_id: studentid } });
        let course = courseRepo.create(courseData);
        course = await courseRepo.save(course);
        let c = Object.assign(course);

        await studentRepo.createQueryBuilder().relation(Student, "courses").of(student).add(c.id);
        await updateAverage(studentid);
        return courseData;

    } catch (error) {
        console.log(error);
        return false;
    }
}

export const updateCourseForStudent = async (courseid, courseData) => {
    const courseRepo = AppDataSource.getRepository(Course);

    try {
        return (await courseRepo.createQueryBuilder().update(courseData).where({ id: courseid }).returning('*').execute()).raw[0];
    } catch (error) {
        console.log(error);
        return false;
    }

}

export const deleteCourseForStudent = async (studentid, courseid) => {
    const studentRepo = AppDataSource.getRepository(Student);
    const courseRepo = AppDataSource.getRepository(Course);

    try {
        const student = await studentRepo.findOne({where: {student_id: studentid}, relations: ['courses']})
        if (student) {
            student.courses = student.courses.filter(course => {
                course.id !== courseid;
            })

            await studentRepo.save(student);
        }

        await courseRepo.delete({id: courseid});
    } catch (error) {
        console.log(error);
        return false;
    }
}

const updateAverage = async(student_id) => {
    const avg = await AppDataSource.manager.getRepository(Student).query(`select avg(grade) as grades from students a left join students_courses_courses b on a.id = b.\"studentsId\" and a.student_id =${student_id} left join courses c on b.\"coursesId\" = c.id group by a.id;`);
    await AppDataSource.manager.getRepository(Student).createQueryBuilder().update({ average: parseInt(avg[0].grades)}).where({ student_id: student_id }).execute()
}