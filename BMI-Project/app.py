from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

#สร้าง server
app = Flask(__name__,static_folder = '.', static_url_path = '')
CORS(app) # อนุญาตให้ JS เรียกได้


#func คำนวณค่าbmi
def calculate_bmi(weight,height):
    height_m = height / 100
    return round(weight / (height_m ** 2),1)

#funcนำค่าbmiมาหาเกณฑ์ของผู้ใช้
def get_bmi_category(bmi):
    if bmi < 18.5:
        return "Underweight","ผอมเกินไป ควรพบแพทย์"
    elif bmi < 25:
        return "Healthy Weight","น้ำหนักอยู่เกณฑ์ดี"
    elif bmi < 30:
        return "Overweight","น้ำหนักเกิน ควรดูแลสุขภาพ"
    else:
        return "Obesity", "อ้วนเกินไป ควรพบแพทย์"

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

#สร้างเส้นทาง(route = เส้นทาง) ถ้ามีคนส่ง request โดยใช้วิธี POST มาที่ URL /bmi ให้รันFunc bmi()ด้านล่างนี้
@app.route('/bmi', methods=['POST'])
def bmi():

    #นำ request จาก Json ที่ผ่านมาจาก Flask ให้นำมาเก็บไว้ที่ตัวแป Data
    data = request.json

    #Defensive check
    weight = data.get('weight')
    height = data.get('height')

    if not weight or not height:
        #ให้แจ้งส่งค่า Error 400 = ข้อมูลที่ส่งผิด ผ่าน jsonify ไป ที่ JS เพื่อนำไปแสดงที่หน้า Website
        return jsonify({"error":"กรุณากรอกข้อมูลให้ครบ"}), 400
    if weight <= 0 or height <= 0:
        return jsonify({"error":"ค่าต้องมากกว่า 0"}), 400
    
    bmi_value = calculate_bmi(weight,height)
    category, advice = get_bmi_category(bmi_value)

    return jsonify({
        "bmi": bmi_value,
        "category": category,
        "advice": advice
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


    