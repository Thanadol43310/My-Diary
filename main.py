# 1 บาทไทย = 0.0307 ดอลลาร์สหรัฐ
# 1 บาทไทย = 0.0264 ยูโร
# 1 บาทไทย = 0.208 หยวน
# 1 บาทไทย = 672 กีบ

import tkinter as tk
from tkinter import ttk, messagebox

class ConvertCurrency:
    def __init__(self,root):
        self.root = root
        self.root.title("โปรแกรมแปลงค่าเงิน")
        self.root.geometry("300x200")
        self.root.resizable(False, False)

        #รันFuncแปลงค่าเงิน
        self.changeCurrency()

    def changeCurrency(self):
        #ใช้Frameจัดหน้าโปรแกรมให้เป็นระเบียบ
        frame = ttk.Frame(self.root, padding=20)
        frame.pack(fill="both", expand=True)

        #รับค่าเงิน
        ttk.Label(frame,text = "กรอกจำนวนเงินไทย").grid(row = 0, column = 0, sticky = 'w',padx = 17)
        self.myCurrency = ttk.Entry(frame, width = 20)
        self.myCurrency.grid(row = 1, column = 0)
        self.myCurrency.focus()

        #ComboBoxเลือกสกุลเงิน
        self.choice = tk.StringVar(value = "เลือกสกุลเงิน")
        self.combo = ttk.Combobox(frame, textvariable = self.choice)
        self.combo["value"] = ("ดอลลาร์สหรัฐ", "ยูโร", "หยวน", "กีบ")
        self.combo.grid(row = 0, column = 1, padx = 4)
        
        #แสดงคำตอบของค่าสกุลเงิน
        self.outEntry = ttk.Entry(frame, width = 20, state="readonly")
        self.outEntry.grid(row = 1, column = 1, padx = 4)

        #ปุ่มคำนวณ
        btn_frame = ttk.Frame(frame)
        btn_frame.grid(row=2, column=0, columnspan=2, pady=10)
        ttk.Button(btn_frame, text = "คำนวณ", command = self.currencyCalculator).pack(side="left")
        #ปุ่มClean
        ttk.Button(btn_frame,text = "ล้างค่า",command = self.clear).pack(side="right")

        #ปุ่มEnter
        self.root.bind("<Return>", lambda e: self.currencyCalculator())

        #RATE
        self.RATE = {
        "ดอลลาร์สหรัฐ": 0.0307,
        "ยูโร": 0.0264,
        "หยวน": 0.208,
        "กีบ": 672,
        }

    #ส่วนคำนวณ
    @staticmethod
    def calculator(usercurrency: float,rate)  -> float:
        return usercurrency*rate
    
    #Funcส่งค่าไปคำนวณและค่าตรวจสกุลเงิน
    def currencyCalculator(self, event=None):
        try:
            usercurrency = float(self.myCurrency.get())
            if usercurrency < 0:
                raise ValueError("ใส่จำนวนเงินไม่ถูกต้อง")
            selected = self.choice.get()
        
            if selected not in self.RATE:
                messagebox.showerror("ผิดพลาด", "กรุณาเลือกสกุลเงิน")
                return
            push = self.calculator(usercurrency,self.RATE[selected])
            self.outEntry.config(state = "normal")
            self.outEntry.delete(0, tk.END)
            self.outEntry.insert(0, f"{push:.4f}")
            self.outEntry.config(state = "readonly")
        except ValueError as e:
            messagebox.showerror("ข้อมูลไม่ถูกต้อง", f"กรุณากรอกตัวเลขที่ถูกต้อง\n{e}")

    #clearFunc
    def clear(self):
        self.myCurrency.delete(0,tk.END)
        self.outEntry.config(state = "normal")
        self.outEntry.delete(0,tk.END)
        self.outEntry.config(state = "readonly")
        self.myCurrency.focus()

if __name__ == "__main__":
    root = tk.Tk()
    app = ConvertCurrency(root)
    root.mainloop()