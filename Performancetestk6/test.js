import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";


// Load user credentials only once in memory
const jsonData = new SharedArray("users", function () {
    return JSON.parse(open("./users.json"));
});



// Debugging: Check if data is loaded
console.log(`Loaded users: ${JSON.stringify(jsonData)}`);


// consistency concurrent users
// export let option ={
//     scenarios:{
//         constant_load:{
//             executor:"constant-arrival-rate",
//             rate:50,
//             timeUnit:"5s",
//             preAllocatedVUs:10,
//             maxVUs:100,
//             duration:"60s",
//             iterations: jsonData.length,
//         }
//             }
// }

// ramping arrival time



export let options = {
    thresholds: {
        "checks": ["rate>0.99"], // login success rate
        "http_req_failed": ["rate< 0.01"],
        "http_req_duration": ["p(95)< 200"],// Response time for 95% of requests < 2 seconds
         "http_reqs": ["rate>10"], // Ensuring at least 10 requests per second
        // "throughput": ["p(95)>10"], // Custom threshold for throughput
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

    },
    cloud: {
        // Project: Default project
        projectID: 3747804,
        // Test runs with the same name groups test runs together.
        name: 'Test (OrangeHRMWebsite_test)'
      }
};

export default function () {
    const user = jsonData[Math.floor(Math.random() * jsonData.length)];
    
    if (!user) {
        console.error("User data is undefined. Check users.json.");
        return;
    }

    const payload = JSON.stringify({
        Username: user.username,
        Password: user.password,
    });

    const headers = { "Content-Type": "application/json" };

    let retry = 0;
    let maxretry = 4;
    let res;

    while (retry < maxretry) {
        res = http.post("https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate", payload, { headers: headers });

        if (res.status === 200 || res.status === 401) {
            break;
        }

        console.log(`Retry attempt: ${retry + 1}`);
        retry++;
    }

    if (retry === maxretry && res.status !== 200) {
        console.log("Max retries reached: " + maxretry);
    }

    console.log(`Response body for ${user.username}: ${res.body}`);


    const checkRes = check(res, {
        "status code is 200": (r) =>  r.status === 200,
        // "status code is 401": (r) => r.status === 401,
       // "time out <= 2s": (r) => r.timings.duration <= 2000,
        "body contains Dashboard": (r) => r.body.includes('Dashboard'),
        // "error message for invalid login":(r)=> user.username !== "Admin" && r.body.includes("Invalid credentials"),
    });

    if (!checkRes) {
        console.log(`Login failed for user: ${user.username}, Response: ${res.body}`);
    }

    sleep(1);
}
