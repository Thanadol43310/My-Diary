//ทำให้ข้อความที่แสดงผลBmi เปลี่ยนสีตามโซมที่เข็มชี้
function getBmiColor(bmi) {
    if (bmi < 18.5) return "#ff3333";   // แดง - ผอม
    if (bmi < 23)   return "#0d9c31";   // เขียว - ปกติ
    if (bmi < 25)   return "#48ff00";   // เหลือง - เริ่มเกิน
    if (bmi < 30)   return "#ff9933";   // ส้ม - เกิน
    return "#ff3333";                   // แดง - อ้วนมาก
}

function convertBmiToAngle(bmi) {
    const minBmi = 16;
    const maxBmi = 40;
    if (bmi < minBmi) bmi = minBmi;
    if (bmi > maxBmi) bmi = maxBmi;

    // ครึ่งวงกลมบนเริ่มจาก Math.PI (ฝั่งซ้าย) ไปจบที่ Math.PI * 2 (ฝั่งขวา)
    return Math.PI + ((bmi - minBmi) / (maxBmi - minBmi)) * Math.PI;
}

//ข้อความไปแปะบนหัวของโซนสี
function drawLabel(ctx, cx, cy, radius, bmi, text) {
    const angle = convertBmiToAngle(bmi);
    
    // คำนวณตำแหน่งด้านนอก arc (radius + 30 = ระยะห่างจาก arc)
    const x = cx + (radius + 43) * Math.cos(angle);
    const y = cy + (radius + 43) * Math.sin(angle);
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
}


async function calculateBMI() {
    //รับค่า สส และ นน จาก HTML
    const weight = parseFloat(document.getElementById('weight').value)
    const height = parseFloat(document.getElementById('height').value)

    //Defensive check ฝั่ง JS ก่อนส่ง
    if (isNaN(weight) || isNaN(height)) {
        alert("กรุณากรอกตัวเลข")
        return
    }

    //ส่งไปให้ Python คำนวณ
    const response = await fetch('http://localhost:5000/bmi', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ weight, height})
    })

    //ดึงข้อมูลจาก Python
    const result = await response.json()

    //นำไปแสดงใน gauge
    showGauge(result.bmi, result.category, result.advice)
}

//เริ่ม
const canvas = document.getElementById('gauge')
const ctx = canvas.getContext('2d')

//แสดงค่า Bmi กลาง
const cx = canvas.width / 2;
const cy = canvas.height - 50; // ดันลงมาด้านล่างเพื่อให้ครึ่งวงกลมบาลานซ์พอดี
const radius = 180;

//วาดแต่ละโซนสี
const zones = [
    { start: 16,   end: 18.5, color: "#ff3333", label: "UNDERWEIGHT" },
    { start: 18.5, end: 23,   color: "#0d9c31", label: "HEALTHY" },    
    { start: 23,   end: 25,   color: "#48ff00", label: "OVERWEIGHT" },  
    { start: 25,   end: 30,   color: "#ff9933", label: "OBESE" },      
    { start: 30,   end: 40,   color: "#ff3333", label: "EXTREME" }    
];

drawLabel(ctx, cx, cy, radius, 16,   "16");
drawLabel(ctx, cx, cy, radius, 18.5, "18.5");
drawLabel(ctx, cx, cy, radius, 23,   "23");
drawLabel(ctx, cx, cy, radius, 25,   "25");
drawLabel(ctx, cx, cy, radius, 30,   "30");
drawLabel(ctx, cx, cy, radius, 40,   "40");

//แถบวัดของGauge
zones.forEach(zone => {
    let startAngel = convertBmiToAngle(zone.start);
    let endAngel = convertBmiToAngle(zone.end);

    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngel, endAngel, false);
    ctx.lineWidth = 50;
    ctx.strokeStyle = zone.color;
    ctx.stroke();
    ctx.closePath();
})

    ctx.save();
    ctx.translate(cx, cy); //ย้ายจุดหมุนมาที่ cx cy  

    //เข็มชี้ของ Gauge
    ctx.beginPath();
    ctx.moveTo(0, -15); //โคนเข็มฝั่งซ้าย
    ctx.lineTo(radius - 30, 0); //ปลายแหลมชี้ไปที่สี
    ctx.lineTo(0, 15) //โคนเข็มฝั่งขวา
    ctx.fillStyle = "rgb(236, 245, 234)";
    ctx.fill();
    ctx.closePath();

    ctx.restore(); //คืนค่าหน้าจอหลุดจากการหมุน

    //Gui แกนหมุนของเข็มชี้
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.fillStyle = "rgb(236, 245, 234)";
    ctx.fill();
    ctx.strokeStyle = "rgb(236, 245, 234)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();



    
function showGauge(bmi, category, advice) {
    const canvas = document.getElementById('gauge')
    const ctx = canvas.getContext('2d')

    //วาด gauge arc
    ctx.clearRect(0,0, canvas.width, canvas.height)
    
    //วาดแต่ละโซนสี
    const zones = [
        { start: 16,   end: 18.5, color: "#ff3333", label: "UNDERWEIGHT" },
        { start: 18.5, end: 23,   color: "#0d9c31", label: "HEALTHY" }, 
        { start: 23,   end: 25,   color: "#48ff00", label: "OVERWEIGHT" }, 
        { start: 25,   end: 30,   color: "#ff9933", label: "OBESE" },      
        { start: 30,   end: 40,   color: "#ff3333", label: "EXTREME" }       
    ];

    //แถบวัดของGauge
    zones.forEach(zone => {
        let startAngel = convertBmiToAngle(zone.start);
        let endAngel = convertBmiToAngle(zone.end);

        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngel, endAngel, false);
        ctx.lineWidth = 50;
        ctx.strokeStyle = zone.color;
        ctx.stroke();
        ctx.closePath();
    })

    // วาด label ที่จุดเริ่มต้นแต่ละโซน
    drawLabel(ctx, cx, cy, radius, 16,   "16");
    drawLabel(ctx, cx, cy, radius, 18.5, "18.5");
    drawLabel(ctx, cx, cy, radius, 23,   "23");
    drawLabel(ctx, cx, cy, radius, 25,   "25");
    drawLabel(ctx, cx, cy, radius, 30,   "30");
    drawLabel(ctx, cx, cy, radius, 40,   "40");

    if (bmi !== undefined) {
        let currentAngel = convertBmiToAngle(bmi);

        //บันทึกสถานะก่อนหมุน
        ctx.save();
        ctx.translate(cx, cy); //ย้ายจุดหมุนมาที่ cx cy
        ctx.rotate(currentAngel); //หมุนตามองศาBmi

        //เข็มชี้ของ Gauge
        ctx.beginPath();
        ctx.moveTo(0, -15); //โคนเข็มฝั่งซ้าย
        ctx.lineTo(radius - 30, 0); //ปลายแหลมชี้ไปที่สี
        ctx.lineTo(0, 15) //โคนเข็มฝั่งขวา
        ctx.fillStyle = "#rgb(236, 245, 234)";
        ctx.fill();
        ctx.closePath();

        ctx.restore(); //คืนค่าหน้าจอหลุดจากการหมุน

        //Gui แกนหมุนของเข็มชี้
        ctx.beginPath();
        ctx.arc(cx, cy, 40, 0, Math.PI * 2);
        ctx.fillStyle = "#rgb(236, 245, 234)";
        ctx.fill();
        ctx.strokeStyle = "#rgb(236, 245, 234)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        //ข้อความบอกค่าBmi
        ctx.fillStyle = getBmiColor(bmi);   // สีตามโซน
        ctx.font = "bold 40px Arial";
        ctx.textAlign = "center";
        ctx.fillText(bmi.toFixed(1), cx, cy - 60);
    }

    //แสดงผล
    let cate = document.getElementById('category');
    let adv = document.getElementById('advice');
    cate.textContent = "หมวดหมู่:" + " " + category;
    adv.textContent = "คำแนะนำ:" + " " + advice;

}
