document.addEventListener("DOMContentLoaded", () => {
    
    // -------------------------------------------------------------
    // NAVEGACIÓN PORTADA -> APP DASHBOARD
    // -------------------------------------------------------------
    const landingScreen = document.getElementById("landing-screen");
    const appScreen = document.getElementById("app-screen");
    const btnEnterTop = document.getElementById("btn-enter-app-top");
    const btnEnterHero = document.getElementById("btn-enter-app-hero");
    const btnBackHome = document.getElementById("btn-back-home");

    function goToApp() {
        if (landingScreen && appScreen) {
            landingScreen.classList.add("hidden");
            landingScreen.classList.remove("active");
            appScreen.classList.remove("hidden");
            appScreen.classList.add("active");
        }
    }

    function goToLanding() {
        if (landingScreen && appScreen) {
            appScreen.classList.add("hidden");
            appScreen.classList.remove("active");
            landingScreen.classList.remove("hidden");
            landingScreen.classList.add("active");
        }
    }

    if (btnEnterTop) btnEnterTop.addEventListener("click", goToApp);
    if (btnEnterHero) btnEnterHero.addEventListener("click", goToApp);
    if (btnBackHome) btnBackHome.addEventListener("click", goToLanding);

    // -------------------------------------------------------------
    // NAVEGACIÓN SIDEBAR
    // -------------------------------------------------------------
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

    // -------------------------------------------------------------
    // GENERADOR DE CÓDIGO LUAU AVANZADO (IA DE FORGENOVA)
    // -------------------------------------------------------------
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
                const response = generateLuauCode(query);
                appendMessage("ai", response);
            }, 300);
        });
    }

    function generateLuauCode(query) {
        const q = query.toLowerCase();
        let explanation = "";
        let codeType = "Script"; // "Script" o "LocalScript"
        let placement = "Workspace";
        let code = "";

        // CASO 1: SALUDOS / INFO
        if (q === "hola" || q === "buenas" || q.includes("quien eres")) {
            return `¡Hola! Soy la IA generadora de código Luau de <strong>ForgeNova</strong>.<br>Dime qué mecánica necesitas para tu juego de Roblox Studio y te crearé el script completo (ej: <em>"crea un script para que al tocar un bloque te dé 10 monedas"</em>, <em>"hacer un botón de GUI para abrir una tienda"</em> o <em>"un bloque que mate al tocarlo"</em>).`;
        }

        // CASO 2: BOTÓN / GUI / INTERFAZ
        if (q.includes("gui") || q.includes("interfaz") || q.includes("botón") || q.includes("boton") || q.includes("pantalla") || q.includes("frame")) {
            codeType = "LocalScript";
            placement = "StarterGui > ScreenGui > TuBoton";

            if (q.includes("muer") || q.includes("matar") || q.includes("morir") || q.includes("vida") || q.includes("reset")) {
                explanation = "Este script va dentro de un botón de la interfaz. Al hacer clic, restablece la salud del personaje a 0.";
                code = `-- Colocar como LocalScript dentro del TextButton / ImageButton
local button = script.Parent
local Players = game:GetService("Players")
local player = Players.LocalPlayer

button.MouseButton1Click:Connect(function()
    local character = player.Character
    if character then
        local humanoid = character:FindFirstChildOfClass("Humanoid")
        if humanoid then
            humanoid.Health = 0
        end
    end
end)`;
            } else if (q.includes("abrir") || q.includes("cerrar") || q.includes("tienda") || q.includes("menu") || q.includes("menú")) {
                explanation = "Script local para abrir o cerrar un panel (Frame) mediante un botón de la interfaz:";
                code = `-- Colocar como LocalScript dentro del TextButton
local button = script.Parent
local frameToToggle = button.Parent:FindFirstChild("Frame") -- Asegúrate de que el Frame esté al mismo nivel

button.MouseButton1Click:Connect(function()
    if frameToToggle then
        frameToToggle.Visible = not frameToToggle.Visible
    end
end)`;
            } else {
                explanation = "Estructura de evento para interacción de botones en la interfaz:";
                code = `-- Colocar como LocalScript dentro del TextButton
local button = script.Parent

button.MouseButton1Click:Connect(function()
    print("El jugador interactuó con la interfaz de usuario")
    -- Agrega tus acciones visuales o de audio locales aquí
end)`;
            }
        }

        // CASO 3: LEADERSTATS / DINERO / MONEDAS / PUNTOS
        else if (q.includes("moneda") || q.includes("dinero") || q.includes("leaderstat") || q.includes("puntos") || q.includes("cash") || q.includes("coins")) {
            codeType = "Script (Server)";
            placement = "ServerScriptService";

            if (q.includes("tocar") || q.includes("bloque") || q.includes("dar") || q.includes("recoger")) {
                explanation = "Este sistema crea las Leaderstats del jugador al unirse y otorga monedas al tocar un bloque específico con tiempo de recarga (debounce):";
                code = `-- 1. Script de creación de datos (Ponlo en ServerScriptService)
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 0
    coins.Parent = leaderstats
end)

---------------------------------------------------------
-- 2. Script para la parte que otorga monedas (Ponlo dentro de la Part en Workspace)
local part = script.Parent
local debounceTable = {}

part.Touched:Connect(function(hit)
    local player = Players:GetPlayerFromCharacter(hit.Parent)
    if player and not debounceTable[player] then
        debounceTable[player] = true
        
        local leaderstats = player:FindFirstChild("leaderstats")
        if leaderstats then
            local coins = leaderstats:FindFirstChild("Coins")
            if coins then
                coins.Value = coins.Value + 10
            end
        end
        
        task.wait(2) -- Tiempo de recarga
        debounceTable[player] = nil
    end
end)`;
            } else {
                explanation = "Sistema de almacenamiento de estadísticas (Leaderstats) base para gestionar dinero o variables del jugador:";
                code = `-- Colocar como Script en ServerScriptService
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 0
    coins.Parent = leaderstats

    local level = Instance.new("IntValue")
    level.Name = "Nivel"
    level.Value = 1
    level.Parent = leaderstats
end)`;
            }
        }

        // CASO 4: MATAR / LAVA / DAÑO AL TOCAR PARTE
        else if (q.includes("lava") || q.includes("quitar vida") || q.includes("muer") || q.includes("matar") || q.includes("daño") || q.includes("dano")) {
            codeType = "Script (Server)";
            placement = "Workspace > TuParte";
            explanation = "Script para infligir daño o eliminar al jugador al colisionar con una parte física en el mapa:";
            code = `-- Colocar como Script dentro de la Part en Workspace
local part = script.Parent
local damageAmount = 100 -- Cambia a 25 para daño progresivo

part.Touched:Connect(function(hit)
    local character = hit.Parent
    local humanoid = character:FindFirstChildOfClass("Humanoid")
    
    if humanoid and humanoid.Health > 0 then
        humanoid.Health = math.max(0, humanoid.Health - damageAmount)
    end
end)`;
        }

        // CASO 5: SALTO / VELOCIDAD / POWERUPS
        else if (q.includes("velocidad") || q.includes("speed") || q.includes("salto") || q.includes("jump") || q.includes("correr")) {
            codeType = "Script (Server)";
            placement = "Workspace > TuParte";
            explanation = "Script para potenciar la velocidad o la altura de salto de un personaje temporalmente al tocar un bloque:";
            code = `-- Colocar como Script dentro de la Part impulsora
local pad = script.Parent
local isCooldowned = false

pad.Touched:Connect(function(hit)
    local character = hit.Parent
    local humanoid = character:FindFirstChildOfClass("Humanoid")
    
    if humanoid and not isCooldowned then
        isCooldowned = true
        
        local originalSpeed = humanoid.WalkSpeed
        local originalJump = humanoid.JumpPower
        
        humanoid.WalkSpeed = 50
        humanoid.JumpPower = 120
        
        task.wait(5) -- Duración del efecto
        
        humanoid.WalkSpeed = originalSpeed
        humanoid.JumpPower = originalJump
        isCooldowned = false
    end
end)`;
        }

        // CASO 6: TELETRANSPORTE / PUERTAS
        else if (q.includes("teleport") || q.includes("tp") || q.includes("puerta") || q.includes("transparente")) {
            codeType = "Script (Server)";
            placement = "Workspace > TuParte";
            explanation = "Script de teletransporte exacto al colisionar con un portal o punto de origen:";
            code = `-- Colocar como Script dentro del Portal en Workspace
local portal = script.Parent
local destination = Vector3.new(0, 50, 0) -- Reemplaza con tus coordenadas objetivos

portal.Touched:Connect(function(hit)
    local character = hit.Parent
    local rootPart = character:FindFirstChild("HumanoidRootPart")
    
    if rootPart then
        rootPart.CFrame = CFrame.new(destination)
    end
end)`;
        }

        // CASO 7: CONSTRUCTOR DINÁMICO INTELIGENTE
        else {
            codeType = "Script (Server)";
            placement = "Workspace";
            const cleanText = query.replace(/[^\w\s]/gi, "");
            explanation = `Código Luau diseñado específicamente para la instrucción: <strong>"${cleanText}"</strong>`;
            code = `-- Generated by ForgeNova Engine
-- Objetivo: ${cleanText}

local Services = {
    Players = game:GetService("Players"),
    TweenService = game:GetService("TweenService"),
    Debris = game:GetService("Debris")
}

local part = script.Parent

local function processAction(character)
    local humanoid = character:FindFirstChildOfClass("Humanoid")
    local player = Services.Players:GetPlayerFromCharacter(character)
    
    if humanoid and player then
        print("ForgeNova ejecutó la acción para: " .. player.Name)
        -- Implementación del evento
    end
end

if part:IsA("BasePart") then
    part.Touched:Connect(function(hit)
        if hit.Parent then
            processAction(hit.Parent)
        end
    end)
end`;
        }

        return `
            <p>${explanation}</p>
            <div class="code-meta-info" style="margin: 8px 0; font-size: 0.85rem; color: #a78bfa;">
                <i class="fas fa-file-code"></i> Tipo: <strong>${codeType}</strong> | 
                <i class="fas fa-folder"></i> Ubicación: <code>${placement}</code>
            </div>
            <pre><code>${code}</code></pre>
            <button class="btn-outline copy-btn"><i class="fas fa-copy"></i> Copiar Código Luau</button>
        `;
    }

    function appendMessage(sender, content) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", sender === "user" ? "user-message" : "ai-message");

        if (sender === "user") {
            msgDiv.innerHTML = `<div class="message-content">${content}</div><i class="fas fa-user avatar"></i>`;
        } else {
            msgDiv.innerHTML = `<i class="fas fa-robot avatar"></i><div class="message-content">${content}</div>`;
        }

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        bindCopyButtons();
    }

    // -------------------------------------------------------------
    // FUNCIONALIDAD COPIAR CÓDIGO
    // -------------------------------------------------------------
    function bindCopyButtons() {
        document.querySelectorAll(".copy-btn").forEach(btn => {
            btn.onclick = () => {
                const parent = btn.closest(".glass-card") || btn.closest(".message-content");
                const code = parent ? parent.querySelector("pre code") : null;
                if (code) {
                    navigator.clipboard.writeText(code.innerText);
                    btn.innerHTML = `<i class="fas fa-check"></i> ¡Copiado!`;
                    setTimeout(() => { btn.innerHTML = `<i class="fas fa-copy"></i> Copiar Código Luau`; }, 2000);
                }
            };
        });
    }
    bindCopyButtons();

    // -------------------------------------------------------------
    // FIXER DE ERRORES DE ROBLOX STUDIO
    // -------------------------------------------------------------
    const fixerSubmit = document.getElementById("fixer-submit");
    const fixerInput = document.getElementById("fixer-input");
    const fixerResult = document.getElementById("fixer-result");
    const fixerContent = document.getElementById("fixer-content");

    if (fixerSubmit) {
        fixerSubmit.addEventListener("click", () => {
            const err = fixerInput.value.trim();
            if (!err) return;

            fixerResult.classList.remove("hidden");
            if (err.includes("attempt to index nil with")) {
                fixerContent.innerHTML = `
                    <p><strong>Causa:</strong> Estás intentando acceder a una propiedad o hijo de una variable que vale <code>nil</code> (no existe).</p>
                    <p><strong>Solución ForgeNova:</strong> Utiliza <code>FindFirstChild</code> antes de acceder:</p>
                    <pre><code>local hum = character:FindFirstChildOfClass("Humanoid")
if hum then
    hum.Health = 0
end</code></pre>`;
            } else {
                fixerContent.innerHTML = `
                    <p><strong>Diagnóstico de ForgeNova:</strong> Verifica que la ruta de instancias en el Explorer sea exacta y que los nombres coincidan respetando mayúsculas y minúsculas.</p>`;
            }
            bindCopyButtons();
        });
    }

    // -------------------------------------------------------------
    // MODO CLARO / OSCURO & SELECCIÓN DE TEMAS DE COLOR (VERDE, AZUL, ETC)
    // -------------------------------------------------------------
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
