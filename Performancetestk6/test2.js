import http from "k6/http";
import { check, sleep, Trend } from "k6";
import { SharedArray } from "k6/data";

// Custom metric to track throughput (requests per second)
const throughput = new Trend("throughput");

// Load user credentials, with error handling for missing or invalid JSON
let jsonData;
try {
    jsonData = new SharedArray("users", function () {
        const data = open("C:/Users/eualx/OneDrive/Documents/Evangadi/QA/project_final/phase_3/users.json");
        return data ? JSON.parse(data) : [];
    });

    if (jsonData.length === 0) {
        throw new Error("users.json is empty or not loaded correctly.");
    }

    console.log(`Loaded ${jsonData.length} users`);
} catch (error) {
    console.error("Error loading users.json:", error.message);
}

// Performance Test Configuration
export let options = {
    thresholds: {
        "checks": ["rate>0.99"],
        "http_req_failed": ["rate<0.01"],
        "http_req_duration": ["p(95)<2000"],
        "throughput": ["p(95)>10"],
    },
    scenarios: {
        constant_load: {
            executor: "ramping-arrival-rate",
            startRate: 10,
            timeUnit: "5s",
            preAllocatedVUs: 20,
            maxVUs: 100,
            stages: [
                { target: 20, duration: '1m' },
                { target: 100, duration: '2m' },
                { target: 20, duration: '30s' }
            ]
        }
    }
};

export default function () {
    if (!jsonData || jsonData.length === 0) {
        console.error("No user data available. Check users.json.");
        return;
    }

    const user = jsonData[Math.floor(Math.random() * jsonData.length)];

    if (!user || !user.username || !user.password) {
        console.error("Invalid user data format:", JSON.stringify(user));
        return;
    }

    const payload = JSON.stringify({
        Username: user.username,
        Password: user.password,
    });

    const headers = { "Content-Type": "application/json" };

    let retry = 0;
    let maxRetries = 4;
    let res;

    while (retry < maxRetries) {
        res = http.post("https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate", payload, { headers });

        if (res.status === 200 || res.status === 401) {
            break;
        }

        console.warn(`Retry ${retry + 1}: HTTP ${res.status}, Retrying...`);
        retry++;
        sleep(1);
    }

    throughput.add(1);

    const checkRes = check(res, {
        "Valid login - status 200": () => user.username === "Admin" && res.status === 200,
        "Invalid login - status 401": () => user.username !== "Admin" && res.status === 401,
        "Response time <= 2s": () => res.timings.duration <= 2000,
        "Valid login - Dashboard present": () => user.username === "Admin" && res.body.includes("Dashboard"),
        "Invalid login - Correct error message": () => user.username !== "Admin" && res.body.includes("Invalid credentials"),
    });

    if (!checkRes) {
        console.error(`Login failed for ${user.username}, Response: ${res.status}, Body: ${res.body}`);
    }

    sleep(1);
}
