import driver from "./db.js";

// Helper to safely get database name fallback
const getDbName = () => process.env.NEO4J_DATABASE || "neo4j";

export async function getPeerNetwork(studentId) {
  const query = `
    MATCH (s:Student {studentId: $studentId})
    OPTIONAL MATCH (s)-[:ENROLLED_IN]->(sub1:Subject)
                   <-[:TEACHES]-(t:Teacher)-[:TEACHES]->(sub2:Subject)
                   <-[:ENROLLED_IN]-(peer:Student)
    WHERE s <> peer
    RETURN DISTINCT
      s.name AS studentName,
      s.studentId AS studentId,
      peer.name AS peerName, 
      t.name AS teacherName, 
      sub2.name AS subjectName
  `;

  const result = await driver.executeQuery(
    query, 
    { studentId }, 
    { database: getDbName() }
  );

  return result.records.map(record => record.toObject());
}

export async function getPrerequisiteChain(subjectCode) {
  const query = `
    MATCH path =
      (prereq:Subject)-[:PREREQUISITE_FOR*1..5]->
      (target:Subject {code: $subjectCode})

    RETURN
      target.code AS subjectCode,
      target.name AS subjectName,
      [n IN nodes(path) | {
        code: n.code,
        name: n.name
      }] AS prerequisiteChain

    ORDER BY length(path)
  `;

  const result = await driver.executeQuery(
    query,
    { subjectCode },
    { database: getDbName() }
  );

  return result.records.map(record => record.toObject());
}

export async function getAllSubjectsWithPrerequisites() {
  const query = `
    MATCH (s:Subject)
    OPTIONAL MATCH path = (prereq:Subject)-[:PREREQUISITE_FOR*1..5]->(s)
    RETURN 
      s.code AS code,
      s.name AS name,
      s.credits AS credits,
      collect(DISTINCT prereq.name) AS prerequisites
    ORDER BY s.code ASC
  `;

  const dbName = process.env.NEO4J_DATABASE || "neo4j";
  const result = await driver.executeQuery(query, {}, { database: dbName });
  
  return result.records.map(record => {
    const obj = record.toObject();
    if (obj.credits && typeof obj.credits.toNumber === "function") {
      obj.credits = obj.credits.toNumber();
    }
    return obj;
  });
}