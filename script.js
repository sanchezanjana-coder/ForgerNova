/* ==========================================================================
   FORGENOVA ENGINE - BIBLIOTECA DE SCRIPTS, GENERADOR Y CONTROLADOR GENERAL
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================================
    // 1. BASE DE DATOS DE LA BIBLIOTECA (LOS 20 SCRIPTS MÁS USADOS)
    // ==========================================================================
    const scriptLibrary = [
        {
            id: 1,
            title: "Sistema de Leaderstats & Guardado DataStore",
            category: "Server Script",
            location: "ServerScriptService > LeaderstatsService",
            description: "Crea el tablero de estadísticas (Monedas, Gemas, Nivel) y guarda de forma segura el progreso en la nube de Roblox al salir del servidor.",
            code: `-- ServerScriptService > LeaderstatsService
local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")
local PlayerDataStore = DataStoreService:GetDataStore("PlayerData_v2")

local DEFAULT_DATA = { Coins = 100, Gems = 0, Level = 1 }

local function loadData(player)
    local playerKey = "Player_" .. player.UserId
    local success, savedData = pcall(function() return PlayerDataStore:GetAsync(playerKey) end)
    return (success and savedData) and savedData or DEFAULT_DATA
end

local function saveData(player)
    local leaderstats = player:FindFirstChild("leaderstats")
    if not leaderstats then return end

    local dataToSave = {
        Coins = leaderstats.Coins.Value,
        Gems = leaderstats.Gems.Value,
        Level = leaderstats.Level.Value
    }
    pcall(function() PlayerDataStore:SetAsync("Player_" .. player.UserId, dataToSave) end)
end

Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local data = loadData(player)

    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = data.Coins
    coins.Parent = leaderstats

    local gems = Instance.new("IntValue")
    gems.Name = "Gems"
    gems.Value = data.Gems
    gems.Parent = leaderstats

    local level = Instance.new("IntValue")
    level.Name = "Level"
    level.Value = data.Level
    level.Parent = leaderstats
end)

Players.PlayerRemoving:Connect(saveData)
game:BindToClose(function()
    for _, player in ipairs(Players:GetPlayers()) do saveData(player) end
end)`
        },
        {
            id: 2,
            title: "Teletransporte entre dos Partes (CFrame)",
            category: "Server Script",
            location: "Workspace > TeleportPart",
            description: "Mueve instantáneamente al jugador que pise un bloque hacia otro bloque de destino sin bugs de colisión.",
            code: `-- Workspace > TeleportPart > Script
local Players = game:GetService("Players")
local teleportPart = script.Parent
local destinationPart = workspace:WaitForChild("DestinationPart")

local debounceTable = {}

teleportPart.Touched:Connect(function(hit)
    local character = hit.Parent
    local player = Players:GetPlayerFromCharacter(character)
    if not player then return end

    local hrp = character:FindFirstChild("HumanoidRootPart")
    if hrp and not debounceTable[player] then
        debounceTable[player] = true
        hrp.CFrame = destinationPart.CFrame + Vector3.new(0, 3, 0)
        task.wait(2)
        debounceTable[player] = nil
    end
end)`
        },
        {
            id: 3,
            title: "Bloque de Lava / Daño Progresivo",
            category: "Server Script",
            location: "Workspace > KillBlock",
            description: "Aplica daño instantáneo o por intervalos al jugador al entrar en contacto físico con una superficie nociva.",
            code: `-- Workspace > KillBlock > Script
local part = script.Parent

part.Touched:Connect(function(hit)
    local character = hit.Parent
    local humanoid = character:FindFirstChildOfClass("Humanoid")
    if humanoid and humanoid.Health > 0 then
        humanoid.Health = 0
    end
end)`
        },
        {
            id: 4,
            title: "Puerta Interactiva con ProximityPrompt",
            category: "Server Script",
            location: "Workspace > DoorFrame > ProximityPrompt",
            description: "Abre y cierra una puerta mediante animación fluida con TweenService al presionar la tecla de interacción.",
            code: `-- Workspace > Door > ProximityPrompt > Script
local TweenService = game:GetService("TweenService")
local prompt = script.Parent
local door = prompt.Parent

local isOpen = false
local tweenInfo = TweenInfo.new(0.8, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)

local openCFrame = door.CFrame * CFrame.Angles(0, math.rad(90), 0)
local closeCFrame = door.CFrame

prompt.Triggered:Connect(function(player)
    prompt.Enabled = false
    local targetCFrame = isOpen and closeCFrame or openCFrame
    local tween = TweenService:Create(door, tweenInfo, {CFrame = targetCFrame})
    tween:Play()
    tween.Completed:Wait()
    isOpen = not isOpen
    prompt.ActionText = isOpen and "Cerrar Puerta" or "Abrir Puerta"
    prompt.Enabled = true
end)`
        },
        {
            id: 5,
            title: "Recolector de Monedas con Respawn",
            category: "Server Script",
            location: "Workspace > CoinPart",
            description: "Moneda flotante con rotación continua que entrega puntos al jugador y reaparece después de unos segundos.",
            code: `-- Workspace > CoinPart > Script
local TweenService = game:GetService("TweenService")
local coin = script.Parent

-- Animación de rotación continua
local spinInfo = TweenInfo.new(3, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut, -1)
local spinTween = TweenService:Create(coin, spinInfo, {Orientation = coin.Orientation + Vector3.new(0, 360, 0)})
spinTween:Play()

local isCollected = false

coin.Touched:Connect(function(hit)
    local character = hit.Parent
    local player = game.Players:GetPlayerFromCharacter(character)
    
    if player and not isCollected then
        isCollected = true
        local leaderstats = player:FindFirstChild("leaderstats")
        if leaderstats and leaderstats:FindFirstChild("Coins") then
            leaderstats.Coins.Value += 10
        end
        
        coin.Transparency = 1
        coin.CanCollide = false
        task.wait(5)
        coin.Transparency = 0
        coin.CanCollide = true
        isCollected = false
    end
end)`
        },
        {
            id: 6,
            title: "Sistema de Salud: Botiquín Curativo",
            category: "Server Script",
            location: "Workspace > HealthPack",
            description: "Restaura la vida del personaje hasta el máximo de 100 y desaparece temporalmente para recargarse.",
            code: `-- Workspace > HealthPack > Script
local pack = script.Parent
local active = true

pack.Touched:Connect(function(hit)
    local character = hit.Parent
    local humanoid = character:FindFirstChildOfClass("Humanoid")
    if humanoid and humanoid.Health < humanoid.MaxHealth and active then
        active = false
        humanoid.Health = math.min(humanoid.MaxHealth, humanoid.Health + 50)
        pack.Transparency = 1
        task.wait(10)
        pack.Transparency = 0
        active = true
    end
end)`
        },
        {
            id: 7,
            title: "Plataforma Trampolín (Super Salto)",
            category: "Server Script",
            location: "Workspace > JumpPad",
            description: "Dispara verticalmente al personaje hacia el aire aplicando fuerza física controlada a través de su velocidad.",
            code: `-- Workspace > JumpPad > Script
local pad = script.Parent
local JUMP_POWER = 120

pad.Touched:Connect(function(hit)
    local character = hit.Parent
    local hrp = character:FindFirstChild("HumanoidRootPart")
    if hrp then
        hrp.Velocity = Vector3.new(hrp.Velocity.X, JUMP_POWER, hrp.Velocity.Z)
    end
end)`
        },
        {
            id: 8,
            title: "Sprint / Correr al Mantener Shift",
            category: "LocalScript",
            location: "StarterPlayer > StarterPlayerScripts > SprintClient",
            description: "Aumenta la velocidad de movimiento del jugador mientras mantiene presionada la tecla Shift Izquierdo.",
            code: `-- StarterPlayerScripts > SprintClient (LocalScript)
local UserInputService = game:GetService("UserInputService")
local Players = game:GetService("Players")

local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")

local NORMAL_SPEED = 16
local SPRINT_SPEED = 32

UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    if input.KeyCode == Enum.KeyCode.LeftShift then
        humanoid.WalkSpeed = SPRINT_SPEED
    end
end)

UserInputService.InputEnded:Connect(function(input)
    if input.KeyCode == Enum.KeyCode.LeftShift then
        humanoid.WalkSpeed = NORMAL_SPEED
    end
end)`
        },
        {
            id: 9,
            title: "Sistema de checkpoints (Obby Checkpoint)",
            category: "Server Script",
            location: "ServerScriptService > CheckpointManager",
            description: "Guarda la fase actual del jugador en el obby y lo teletransporta a su último punto cuando muere.",
            code: `-- ServerScriptService > CheckpointManager
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    local stage = Instance.new("IntValue")
    stage.Name = "Stage"
    stage.Value = 1
    stage.Parent = player

    player.CharacterAdded:Connect(function(character)
        local hrp = character:WaitForChild("HumanoidRootPart")
        task.wait(0.1)
        local checkpoint = workspace.Checkpoints:FindFirstChild(tostring(stage.Value))
        if checkpoint then
            hrp.CFrame = checkpoint.CFrame + Vector3.new(0, 3, 0)
        end
    end)
end)`
        },
        {
            id: 10,
            title: "Zona Segura (SafeZone / No PVP)",
            category: "Server Script",
            location: "Workspace > SafeZonePart",
            description: "Desactiva el daño de todos los personajes mientras permanezcan dentro de una zona delimitada.",
            code: `-- Workspace > SafeZonePart > Script
local zone = script.Parent

zone.Touched:Connect(function(hit)
    local character = hit.Parent
    local forcefield = character:FindFirstChildOfClass("ForceField")
    if not forcefield and character:FindFirstChildOfClass("Humanoid") then
        Instance.new("ForceField", character)
    end
end)

zone.TouchEnded:Connect(function(hit)
    local character = hit.Parent
    local forcefield = character:FindFirstChildOfClass("ForceField")
    if forcefield then
        forcefield:Destroy()
    end
end)`
        },
        {
            id: 11,
            title: "Botón GUI para Reiniciar / Morir",
            category: "LocalScript",
            location: "StarterGui > ScreenGui > KillButton",
            description: "Interfaz gráfica con botón que permite al jugador reiniciar su personaje manualmente.",
            code: `-- StarterGui > ScreenGui > TextButton > LocalScript
local button = script.Parent
local player = game.Players.LocalPlayer

button.MouseButton1Click:Connect(function()
    local character = player.Character
    if character then
        local humanoid = character:FindFirstChildOfClass("Humanoid")
        if humanoid then
            humanoid.Health = 0
        end
    end
end)`
        },
        {
            id: 12,
            title: "Abrir/Cerrar Panel GUI con Botón",
            category: "LocalScript",
            location: "StarterGui > ScreenGui > ToggleButton",
            description: "Muestra u oculta una ventana flotante de interfaz al hacer clic en un botón.",
            code: `-- StarterGui > ScreenGui > ToggleButton > LocalScript
local button = script.Parent
local frame = button.Parent:WaitForChild("Frame")

button.MouseButton1Click:Connect(function()
    frame.Visible = not frame.Visible
end)`
        },
        {
            id: 13,
            title: "Música de Fondo en Bucle (Background Music)",
            category: "Server Script",
            location: "SoundService > BGM",
            description: "Reproduce música ambiente contínua para todos los jugadores de forma sincronizada.",
            code: `-- SoundService > Script
local soundService = game:GetService("SoundService")

local sound = Instance.new("Sound")
sound.SoundId = "rbxassetid://183784924" -- Reemplazar ID de sonido
sound.Volume = 0.5
sound.Looped = true
sound.Parent = soundService
sound:Play()`
        },
        {
            id: 14,
            title: "Plataforma Desaparecedora al Pisarla",
            category: "Server Script",
            location: "Workspace > DisappearingPart",
            description: "El bloque se vuelve transparente y pierde colisión 1 segundo después de ser pisado, reapareciendo luego.",
            code: `-- Workspace > DisappearingPart > Script
local part = script.Parent
local isStepped = false

part.Touched:Connect(function(hit)
    local character = hit.Parent
    if character:FindFirstChildOfClass("Humanoid") and not isStepped then
        isStepped = true
        task.wait(1)
        part.Transparency = 1
        part.CanCollide = false
        task.wait(3)
        part.Transparency = 0
        part.CanCollide = true
        isStepped = false
    end
end)`
        },
        {
            id: 15,
            title: "Sistema de Tiempo en Servidor (Reloj Día/Noche)",
            category: "Server Script",
            location: "ServerScriptService > DayNightCycle",
            description: "Transición continua entre día y noche afectando la iluminación global del juego.",
            code: `-- ServerScriptService > DayNightCycle
local Lighting = game:GetService("Lighting")
local MINUTES_PER_SECOND = 1

while true do
    Lighting:SetMinutesAfterMidnight(Lighting:GetMinutesAfterMidnight() + MINUTES_PER_SECOND)
    task.wait(0.1)
end`
        },
        {
            id: 16,
            title: "Herramienta que Entrega Dinero al Usarla (Tool)",
            category: "Server Script",
            location: "StarterPack > CoinTool",
            description: "Objeto equipable que al hacer clic le suma monedas al jugador.",
            code: `-- StarterPack > Tool > Script
local tool = script.Parent

tool.Activated:Connect(function()
    local character = tool.Parent
    local player = game.Players:GetPlayerFromCharacter(character)
    if player then
        local leaderstats = player:FindFirstChild("leaderstats")
        if leaderstats and leaderstats:FindFirstChild("Coins") then
            leaderstats.Coins.Value += 5
        end
    end
end)`
        },
        {
            id: 17,
            title: "Paso de Pago por Gamepass (MarketplaceService)",
            category: "Server Script",
            location: "ServerScriptService > GamepassHandler",
            description: "Verifica si el jugador posee un Gamepass o procesa la compra en vivo.",
            code: `-- ServerScriptService > GamepassHandler
local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")

local GAMEPASS_ID = 0000000 -- Reemplazar con ID real

Players.PlayerAdded:Connect(function(player)
    local hasPass = false
    pcall(function()
        hasPass = MarketplaceService:UserOwnsGamePassAsync(player.UserId, GAMEPASS_ID)
    end)

    if hasPass then
        print(player.Name .. " posee el Gamepass VIP!")
    end
end)`
        },
        {
            id: 18,
            title: "Seguir al Jugador (Pet AI Básica)",
            category: "Server Script",
            location: "Workspace > PetModel",
            description: "Maneja una mascota virtual que camina persiguiendo al dueño de forma suave.",
            code: `-- Workspace > Pet > Script
local pet = script.Parent
local primaryPart = pet.PrimaryPart or pet:FindFirstChild("HumanoidRootPart")

game.Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function(character)
        local hrp = character:WaitForChild("HumanoidRootPart")
        while task.wait(0.1) do
            if hrp and primaryPart then
                primaryPart.CFrame = primaryPart.CFrame:Lerp(hrp.CFrame * CFrame.new(2, 0, 2), 0.1)
            end
        end
    end)
end)`
        },
        {
            id: 19,
            title: "Sistema de Anti-Chat Spam",
            category: "Server Script",
            location: "ServerScriptService > AntiSpam",
            description: "Filtra el canal de chat para evitar que usuarios envíen demasiados mensajes seguidos.",
            code: `-- ServerScriptService > AntiSpam
local Players = game:GetService("Players")
local cooldowns = {}

Players.PlayerAdded:Connect(function(player)
    player.Chatted:Connect(function(msg)
        local lastTime = cooldowns[player] or 0
        if tick() - lastTime < 1 then
            warn(player.Name .. " está enviando mensajes demasiado rápido.")
        else
            cooldowns[player] = tick()
        end
    end)
end)`
        },
        {
            id: 20,
            title: "Cinta Transportadora (Conveyor Belt)",
            category: "Server Script",
            location: "Workspace > ConveyorPart",
            description: "Mueve automáticamente cualquier objeto o personaje que se posicione sobre el bloque.",
            code: `-- Workspace > ConveyorPart > Script
local part = script.Parent
local SPEED = 10

part.AssemblyLinearVelocity = part.CFrame.LookVector * SPEED`
        }
    ];

    // ==========================================================================
    // 2. RENDERIZADO DE LA BIBLIOTECA & BÚSQUEDA
    // ==========================================================================
    const libraryContainer = document.getElementById("library-container");
    const searchInput = document.getElementById("library-search");

    function renderLibrary(scripts) {
        if (!libraryContainer) return;
        libraryContainer.innerHTML = "";

        if (scripts.length === 0) {
            libraryContainer.innerHTML = `<p style="color: var(--text-secondary); grid-column: 1/-1;">No se encontraron scripts que coincidan con la búsqueda.</p>`;
            return;
        }

        scripts.forEach(item => {
            const card = document.createElement("div");
            card.className = "glass-card script-card";
            card.innerHTML = `
                <div class="script-card-header">
                    <span class="script-title">${item.title}</span>
                    <span class="script-badge">${item.category}</span>
                </div>
                <p style="font-size:0.9rem; color:var(--text-secondary);">${item.description}</p>
                <div class="script-location">
                    <i class="fas fa-folder-open"></i> Ubicación: <code>${item.location}</code>
                </div>
                <pre><code>${item.code}</code></pre>
                <button class="btn-purple copy-btn" style="width:100%;">
                    <i class="fas fa-copy"></i> Copiar Código Completo
                </button>
            `;
            libraryContainer.appendChild(card);
        });

        bindCopyButtons();
    }

    renderLibrary(scriptLibrary);

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = scriptLibrary.filter(s => 
                s.title.toLowerCase().includes(query) || 
                s.description.toLowerCase().includes(query) ||
                s.location.toLowerCase().includes(query)
            );
            renderLibrary(filtered);
        });
    }

    // ==========================================================================
    // 3. COPIAR CÓDIGO AL PORTAPAPELES
    // ==========================================================================
    function bindCopyButtons() {
        document.querySelectorAll(".copy-btn").forEach(btn => {
            btn.onclick = () => {
                const parent = btn.closest(".script-card") || btn.closest(".message-content");
                const code = parent ? parent.querySelector("pre code") : null;
                if (code) {
                    navigator.clipboard.writeText(code.innerText);
                    btn.innerHTML = `<i class="fas fa-check"></i> ¡Copiado con Éxito!`;
                    setTimeout(() => { 
                        btn.innerHTML = `<i class="fas fa-copy"></i> Copiar Código Completo`; 
                    }, 2000);
                }
            };
        });
    }

    // ==========================================================================
    // 4. NAVEGACIÓN Y CAMBIO DE PESTAÑAS (SIDEBAR)
    // ==========================================================================
    const navItems = document.querySelectorAll(".sidebar-nav .nav-item");
    const viewSections = document.querySelectorAll(".view-section");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetView = item.getAttribute("data-view");
            navItems.forEach(nav => nav.classList.remove("active"));
            viewSections.forEach(sec => sec.classList.remove("active"));

            item.classList.add("active");
            const activeSection = document.getElementById(`view-${targetView}`);
            if (activeSection) activeSection.classList.add("active");
        });
    });

    // ==========================================================================
    // 5. GENERADOR DINÁMICO DE CÓDIGO (PESTAÑA CHAT)
    // ==========================================================================
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");

    if (chatForm) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const query = chatInput.value.trim();
            if (!query) return;

            appendMessage("user", query);
            chatInput.value = "";

            setTimeout(() => {
                const response = generateCustomLuau(query);
                appendMessage("ai", response);
            }, 300);
        });
    }

    function generateCustomLuau(query) {
        return `
            <p>Estructura Luau generada para: <strong>"${query}"</strong></p>
            <div style="margin: 8px 0; font-size: 0.85rem; color: var(--primary-color);">
                <i class="fas fa-file-code"></i> Tipo: <strong>Server Script</strong> | 
                <i class="fas fa-folder"></i> Ubicación: <code>ServerScriptService</code>
            </div>
            <pre><code>-- Código personalizado para: ${query}
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    print("Mecánica activa para " .. player.Name)
end)</code></pre>
            <button class="btn-purple copy-btn" style="margin-top:8px;"><i class="fas fa-copy"></i> Copiar Código</button>
        `;
    }

    function appendMessage(sender, content) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${sender === "user" ? "user-message" : "ai-message"}`;
        
        if (sender === "user") {
            msgDiv.innerHTML = `<div class="message-content">${content}</div><i class="fas fa-user avatar"></i>`;
        } else {
            msgDiv.innerHTML = `<i class="fas fa-robot avatar"></i><div class="message-content">${content}</div>`;
        }

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        bindCopyButtons();
    }

    // ==========================================================================
    // 6. ERROR FIXER (DEPURADOR DE CONSOLA)
    // ==========================================================================
    const fixerSubmit = document.getElementById("fixer-submit");
    const fixerInput = document.getElementById("fixer-input");
    const fixerResult = document.getElementById("fixer-result");
    const fixerContent = document.getElementById("fixer-content");

    if (fixerSubmit) {
        fixerSubmit.addEventListener("click", () => {
            const err = fixerInput.value.trim();
            if (!err) return;

            fixerResult.classList.remove("hidden");
            fixerContent.innerHTML = `
                <p><strong>Diagnóstico de ForgeNova:</strong> El error presentado suele indicar que se intentó acceder a una propiedad o instancia antes de que cargara en el mapa.</p>
                <p style="margin-top:8px;"><strong>Solución:</strong> Utiliza <code>WaitForChild()</code> en lugar de acceder directamente:</p>
                <pre><code>-- Corrección sugerida:
local parte = workspace:WaitForChild("NombreDeTuParte")</code></pre>
            `;
            bindCopyButtons();
        });
    }

    // ==========================================================================
    // 7. SELECTOR DE TEMAS DE COLOR & MODO CLARO / OSCURO
    // ==========================================================================
    const themeBtn = document.getElementById("theme-toggle-btn");
    const themeBtnText = document.getElementById("theme-btn-text");

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            const isLight = document.body.classList.contains("light-mode");
            if (themeBtnText) themeBtnText.textContent = isLight ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro";
            themeBtn.querySelector("i").className = isLight ? "fas fa-moon" : "fas fa-sun";
        });
    }

    const colorBtns = document.querySelectorAll(".color-btn");
    colorBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            colorBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const color = btn.getAttribute("data-color");
            document.body.classList.remove("theme-purple", "theme-blue", "theme-green", "theme-orange");
            document.body.classList.add(`theme-${color}`);
        });
    });
});
