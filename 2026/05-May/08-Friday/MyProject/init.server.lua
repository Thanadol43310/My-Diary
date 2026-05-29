--LocalScript in ScreenGui -> TextButton -> LocalScript
--สร้างปุ่มเพื่อทำหน้าต่างShop
local openbutton = script.Parent
local shopFrame = script.Parent.Parent.ShopFrame
local exitButton = script.Parent.Parent.ExitButton
local swordButton = script.Parent.Parent.SwordButton
local shieldButton = script.Parent.Parent.ShieldButton
local TextLabel1 = script.Parent.Parent.TextLabel1
local TextLabel2 = script.Parent.Parent.TextLabel2

local replicatedStorage = game:GetService("ReplicatedStorage")
local buyEvent = replicatedStorage:WaitForChild("BuyItem")

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ItemConfig = require(ReplicatedStorage:WaitForChild("ItemConfig"))

openbutton.MouseButton1Click:Connect(function()
	shopFrame.Visible = not shopFrame.Visible
	exitButton.Visible = not exitButton.Visible
	swordButton.Visible = not swordButton.Visible
	shieldButton.Visible = not shieldButton.Visible
	TextLabel1.Visible = not TextLabel1.Visible
	TextLabel2.Visible = not TextLabel2.Visible
	
end)

exitButton.MouseButton1Click:Connect(function()
	shopFrame.Visible = false
	exitButton.Visible = false
	swordButton.Visible = false
	shieldButton.Visible = false
	TextLabel1.Visible = false
	TextLabel2.Visible = false
end)

swordButton.Text = ItemConfig.Sword
swordButton.MouseButton1Click:Connect(function()
	buyEvent:FireServer("Sword")
end)

shieldButton.Text = ItemConfig.Shield
shieldButton.MouseButton1Click:Connect(function()
	buyEvent:FireServer("Shield")
end)

--Scriptใน ServerScriptService
local DSS = game:GetService("DataStoreService")
local myDataStore = DSS:GetDataStore("PlayerGold")
local myDataInventory = DSS:GetDataStore("InventoryDataStore")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ItemConfig = require(ReplicatedStorage:WaitForChild("ItemConfig"))

game.Players.PlayerAdded:Connect(function(player)
	-- 1. สร้างโครงสร้างข้อมูล
	local leaderstats = Instance.new("Folder", player)
	leaderstats.Name = "leaderstats"

	local gold = Instance.new("IntValue", leaderstats)
	gold.Name = "Gold"
	gold.Value = 0
	
	local inventory = Instance.new("Folder", player)
	inventory.Name = "Inventory"
	
	local sword = Instance.new("BoolValue", inventory)
	sword.Name= "Sword"
	sword.Value = false
	
	local shield = Instance.new("BoolValue", inventory)
	shield.Name= "Shield"
	shield.Value = false
	
	-- 2. โหลดข้อมูลจาก Cloud --
	local userId = "Player_"..player.UserId
	local success, data = pcall(function()
		return myDataStore:GetAsync(userId)
	end)
	
	if success and data then
		gold.Value = data -- นำข้อมูลที่เคยเซฟไว้มาใส่
	end
	
	-- 3. ระบบเพิ่มเงิน (Passive Income) พร้อม Exit Strategy
	task.spawn(function() -- แยก Thread เพื่อไม่ให้ติด Loop
		while true do
			task.wait(5)
			if not player or not player.Parent then break end
			gold.Value += 10
		end
	end)
	-- รับเรื่องการสั่งซื้อ
	local replicatedStorage = game:GetService("ReplicatedStorage")
	local buyEvent = Instance.new("RemoteEvent", replicatedStorage)
	buyEvent.Name = "BuyItem"
	
	buyEvent.OnServerEvent:Connect(function(player, itemName)
		if itemName == "Sword" then
			local gold = player.leaderstats.Gold
			local inventory = player.Inventory
			
			if gold.Value >= ItemConfig.Sword and inventory.Sword.Value == false then
				gold.Value -= ItemConfig.Sword
				inventory.Sword.Value = true
				print(player.Name .. " ซื้อดาบสำเร็จ!")
			else
				print("ซื้อไม่สำเร็จ")
			end
		end
	end)
	
	buyEvent.OnServerEvent:Connect(function(player, itemName)
		if itemName == "Shield" then
			local gold = player.leaderstats.Gold
			local inventory = player.Inventory

			if gold.Value >= ItemConfig.Shield and inventory.Shield.Value == false then
				gold.Value -= ItemConfig.Shield
				inventory.Shield.Value = true
				print(player.Name .. " ซื้อดาบสำเร็จ!")
			else
				print("ซื้อไม่สำเร็จ")
			end
		end
	end)
	-- ระบบให้ดาบ
	-- 1. สร้างตัวแปร ID ไว้ครั้งเดียวที่หัวข้อ PlayerAdded
	local playerKey = "Player_" .. player.UserId
	local serverStorage = game:GetService("ServerStorage")
	
	-- 2. สร้างฟังก์ชัน "ส่งของ" แบบครอบจักรวาล (Dynamic Function)
	local function giveItem(player, itemName)
		local itemModel = serverStorage:FindFirstChild(itemName)
		if itemModel then
			-- ส่งเข้า Backpack
			itemModel:Clone().Parent = player.Backpack
			-- ส่งเข้า StarterGear
			itemModel:Clone().Parent = player.StarterGear
			print("ส่ง " .. itemName .. " ให้ " .. player.Name .. " สำเร็จ")
		end
	end

	-- 3. โหลดข้อมูลครั้งเดียว (DataStore ดึงมาทั้งก้อนได้เลย)
	local success, data = pcall(function()
		return myDataInventory:GetAsync(playerKey)
	end)

	-- 4. ตรวจสอบและมอบของ
	if success and data ~= nil then
		if type(data) == "table" then
			-- โหลดค่าเข้า BoolValue
			inventory.Sword.Value = data.HasSword or false
			inventory.Shield.Value = data.HasShield or false

			-- มอบของให้ (ต้องใส่ชื่อไอเทมด้วย!)
			if inventory.Sword.Value then giveItem(player, "Sword") end
			if inventory.Shield.Value then giveItem(player, "Shield") end
		end
	end
	
	if success and data ~= nil then
		-- อัปเดตใบเสร็จจากฐานข้อมูล
		inventory.Sword.Value = data 
		inventory.Shield.Value = data

		-- สำคัญ: ถ้าโหลดมาแล้วเป็น true ต้องเรียกฟังก์ชันส่งดาบด้วย!
		if inventory.Sword.Value == true then
			giveItem(player, "Sword") 
		end
		if inventory.Shield.Value == true then
			giveItem(player, "Shield") 
		end
	end
	
	sword.Changed:Connect(function(val)
		if val == true then
			giveItem(player, "Sword") -- ใส่ "Sword" เพิ่มเข้าไป
		end
	end)

	shield.Changed:Connect(function(val)
		if val == true then
			giveItem(player, "Shield") -- ใส่ "Shield" เพิ่มเข้าไป
		end
	end)
end)

-- 4. ระบบบันทึกข้อมูลตอนออกจากเกม
game.Players.PlayerRemoving:Connect(function(player)
	local userId = "Player_"..player.UserId
	local success, err = pcall(function()
		-- เซฟเงิน
		myDataStore:SetAsync(userId, player.leaderstats.Gold.Value)

		-- เซฟ Inventory เป็น Table (ป้องกันการเซฟทับ)
		local inventoryData = {
			HasSword = player.Inventory.Sword.Value,
			HasShield = player.Inventory.Shield.Value
		}
		myDataInventory:SetAsync(userId, inventoryData)
	end)
end)

--Module ใน ReplicatedStorage
local MyModule = {} -- สร้าง Table เปล่าๆ ขึ้นมา (เหมือนลังใส่ของ)

-- เราสามารถใส่ "ข้อมูล" หรือ "ฟังก์ชัน" ลงในลังนี้ได้
MyModule.Sword = 50
MyModule.Shield = 100

return MyModule -- ส่ง "ลัง" นี้กลับไปให้คนที่เรียกใช้งาน
