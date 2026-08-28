import "dotenv/config";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(
        process.env.NEO4J_USERNAME,
        process.env.NEO4J_PASSWORD
    )
);

export async function verifyConnection() {
    await driver.verifyConnectivity();
    console.log("✅ Connected to Cognodb / Neo4j");
}

export async function query(cypher, params = {}) {
    const result = await driver.executeQuery(
        cypher,
        params,
        {
            database: process.env.NEO4J_DATABASE
        }
    );

    return result.records;
}

export default driver;