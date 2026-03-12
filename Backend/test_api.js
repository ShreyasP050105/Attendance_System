async function testAPI() {
    try {
        const res = await fetch("http://localhost:5000/api/admin/students");
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Data:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("API Error:", err.message);
    }
}

testAPI();
