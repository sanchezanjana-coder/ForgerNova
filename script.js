document.addEventListener("DOMContentLoaded", () => {
    
    // NAVEGACIÓN PORTADA -> APP
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

    // NAVEGACIÓN SIDEBAR
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

    // CHAT IA - GENERADOR DINÁMICO MEJORADO FORGENOVA
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
                const response = processAIQuery(query);
                appendMessage("ai", response);
            }, 400);
        });
    }

    function processAIQuery(query) {
        const lower = query.toLowerCase();
        let code = "";
        let text = "";

        // SALUDOS O INTRODUCCIÓN
        if (lower === "hola" || lower === "buenas" || lower.includes("quien eres")) {
            return `¡Hola! Soy la IA de <strong>ForgeNova</strong>. Pídeme un script indicando lo que quieres lograr en Roblox Studio (ej: <em>"Hazme un script para ganar monedas al tocar un bloque"</em>, <em>"script de super salto"</em> o <em>"teleportar al tocar"</em>).`;
        }

        // SISTEMAS DE SALUD Y DAÑO
        if (lower.includes("vida") || lower.includes("daño") || lower.includes("quitar vida") || lower.includes("lava") || lower.includes("matar")) {
            text = "Aquí tienes un script de daño/eliminar personaje configurado para Luau:";
            code = `-- Creado por ForgeNova
local part = script.Parent
local damageAmount = 25

part.Touched:Connect(function(hit)
    local character = hit.Parent
    local humanoid = character:FindFirstChildOfClass("Humanoid")
    
    if humanoid then
        humanoid.Health = math.max(0, humanoid.Health - damageAmount)
    end
end)`;
        } 
        // MONEDAS / LEADERSTATS / DINERO
        else if (lower.includes("moneda") || lower.includes("dinero") || lower.includes("leaderstat") || lower.includes("coin") || lower.includes("cash")) {
            text = "Aquí tienes el sistema completo de Leaderstats para gestionar monedas o dinero:";
            code = `-- Creado por ForgeNova
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 0
    coins.Parent = leaderstats
end)`;
        } 
        // VELOCIDAD O SALTO
        else if (lower.includes("velocidad") || lower.includes("speed") || lower.includes("salto") || lower.includes("jump")) {
            text = "Script para alterar la velocidad y potencia de salto del personaje:";
            code = `-- Creado por ForgeNova
local pad = script.Parent

pad.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChildOfClass("Humanoid")
    if humanoid then
        humanoid.WalkSpeed = 32
        humanoid.JumpPower = 100
        task.wait(5)
        humanoid.WalkSpeed = 16
        humanoid.JumpPower = 50
    end
end)`;
        } 
        // TELEPORT / TELETRANSPORTE
        else if (lower.includes("teleport") || lower.includes("teletranspor") || lower.includes("tp")) {
            text = "Script de teletransporte a unas coordenadas específicas:";
            code = `-- Creado por ForgeNova
local portal = script.Parent
local destination = Vector3.new(0, 50, 0) -- Cambia las coordenadas aquí

portal.Touched:Connect(function(hit)
    local root = hit.Parent:FindFirstChild("HumanoidRootPart")
    if root then
        root.CFrame = CFrame.new(destination)
    end
end)`;
        }
        // PUERTA / TRANSPARENCIA
        else if (lower.includes("puerta") || lower.includes("transparen") || lower.includes("abrir")) {
            text = "Script para hacer una puerta interactiva temporal:";
            code = `-- Creado por ForgeNova
local door = script.Parent
local debounce = false

door.Touched:Connect(function(hit)
    if hit.Parent:FindFirstChildOfClass("Humanoid") and not debounce then
        debounce = true
        door.Transparency = 0.8
        door.CanCollide = false
        task.wait(3)
        door.Transparency = 0
        door.CanCollide = true
        debounce = false
    end
end)`;
        }
        // GENERADOR DINÁMICO POR DEFECTO PARA OTRAS PETICIONES
        else {
            const cleanQuery = query.replace(/[^\w\s]/gi, "");
            text = `Aquí tienes el script adaptado para <strong>"${cleanQuery}"</strong>:`;
            code = `-- Script generado dinámicamente por ForgeNova
-- Requerimiento: ${cleanQuery}

local Services = {
    Players = game:GetService("Players"),
    TweenService = game:GetService("TweenService")
}

local currentPart = script.Parent

local function onEventTriggered(player)
    print("Ejecutando acción de ForgeNova para: " .. tostring(player))
    -- TODO: Agrega aquí tu lógica personalizada
end

currentPart.Touched:Connect(function(hit)
    local player = Services.Players:GetPlayerFromCharacter(hit.Parent)
    if player then
        onEventTriggered(player)
    end
end)`;
        }

        return `${text}<br><br><pre><code>${code}</code></pre><button class="btn-outline copy-btn"><i class="fas fa-copy"></i> Copiar Código</button>`;
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

    // ERROR FIXER
    const fixerSubmit = document.getElementById("fixer-submit");
    const fixerInput = document.getElementById("fixer-input");
    const fixerResult = document.getElementById("fixer-result");
    const fixerContent = document.getElementById("fixer-content");

    if (fixerSubmit) {
        fixerSubmit.addEventListener("click", () => {
            const err = fixerInput.value.trim();
            if (!err) return;

            fixerResult.classList.remove("hidden");
            if (err.includes("attempt to index nil with 'Humanoid'")) {
                fixerContent.innerHTML = `
                    <p><strong>Problema:</strong> Se intentó acceder a <code>Humanoid</code> cuando el objeto tocado no pertenecía a un personaje.</p>
                    <p style="margin-top:8px;"><strong>Solución ForgeNova:</strong> Comprueba la existencia previa:</p>
                    <pre><code>local hum = hit.Parent:FindFirstChildOfClass("Humanoid")
if hum then
    hum.Health = hum.Health - 10
end</code></pre>`;
            } else {
                fixerContent.innerHTML = `
                    <p><strong>Diagnóstico de ForgeNova:</strong> Revisa la sintaxis, verifica que no tengas variables en <code>nil</code> o que falten cierres tipo <code>end</code> en tus funciones.</p>`;
            }
        });
    }

    // BOTONES DE COPIAR
    function bindCopyButtons() {
        document.querySelectorAll(".copy-btn").forEach(btn => {
            btn.onclick = () => {
                const parent = btn.closest(".glass-card") || btn.closest(".message-content");
                const code = parent ? parent.querySelector("pre code") : null;
                if (code) {
                    navigator.clipboard.writeText(code.innerText);
                    btn.innerHTML = `<i class="fas fa-check"></i> ¡Copiado!`;
                    setTimeout(() => { btn.innerHTML = `<i class="fas fa-copy"></i> Copiar Código`; }, 2000);
                }
            };
        });
    }
    bindCopyButtons();

    // MODO CLARO / OSCURO
    const themeBtn = document.getElementById("theme-toggle-btn");
    const themeBtnText = document.getElementById("theme-btn-text");

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            const isLight = document.body.classList.contains("light-mode");
            themeBtnText.textContent = isLight ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro";
            themeBtn.querySelector("i").className = isLight ? "fas fa-moon" : "fas fa-sun";
        });
    }

    // OPCIONES DE COLOR
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
