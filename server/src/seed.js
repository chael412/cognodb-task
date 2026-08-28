import driver from "./db.js";

const students = [
    { name: "Michael", studentId: "S101", yearLevel: 3 },
    { name: "Anna", studentId: "S102", yearLevel: 2 },
    { name: "John", studentId: "S103", yearLevel: 4 },
];

const teachers = [
    { name: "Dr. Smith", teacherId: "T201", department: "Computer Science" },
    { name: "Prof. Davis", teacherId: "T202", department: "Mathematics" },
    { name: "Dr. Wilson", teacherId: "T203", department: "Data Science" }
];

const subjects = [
    { code: "CS101", name: "Introduction to Programming", credits: 3 },
    { code: "CS302", name: "Graph Databases & Neo4j", credits: 4 },
    { code: "MATH201", name: "Discrete Mathematics", credits: 3 },
    { code: "DS401", name: "Machine Learning", credits: 4 }
];

const departments = [
    "Computer Science",
    "Mathematics",
    "Data Science"
];

const classrooms = [
    { roomNumber: "Lab 101", building: "Engineering Bldg" },
    { roomNumber: "Room 302", building: "Science Hall" }
];

async function seed() {
    try {
        console.log("Clearing database...");

        await driver.executeQuery(
            `
            MATCH (n)
            DETACH DELETE n
            `,
            {},
            { database: process.env.NEO4J_DATABASE }
        );

        console.log("Creating students...");
        await driver.executeQuery(
            `
            UNWIND $students AS student
            CREATE (:Student {
                studentId: student.studentId,
                name: student.name,
                yearLevel: student.yearLevel
            })
            `,
            { students },
            { database: process.env.NEO4J_DATABASE }
        );

        console.log("Creating teachers...");
        await driver.executeQuery(
            `
            UNWIND $teachers AS teacher
            CREATE (:Teacher {
                teacherId: teacher.teacherId,
                name: teacher.name,
                department: teacher.department
            })
            `,
            { teachers },
            { database: process.env.NEO4J_DATABASE }
        );

        console.log("Creating subjects...");
        await driver.executeQuery(
            `
            UNWIND $subjects AS subject
            CREATE (:Subject {
                code: subject.code,
                name: subject.name,
                credits: subject.credits
            })
            `,
            { subjects },
            { database: process.env.NEO4J_DATABASE }
        );

        console.log("Creating departments...");
        await driver.executeQuery(
            `
            UNWIND $departments AS department
            CREATE (:Department {
                name: department
            })
            `,
            { departments },
            { database: process.env.NEO4J_DATABASE }
        );

        console.log("Creating classrooms...");
        await driver.executeQuery(
            `
            UNWIND $classrooms AS room
            CREATE (:Classroom {
                roomNumber: room.roomNumber,
                building: room.building
            })
            `,
            { classrooms },
            { database: process.env.NEO4J_DATABASE }
        );

        // --- RELATIONSHIPS ---

        console.log("Linking Teachers -> Subjects (TEACHES)...");
        await driver.executeQuery(
            `
            MATCH (t1:Teacher {teacherId: "T201"}), (s1:Subject {code: "CS101"})
            MATCH (t2:Teacher {teacherId: "T203"}), (s2:Subject {code: "CS302"}), (ds:Subject {code: "DS401"})
            MATCH (t3:Teacher {teacherId: "T202"}), (s3:Subject {code: "MATH201"})
            CREATE 
                (t1)-[:TEACHES]->(s1),
                (t2)-[:TEACHES]->(s2),
                (t2)-[:TEACHES]->(ds),
                (t3)-[:TEACHES]->(s3)
            `,
            {},
            { database: process.env.NEO4J_DATABASE }
        );

        console.log("Linking Students -> Subjects (ENROLLED_IN)...");
        await driver.executeQuery(
            `
            MATCH (s:Student {studentId: "S101"}), (cs:Subject {code: "CS302"}), (math:Subject {code: "MATH201"})
            MATCH (a:Student {studentId: "S102"}), (intro:Subject {code: "CS101"})
            MATCH (j:Student {studentId: "S103"}), (ds:Subject {code: "DS401"}), (cs2:Subject {code: "CS302"})
            CREATE 
                (s)-[:ENROLLED_IN {semester: "Fall 2026"}]->(cs),
                (s)-[:ENROLLED_IN {semester: "Fall 2026"}]->(math),
                (a)-[:ENROLLED_IN {semester: "Fall 2026"}]->(intro),
                (j)-[:ENROLLED_IN {semester: "Fall 2026"}]->(ds),
                (j)-[:ENROLLED_IN {semester: "Fall 2026"}]->(cs2)
            `,
            {},
            { database: process.env.NEO4J_DATABASE }
        );

        console.log("Linking Prerequisites (PREREQUISITE_FOR)...");
        await driver.executeQuery(
            `
            MATCH (intro:Subject {code: "CS101"}), (graph:Subject {code: "CS302"})
            MATCH (math:Subject {code: "MATH201"}), (ds:Subject {code: "DS401"})
            CREATE 
                (intro)-[:PREREQUISITE_FOR]->(graph),
                (math)-[:PREREQUISITE_FOR]->(ds)
            `,
            {},
            { database: process.env.NEO4J_DATABASE }
        );

        console.log("Linking Subjects -> Classrooms (HELD_IN)...");
        await driver.executeQuery(
            `
            MATCH (cs:Subject {code: "CS302"}), (room1:Classroom {roomNumber: "Lab 101"})
            MATCH (math:Subject {code: "MATH201"}), (room2:Classroom {roomNumber: "Room 302"})
            CREATE 
                (cs)-[:HELD_IN]->(room1),
                (math)-[:HELD_IN]->(room2)
            `,
            {},
            { database: process.env.NEO4J_DATABASE }
        );

        console.log("✅ Seed complete!");
    } catch (error) {
        console.error("❌ Seed failed:", error);
    } finally {
        await driver.close();
    }
}

seed();