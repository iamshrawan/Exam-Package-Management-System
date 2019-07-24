const express = require("express");
const { pool } = require("../database");

const router = express.Router();

pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Database Connected");
  
    
    router.post('/exams', (req, res) =>{
        const postExams = `INSERT INTO exam (id, syllabusID, examType, date) VALUES (${req.body.id}, ${req.body.syllabusID}, '${req.body.examType}','${req.body.date}')`;
        connection.query(postExams, (err, result)=>{
            if(err) {
                console.log('Database Error');
                throw err;
            }
            else {
                console.log(`Inserted data in exams ${result}`);
                res.status(200).send(result);
            }
        });
    });

    router.post('/newPackages', (req, res) =>{
        const postNewPack = `INSERT INTO package (id, packageCode, noOfCopies, codeStart, codeEnd, examID, status) VALUES (${req.body.id}, '${req.body.packageCode}', ${req.body.noOfCopies}, '${req.body.codeStart}', '${req.body.codeEnd}', ${req.body.examID}, '${req.body.status}')`;
        connection.query(postNewPack, (err, result)=>{
            if(err) throw err;
            else  {
                console.log(`Inserted data in packages ${result}`);
                res.status(200).send(result);
                }
        });
    });

    router.post('/addPerson', (req, res) =>{
        const newPerson = `INSERT INTO person(id, name, contact, address) VALUES (${req.body.id}, '${req.body.name}', '${req.body.contact}', '${req.body.address}')`;
        connection.query(newPerson, (err, result)=>{
            if(err) throw err;
            else {
                console.log(`Inserted data in person ${result}`);
                res.status(200).send(result);
            }
        });
    });

    router.post('/assign', (req, res)=>{
        const assignQ = `INSERT INTO assignment(id, dateOfAssignment, dateOfSubmission, noOfPackets, packageID, personID) VALUES (${req.body.id}, '${req.body.dateOfAssignment}', '${req.body.dateOfSubmission}', ${req.body.noOfPackets}, ${req.body.packageID}, ${req.body.personID})`;
        connection.query(assignQ, (err, result)=>{
            if(err) throw err;
            else {
                console.log(`Inserted data in assignment ${result}`);
                res.status(200).send(result);
            }
        });
    })

    router.get('/pendingPackages',(req,res)=>{
        const pendingPackagequery = `SELECT package.id, packageCode, noOfCopies, codeStart, codeEnd, subjectCode, examType, date, status FROM package JOIN 
        (
            SELECT exam.id, syllabus.subjectCode, exam.examType, exam.date FROM exam JOIN syllabus 
            ON exam.syllabusID=syllabus.id
        ) AS sub_exam 
        ON package.examID=sub_exam.id WHERE status='Pending'`;
        connection.query(pendingPackagequery, (err, result)=>{
            if(err) throw err;
            else{
                console.log("Pending Packages returned");
                res.status(200).send(JSON.parse(JSON.stringify(result)));
            }
        })
    });

    connection.release();
  });
module.exports = router;
