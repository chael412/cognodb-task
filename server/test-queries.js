import { getPeerNetwork, getPrerequisiteChain } from "./src/queries.js";
import driver from "./src/db.js";

async function runTests() {
    try {
        console.log("--- Test 1: Multi-Hop Traversal");
        const peers = await getPeerNetwork("S103");
        console.log(JSON.stringify(peers, null, 2));

        console.log("\n--- Test 2: Prerequisite Chain");
        const prereqs = await getPrerequisiteChain("CS302");
        console.log(JSON.stringify(prereqs, null, 2));
    } catch (error) {
        console.error("Query Error:", error);
    } finally {
        await driver.close();
    }
}

runTests();