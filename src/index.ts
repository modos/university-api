import { AppDataSource } from "./data-source"
import * as express from "express";
import { createCourseForStudent, createStudent, deleteCourseForStudent, deleteStudent, findAllStudents, updateCourseForStudent, updateStudent } from "./Bootstrap";

AppDataSource.initialize().then(async () => {
    const app = express();
    app.use(express.json())



    app.post('/students', async function (req, res) {
        const result = await createStudent(req.body);
        res.status(200).json({ ...result, code: 200, message: "student added successfully." });
    })

    app.get('/students', async function (req, res) {
        const result = await findAllStudents();
        res.status(200).json({ ...result, code: 200, message: "All students recieved successfully!" });
    })

    app.put('/students/:studentid', async function (req, res) {
        const result = await updateStudent(parseInt(req.params.studentid), req.body.studentid);
        res.status(200).json({ ...result, code: 200, message: "student changed successfully!" });
    })

    app.delete('/students/:studentid', async function (req, res) {
        const result = await deleteStudent(parseInt(req.params.studentid));
        res.status(200).json({ ...result, code: 200, message: "student deleted successfully!" });
    })

    app.post('/students/:studentid/courses', async function (req, res) {
        const result = await createCourseForStudent(req.params.studentid, req.body);
        res.status(200).json({ ...result, code: 200, message: "course added successfully" });
    })

    app.put('/:studentid/:courseid', async function (req, res) {
        const result = await updateCourseForStudent(req.params.courseid, req.body);
        res.status(200).json({...result, code: 200, message: "course updated successfully"});

    })

    app.delete('/:studentid/:courseid', async function (req, res) {
        const result = await deleteCourseForStudent(req.params.studentid, req.params.courseid);
        res.status(200).json(result);

    })


    app.listen(3000);

}).catch(error => console.log(error))
