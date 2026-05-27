from tkinter import *

class CircleAreaCalculator:
    #เริ่มทำงาน
    def __init__(self,root):
        self.root = root
        self.root.title("CircleAreaCalculator")
        self.root.geometry("350x150+225+90")

        #สั่งFuncทำงาน
        self.create_widgets()

    #GUIระบบ    
    def create_widgets(self):
        #ป้ายกำกับ
        self.mylabel = Label(self.root,text = "รัศมี",font=20)
        self.mylabel.place(x = 15, y =20)

        self.mylabel_2 = Label(self.root,text = "ผลลัพธ์",font=20)
        self.mylabel_2.place(x = 15, y =50)

        #กรอกข้อมูล
        self.myEntry = Entry()
        self.myEntry.place(x = 80, y = 26)

        #แสดงผลลัพธ์
        self.Result = Entry()
        self.Result.place(x = 80, y = 50)

        #ปุ่ม
        self.buttonCalculator = Button(
            self.root,
            text = "คำนวณ",
            command = self.calculator
            )
        self.buttonCalculator.place(x = 150, y = 90)
    
    #เมื่อปุ่มให้รับค่าที่กรอกมาใส่ในFuncคำนวณ
    def calculator(self):
        self.getText = int(self.myEntry.get())
        self.pi = 3.14

        self.calculator = (self.getText**2) * self.pi

        #แสดงผลลัพธ์
        self.Result.insert(0,self.calculator)
if __name__ == "__main__":
    root = Tk()          
    app = CircleAreaCalculator(root) 
    root.mainloop()