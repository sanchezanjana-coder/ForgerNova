JavaScript
/**
 * ForgeNova - JavaScript Principal (SPA)
 * Manejo de cliente, biblioteca de scripts, IA con Groq, depurador y temas.
 */
document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 0. CONFIGURACIÓN Y CONSTANTES
    // ==========================================
    const GROQ_API_KEY = ""; // Reemplazar con tu API Key de Groq
    const GROQ_MODEL = "llama-3.1-8b-instant";
    const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
    // ==========================================
    // 1. BASE DE DATOS ESTÁTICA DE SCRIPTS (20)
    // ==========================================
    const scriptsDatabase = [
        {
            id: 1,
            title: "Sistema de Leaderstats (Monedas y Nivel)",
            category: "Economía",
            location: "ServerScriptService",
            description: "Crea las estadísticas del jugador al unirse al juego y guarda la estructura básica.",
            code: `local Players = game:GetService("Players")
Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player
    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 100
    coins.Parent = leaderstats
    local level = Instance.new("IntValue")
    level.Name = "Level"
    level.Value = 1
    level.Parent = leaderstats
end)`
        },
        {
            id: 2,
            title: "DataStore2 / Save System Seguro",
            category: "Persistencia",
            location: "ServerScriptService",
            description: "Guarda automáticamente los datos de leaderstats al salir del juego utilizando DataStoreService.",
            code: `local DataStoreService = game:GetService("DataStoreService")
local myDataStore = DataStoreService:GetDataStore("PlayerDataStore")
local Players = game:GetService("Players")
Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player
    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Parent = leaderstats
    local playerUserId = "Player_" .. player.UserId
    local data
    local success, err = pcall(function()
        data = myDataStore:GetAsync(playerUserId)
    end)
    if success and data then
        coins.Value = data
    else
        coins.Value = 0
    end
end)
Players.PlayerRemoving:Connect(function(player)
    local playerUserId = "Player_" .. player.UserId
    local success, err = pcall(function()
        myDataStore:SetAsync(playerUserId, player.leaderstats.Coins.Value)
    end)
end)`
        },
        {
            id: 3,
            title: "Puerta Kill-Block (Lava)",
            category: "Gameplay",
            location: "Workspace",
            description: "Elimina al personaje de forma inmediata cuando toca el bloque.",
            code: `local killBlock = script.Parent
local function onTouch(otherPart)
    local character = otherPart.Parent
    local humanoid = character:FindFirstChildOfClass("Humanoid")
    if humanoid then
        humanoid.Health = 0
    end
end
killBlock.Touched:Connect(onTouch)`
        },
        {
            id: 4,
            title: "Door Opener con ProximityPrompt",
            category: "Interactivos",
            location: "Workspace",
            description: "Abre y cierra una puerta mediante una interacción de ProximityPrompt.",
            code: `local prompt = script.Parent.ProximityPrompt
local door = script.Parent
local isOpen = false
prompt.Triggered:Connect(function(player)
    isOpen = not isOpen
    if isOpen then
        door.Transparency = 0.8
        door.CanCollide = false
    else
        door.Transparency = 0
        door.CanCollide = true
    end
end)`
        },
        {
            id: 5,
            title: "Sistema de Sprint (Correr al presionar Shift)",
            category: "Movimiento",
            location: "StarterPlayerScripts",
            description: "Aumenta la velocidad del personaje cuando se presiona la tecla Shift Izquierdo.",
            code: `local UserInputService = game:GetService("UserInputService")
local Players = game:GetService("Players")
local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")
local NORMAL_SPEED = 16
local SPRINT_SPEED = 28
UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    if input.KeyCode == Enum.KeyCode.LeftShift then
        humanoid.WalkSpeed = SPRINT_SPEED
    end
end)
UserInputService.InputEnded:Connect(function(input, gameProcessed)
    if input.KeyCode == Enum.KeyCode.LeftShift then
        humanoid.WalkSpeed = NORMAL_SPEED
    end
end)`
        },
        {
            id: 6,
            title: "Doble Salto (Double Jump)",
            category: "Movimiento",
            location: "StarterPlayerScripts",
            description: "Permite al jugador realizar un segundo salto en el aire.",
            code: `local UserInputService = game:GetService("UserInputService")
local Players = game:GetService("Players")
local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")
local canDoubleJump = false
local hasDoubleJumped = false
local OLD_JUMP_POWER = 50
local TIME_BETWEEN_JUMPS = 0.2
humanoid.StateChanged:Connect(function(oldState, newState)
    if newState == Enum.HumanoidStateType.Landed then
        canDoubleJump = false
        hasDoubleJumped = false
    elseif newState == Enum.HumanoidStateType.Freefall then
        task.wait(TIME_BETWEEN_JUMPS)
        canDoubleJump = true
    end
end)
UserInputService.JumpRequest:Connect(function()
    if canDoubleJump and not hasDoubleJumped then
        hasDoubleJumped = true
        humanoid:ChangeState(Enum.HumanoidStateType.Jumping)
    end
end)`
        },
        {
            id: 7,
            title: "Detección de Teclas con RemoteEvent",
            category: "Redes",
            location: "ReplicatedStorage",
            description: "Envía una señal desde un LocalScript al servidor al presionar una tecla.",
            code: `-- LocalScript (StarterPlayerScripts)
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local UserInputService = game:GetService("UserInputService")
local remoteEvent = ReplicatedStorage:WaitForChild("MyRemoteEvent")
UserInputService.InputBegan:Connect(function(input, gpe)
    if not gpe and input.KeyCode == Enum.KeyCode.E then
        remoteEvent:FireServer("AccionE")
    end
end)
-- Script (ServerScriptService)
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local remoteEvent = ReplicatedStorage:WaitForChild("MyRemoteEvent")
remoteEvent.OnServerEvent:Connect(function(player, action)
    print(player.Name .. " ejecuto la accion: " .. action)
end)`
        },
        {
            id: 8,
            title: "Sistema de Salud Regenerativa",
            category: "Gameplay",
            location: "StarterCharacterScripts",
            description: "Regenera la salud del personaje progresivamente tras no recibir daño.",
            code: `local character = script.Parent
local humanoid = character:WaitForChild("Humanoid")
local REGEN_RATE = 1 -- 1% cada intervalo
local REGEN_STEP = 1 -- Cada 1 segundo
while true do
    task.wait(REGEN_STEP)
    if humanoid.Health < humanoid.MaxHealth and humanoid.Health > 0 then
        humanoid.Health = math.min(humanoid.Health + REGEN_RATE, humanoid.MaxHealth)
    end
end`
        },
        {
            id: 9,
            title: "Manejo de Animación de Ataque",
            category: "Combate",
            location: "StarterCharacterScripts",
            description: "Carga y reproduce una animación de ataque mediante Animator.",
            code: `local character = script.Parent
local humanoid = character:WaitForChild("Humanoid")
local animator = humanoid:WaitForChild("Animator")
local animation = Instance.new("Animation")
animation.AnimationId = "rbxassetid://1234567890" -- Reemplazar ID
local animTrack = animator:LoadAnimation(animation)
local function attack()
    animTrack:Play()
end`
        },
        {
            id: 10,
            title: "Plataforma Desaparecedora (Disappearing Platform)",
            category: "Mecanicas",
            location: "Workspace",
            description: "La plataforma se vuelve intangible y transparente unos segundos tras pisarla.",
            code: `local platform = script.Parent
local isStepped = false
local function disappear()
    if not isStepped then
        isStepped = true
        task.wait(0.5)
        platform.Transparency = 0.8
        platform.CanCollide = false
        task.wait(3)
        platform.Transparency = 0
        platform.CanCollide = true
        isStepped = false
    end
end
platform.Touched:Connect(disappear)`
        },
        {
            id: 11,
            title: "Notificación en Pantalla (GUI Pop-up)",
            category: "UI",
            location: "StarterGui",
            description: "Muestra un texto emergente en la pantalla del usuario por un tiempo limitado.",
            code: `local Players = game:GetService("Players")
local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")
local function showNotification(text)
    local screenGui = Instance.new("ScreenGui", playerGui)
    local textLabel = Instance.new("TextLabel", screenGui)
    textLabel.Size = UDim2.new(0, 300, 0, 50)
    textLabel.Position = UDim2.new(0.5, -150, 0.2, 0)
    textLabel.Text = text
    textLabel.TextScaled = true
    textLabel.BackgroundColor3 = Color3.fromRGB(30, 30, 30)
    textLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
    
    task.wait(3)
    screenGui:Destroy()
end`
        },
        {
            id: 12,
            title: "Teleport entre Dos Puntos",
            category: "Mecanicas",
            location: "Workspace",
            description: "Teletransporta al personaje desde la parte A hacia la parte B.",
            code: `local partA = script.Parent
local partB = workspace:WaitForChild("DestinationPart")
partA.Touched:Connect(function(otherPart)
    local character = otherPart.Parent
    local hrp = character:FindFirstChild("HumanoidRootPart")
    if hrp then
        hrp.CFrame = partB.CFrame + Vector3.new(0, 3, 0)
    end
end)`
        },
        {
            id: 13,
            title: "Coleccionable de Monedas (Coin Pickup)",
            category: "Economía",
            location: "Workspace",
            description: "Concede monedas al jugador y destruye la moneda recolectada.",
            code: `local coin = script.Parent
coin.Touched:Connect(function(otherPart)
    local character = otherPart.Parent
    local player = game.Players:GetPlayerFromCharacter(character)
    if player then
        local leaderstats = player:FindFirstChild("leaderstats")
        if leaderstats then
            local coins = leaderstats:FindFirstChild("Coins")
            if coins then
                coins.Value = coins.Value + 10
                coin:Destroy()
            end
        end
    end
end)`
        },
        {
            id: 14,
            title: "Sistema de Day/Night Cycle",
            category: "Entorno",
            location: "ServerScriptService",
            description: "Rotación automática del tiempo del día utilizando Lighting.",
            code: `local Lighting = game:GetService("Lighting")
local MINUTES_PER_SECOND = 1
while true do
    Lighting:SetMinutesAfterMidnight(Lighting:GetMinutesAfterMidnight() + MINUTES_PER_SECOND)
    task.wait(1)
end`
        },
        {
            id: 15,
            title: "Checkpoints de Obby",
            category: "Gameplay",
            location: "Workspace",
            description: "Guarda el spawn del jugador al tocar diferentes plataformas numéricas.",
            code: `local spawnPart = script.Parent
local stageNumber = 1
spawnPart.Touched:Connect(function(otherPart)
    local character = otherPart.Parent
    local player = game.Players:GetPlayerFromCharacter(character)
    if player then
        local leaderstats = player:FindFirstChild("leaderstats")
        if leaderstats then
            local stage = leaderstats:FindFirstChild("Stage")
            if stage and stage.Value < stageNumber then
                stage.Value = stageNumber
            end
        end
    end
end)`
        },
        {
            id: 16,
            title: "Cámara en Tercera Persona Bloqueada",
            category: "Cámara",
            location: "StarterPlayerScripts",
            description: "Fija el modo de cámara del jugador a una distancia específica.",
            code: `local Players = game:GetService("Players")
local player = Players.LocalPlayer
player.CameraMaxZoomDistance = 15
player.CameraMinZoomDistance = 15
player.CameraMode = Enum.CameraMode.Classic`
        },
        {
            id: 17,
            title: "Herramienta Sword Básica (Damage on Touch)",
            category: "Herramientas",
            location: "StarterPack",
            description: "Lógica de daño al activar una herramienta tipo espada.",
            code: `local tool = script.Parent
local handle = tool:WaitForChild("Handle")
local function onTouch(otherPart)
    local character = otherPart.Parent
    if character == tool.Parent then return end
    local humanoid = character:FindFirstChildOfClass("Humanoid")
    if humanoid then
        humanoid:TakeDamage(25)
    end
end
tool.Activated:Connect(function()
    local connection = handle.Touched:Connect(onTouch)
    task.wait(0.5)
    connection:Disconnect()
end)`
        },
        {
            id: 18,
            title: "Anti-Speed Hack Básico",
            category: "Seguridad",
            location: "ServerScriptService",
            description: "Detecta y resetea jugadores que excedan la velocidad permitida en el servidor.",
            code: `local Players = game:GetService("Players")
local MAX_SPEED = 30
Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function(character)
        local hrp = character:WaitForChild("HumanoidRootPart")
        local lastPosition = hrp.Position
        
        task.spawn(function()
            while character and character.Parent do
                task.wait(1)
                local distance = (hrp.Position - lastPosition).Magnitude
                if distance > MAX_SPEED then
                    hrp.CFrame = CFrame.new(lastPosition)
                else
                    lastPosition = hrp.Position
                end
            end
        end)
    end)
end)`
        },
        {
            id: 19,
            title: "Generador de Partículas al Tocar",
            category: "Efectos",
            location: "Workspace",
            description: "Habilita emisor de partículas por tiempo limitado al contacto.",
            code: `local part = script.Parent
local emitter = part:FindFirstChildOfClass("ParticleEmitter")
part.Touched:Connect(function(otherPart)
    if emitter and not emitter.Enabled then
        emitter.Enabled = true
        task.wait(2)
        emitter.Enabled = false
    end
end)`
        },
        {
            id: 20,
            title: "Cargar Modelo desde ReplicatedStorage",
            category: "Mecanicas",
            location: "ServerScriptService",
            description: "Clona un modelo guardado en ReplicatedStorage y lo ubica en Workspace.",
            code: `local ReplicatedStorage = game:GetService("ReplicatedStorage")
local modelTemplate = ReplicatedStorage:WaitForChild("MyModel")
local function spawnModel(position)
    local newModel = modelTemplate:Clone()
    newModel:PivotTo(CFrame.new(position))
    newModel.Parent = workspace
end`
        }
    ];
    // Configuración de ubicación (Iconos y Colores)
    const locationBadges = {
        Workspace: { icon: "fas fa-cube", color: "#38bdf8" },
        ServerScriptService: { icon: "fas fa-server", color: "#4ade80" },
        StarterPlayerScripts: { icon: "fas fa-user-gear", color: "#facc15" },
        StarterCharacterScripts: { icon: "fas fa-person", color: "#fb923c" },
        ReplicatedStorage: { icon: "fas fa-boxes-stacked", color: "#a855f7" },
        StarterGui: { icon: "fas fa-desktop", color: "#f43f5e" },
        StarterPack: { icon: "fas fa-box-open", color: "#e879f9" },
        Default: { icon: "fas fa-code", color: "#94a3b8" }
    };
    // ==========================================
    // 2. MOTOR DE RENDERIZADO Y BÚSQUEDA
    // ==========================================
    const libraryContainer = document.getElementById("library-container") || document.querySelector(".library-grid");
    const searchInput = document.getElementById("library-search");
    function renderLibrary(scriptsToRender) {
        if (!libraryContainer) return;
        libraryContainer.innerHTML = "";
        if (scriptsToRender.length === 0) {
            libraryContainer.innerHTML = `
No se encontraron scripts que coincidan con la búsqueda.
`; return; }
    scriptsToRender.forEach(script => {
        const badgeInfo = locationBadges[script.location] || locationBadges.Default;
        
        const card = document.createElement("div");
        card.className = "glass-card script-card";
        card.innerHTML = `
** ${script.location}
${script.category}
${script.title}
${script.description}
Lua
${escapeHTML(script.code)}
** Copiar
    `;
    libraryContainer.appendChild(card);
});
setupCopyButtons();
}
function escapeHTML(str) { return str.replace(/[&<>'"]/g, tag => ({ '&': '&', '<': '<', '>': '>', "'": ''', '"': '"' }[tag] || tag) ); }
if (searchInput) { searchInput.addEventListener("input", (e) => { const query = e.target.value.toLowerCase(); const filtered = scriptsDatabase.filter(script => script.title.toLowerCase().includes(query) || script.description.toLowerCase().includes(query) || script.category.toLowerCase().includes(query) || script.location.toLowerCase().includes(query) ); renderLibrary(filtered); }); }
// Inicializar la biblioteca renderLibrary(scriptsDatabase);
// ========================================== // 3. GESTOR UNIVERSAL DE COPIAS // ========================================== function setupCopyButtons() { document.querySelectorAll(".copy-btn").forEach(button => { if (button.dataset.hasCopyListener) return; // Evitar duplicados button.dataset.hasCopyListener = "true";
    button.addEventListener("click", async () => {
        const wrapper = button.closest(".code-wrapper") || button.parentElement;
        const codeBlock = wrapper.querySelector("code") || wrapper.querySelector("pre");
        
        if (!codeBlock) return;
        const textToCopy = codeBlock.innerText;
        let copied = false;
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(textToCopy);
                copied = true;
            } catch (err) {
                copied = false;
            }
        }
        if (!copied) {
            // Respaldo de compatibilidad
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
                copied = true;
            } catch (err) {
                console.error("Error al copiar texto:", err);
            }
            document.body.removeChild(textArea);
        }
        if (copied) {
            const originalHTML = button.innerHTML;
            button.innerHTML = `** ¡Copiado!`;
            button.style.background = "#22c55e";
            button.style.color = "#ffffff";
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = "";
                button.style.color = "";
            }, 2000);
        }
    });
});
}
// ========================================== // 4. ENRUTAMIENTO Y MENÚ LATERAL // ========================================== const navItems = document.querySelectorAll(".sidebar-nav .nav-item"); const views = document.querySelectorAll(".view-section");
navItems.forEach(item => { item.addEventListener("click", (e) => { e.preventDefault(); const targetViewId = item.getAttribute("data-target") || item.getAttribute("href")?.replace("#", "");
    if (!targetViewId) return;
    navItems.forEach(i => i.classList.remove("active"));
    views.forEach(v => v.classList.remove("active"));
    item.classList.add("active");
    const targetView = document.getElementById(targetViewId);
    if (targetView) targetView.classList.add("active");
});
});
// ========================================== // 5. CHAT CON INTELIGENCIA ARTIFICIAL (GROQ) // ========================================== const chatForm = document.getElementById("chat-form"); const chatInput = document.getElementById("chat-input"); const chatMessagesContainer = document.getElementById("chat-messages");
if (chatForm && chatInput && chatMessagesContainer) { chatForm.addEventListener("submit", async (e) => { e.preventDefault(); const promptText = chatInput.value.trim(); if (!promptText) return;
    appendChatMessage("user", promptText);
    chatInput.value = "";
    if (!GROQ_API_KEY) {
        appendChatMessage("assistant", "⚠️ Error: No se ha configurado la clave API de Groq en script.js.");
        return;
    }
    const loadingMessage = appendChatMessage("assistant", "Pensando y generando script Luau...");
    try {
        const response = await fetch(GROQ_ENDPOINT, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    {
                        role: "system",
                        content: "Eres un desarrollador experto en Roblox Studio y Luau Scripting. Tu tarea es generar código limpio, profesional, optimizado y bien documentado. Responde utilizando bloques de código ```lua cuando proporciones scripts."
                    },
                    {
                        role: "user",
                        content: promptText
                    }
                ],
                temperature: 0.2
            })
        });
        const data = await response.json();
        loadingMessage.remove();
        if (data.choices && data.choices[0]) {
            const aiReply = data.choices[0].message.content;
            appendChatMessage("assistant", aiReply);
        } else {
            appendChatMessage("assistant", "Hubo un error al comunicarse con la API de Groq.");
        }
    } catch (err) {
        loadingMessage.remove();
        appendChatMessage("assistant", `Error de red o conexión: ${err.message}`);
    }
});
}
function appendChatMessage(role, text) { const msgDiv = document.createElement("div"); msgDiv.className = chat-message ${role}-message; msgDiv.style.display = "flex"; msgDiv.style.gap = "1rem"; msgDiv.style.marginBottom = "1rem"; msgDiv.style.alignItems = "flex-start";
const iconClass = role === "user" ? "fas fa-user" : "fas fa-robot";
const iconColor = "var(--theme-primary, #6366f1)";
// Procesar markdown de código si viene del asistente
let formattedContent = escapeHTML(text);
if (role === "assistant") {
    const codeBlockRegex = /```lua([\s\S]*?)```/g;
    formattedContent = formattedContent.replace(codeBlockRegex, (match, code) => {
        return `
${code.trim()}
** Copiar
`; }); }
    msgDiv.innerHTML = `
**
${formattedContent}
`;
chatMessagesContainer.appendChild(msgDiv);
chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
setupCopyButtons();
return msgDiv;
}
// ========================================== // 6. HERRAMIENTA DE DIAGNÓSTICO (ERROR FIXER) // ========================================== const fixerForm = document.getElementById("fixer-form"); const errorInput = document.getElementById("error-input"); const fixerResults = document.getElementById("fixer-results");
if (fixerForm && errorInput && fixerResults) { fixerForm.addEventListener("submit", (e) => { e.preventDefault(); const errorText = errorInput.value.trim(); if (!errorText) return;
    fixerResults.innerHTML = `
** Diagnóstico detectado
Posible problema de sincronización de instancias (Infinite Yield o nil value) al intentar acceder a objetos que aún no se han cargado en el cliente/servidor.
Solución sugerida:
Sustituye llamadas directas o la función FindFirstChild() por el uso seguro de WaitForChild().
Lua
-- Código corregido sugerido
local Player = game:GetService("Players").LocalPlayer
local Character = Player.Character or Player.CharacterAdded:Wait()
-- Uso seguro para evitar 'Infinite yield' o 'nil'
local Humanoid = Character:WaitForChild("Humanoid", 5)
if Humanoid then
    print("Humanoid cargado correctamente:", Humanoid.Name)
else
    warn("El Humanoid tardo demasiado en cargar.")
end
** Copiar
        `;
        setupCopyButtons();
    });
}
// ==========================================
// 7. TEMAS Y MODO CLARO/OSCURO
// ==========================================
const themeToggleBtn = document.getElementById("theme-toggle");
const colorPickers = document.querySelectorAll("[data-theme]");
if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        const isLight = document.body.classList.contains("light-mode");
        themeToggleBtn.innerHTML = isLight 
            ? `** Modo Oscuro` 
            : `** Modo Claro`;
    });
}
colorPickers.forEach(picker => {
    picker.addEventListener("click", () => {
        const themeClass = picker.getAttribute("data-theme");
        document.body.classList.remove("theme-purple", "theme-blue", "theme-green", "theme-orange");
        if (themeClass) {
            document.body.classList.add(themeClass);
        }
    });
});
// ==========================================
// 8. TRANSICIÓN LANDING - APP SCREEN
// ==========================================
const startBtn = document.getElementById("start-app-btn");
const backLandingBtn = document.getElementById("back-landing-btn");
const landingScreen = document.getElementById("landing-screen");
const appScreen = document.getElementById("app-screen");
if (startBtn && landingScreen && appScreen) {
    startBtn.addEventListener("click", () => {
        landingScreen.style.display = "none";
        appScreen.style.display = "flex";
    });
}
if (backLandingBtn && landingScreen && appScreen) {
    backLandingBtn.addEventListener("click", () => {
        appScreen.style.display = "none";
        landingScreen.style.display = "block";
    });
}
});

