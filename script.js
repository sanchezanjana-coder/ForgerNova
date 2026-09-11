document.addEventListener("DOMContentLoaded", () => {
  const GROQ_API_KEY = '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';

  // ==========================================================================
  // 1) BASE DE DATOS BIBLIOTECA (20 scripts)
  // ==========================================================================
  const scriptLibrary = [
    {
      id: 1,
      title: "Sistema de Leaderstats & Guardado DataStore",
      category: "Server Script",
      location: "ServerScriptService > LeaderstatsService",
      description: "Tablero Monedas/Gemas/Nivel y guardado en nube con pcall y BindToClose.",
      code: `-- ServerScriptService > LeaderstatsService
local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")
local PlayerDataStore = DataStoreService:GetDataStore("PlayerData_v2")

local DEFAULT_DATA = { Coins = 100, Gems = 0, Level = 1 }

local function loadData(player)
	local playerKey = "Player_" .. player.UserId
	local success, savedData = pcall(function()
		return PlayerDataStore:GetAsync(playerKey)
	end)
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

	pcall(function()
		PlayerDataStore:SetAsync("Player_" .. player.UserId, dataToSave)
	end)
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
	for _, player in ipairs(Players:GetPlayers()) do
		saveData(player)
	end
end)`
    },
    {
      id: 2,
      title: "Teletransporte entre dos Partes (CFrame)",
      category: "Server Script",
      location: "Workspace > TeleportPart",
      description: "Mueve instantáneamente cuando el jugador toca el bloque destino, con anti-spam debounce.",
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
	if not hrp then return end

	if debounceTable[player] then return end
	debounceTable[player] = true

	hrp.CFrame = destinationPart.CFrame + Vector3.new(0, 3, 0)
	task.wait(2)

	debounceTable[player] = nil
end)`
    },
    {
      id: 3,
      title: "Bloque de Lava / Daño Instantáneo",
      category: "Server Script",
      location: "Workspace > KillBlock",
      description: "Causa daño letal al contacto con el bloque.",
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
      description: "Abre y cierra la puerta con TweenService cuando se dispara el prompt.",
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

	local tween = TweenService:Create(door, tweenInfo, { CFrame = targetCFrame })
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
      description: "Moneda animada: suma monedas y reaparece tras esperar.",
      code: `-- Workspace > CoinPart > Script
local TweenService = game:GetService("TweenService")
local coin = script.Parent

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
      description: "Restaura vida (hasta MaxHealth) con recarga y desaparece temporalmente.",
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
      description: "Impulsa al jugador hacia arriba modificando su velocidad.",
      code: `-- Workspace > JumpPad > Script
local pad = script.Parent
local JUMP_POWER = 120

pad.Touched:Connect(function(hit)
	local character = hit.Parent
	local hrp = character:FindFirstChild("HumanoidRootPart")
	if not hrp then return end

	hrp.Velocity = Vector3.new(hrp.Velocity.X, JUMP_POWER, hrp.Velocity.Z)
end)`
    },
    {
      id: 8,
      title: "Sprint / Correr al Mantener Shift Izquierdo",
      category: "LocalScript",
      location: "StarterPlayer > StarterPlayerScripts > SprintClient",
      description: "Sube WalkSpeed mientras mantienes LeftShift.",
      code: `-- StarterPlayerScripts > SprintClient (LocalScript)
local UserInputService = game:GetService("UserInputService")
local Players = game:GetService("Players")

local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")

local NORMAL_SPEED = 16
local SPRINT_SPEED = 32

local function setSprint(on)
	if on then
		humanoid.WalkSpeed = SPRINT_SPEED
	else
		humanoid.WalkSpeed = NORMAL_SPEED
	end
end

UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if gameProcessed then return end
	if input.KeyCode == Enum.KeyCode.LeftShift then
		setSprint(true)
	end
end)

UserInputService.InputEnded:Connect(function(input)
	if input.KeyCode == Enum.KeyCode.LeftShift then
		setSprint(false)
	end
end)`
    },
    {
      id: 9,
      title: "Sistema de Checkpoints (Obby Checkpoint)",
      category: "Server Script",
      location: "ServerScriptService > CheckpointManager",
      description: "Guarda etapa por jugador (IntValue Stage) y teleporta al respawn.",
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
      title: "Zona Segura (SafeZone / No-PVP con ForceField)",
      category: "Server Script",
      location: "Workspace > SafeZonePart",
      description: "Aplica ForceField al entrar y lo quita al salir.",
      code: `-- Workspace > SafeZonePart > Script
local zone = script.Parent

zone.Touched:Connect(function(hit)
	local character = hit.Parent
	if not character then return end

	local humanoid = character:FindFirstChildOfClass("Humanoid")
	if not humanoid then return end

	local forcefield = character:FindFirstChildOfClass("ForceField")
	if not forcefield then
		Instance.new("ForceField", character)
	end
end)

zone.TouchEnded:Connect(function(hit)
	local character = hit.Parent
	if not character then return end

	local forcefield = character:FindFirstChildOfClass("ForceField")
	if forcefield then forcefield:Destroy() end
end)`
    },
    {
      id: 11,
      title: "Botón GUI para Reiniciar / Morir",
      category: "LocalScript",
      location: "StarterGui > ScreenGui > KillButton",
      description: "Mata al humanoid cuando se presiona el botón.",
      code: `-- StarterGui > ScreenGui > KillButton > LocalScript
local button = script.Parent
local player = game.Players.LocalPlayer

button.MouseButton1Click:Connect(function()
	local character = player.Character
	if not character then return end

	local humanoid = character:FindFirstChildOfClass("Humanoid")
	if humanoid then
		humanoid.Health = 0
	end
end)`
    },
    {
      id: 12,
      title: "Abrir/Cerrar Panel GUI con Botón",
      category: "LocalScript",
      location: "StarterGui > ScreenGui > ToggleButton",
      description: "Alterna Visible de un Frame hijo del botón padre.",
      code: `-- StarterGui > ScreenGui > ToggleButton > LocalScript
local button = script.Parent
local frame = button.Parent:WaitForChild("Frame")

button.MouseButton1Click:Connect(function()
	frame.Visible = not frame.Visible
end)`
    },
    {
      id: 13,
      title: "Música de Fondo en Bucle (BGM)",
      category: "Server Script",
      location: "SoundService > BGM",
      description: "Crea un Sound en SoundService y lo reproduce en bucle.",
      code: `-- SoundService > Script
local soundService = game:GetService("SoundService")

local sound = Instance.new("Sound")
sound.SoundId = "rbxassetid://183784924" -- Cambia por tu ID
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
      description: "Se vuelve transparente y sin colisión tras pisar. Reaparece después.",
      code: `-- Workspace > DisappearingPart > Script
local part = script.Parent
local isStepped = false

part.Touched:Connect(function(hit)
	local character = hit.Parent
	if not character then return end

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
      title: "Sistema de Día/Noche (Lighting)",
      category: "Server Script",
      location: "ServerScriptService > DayNightCycle",
      description: "Ajusta el ciclo usando SetMinutesAfterMidnight.",
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
      title: "Tool que Entrega Dinero al Usarse",
      category: "Server Script",
      location: "StarterPack > CoinTool",
      description: "Al activar la tool, suma monedas al jugador.",
      code: `-- StarterPack > Tool > Script
local tool = script.Parent

tool.Activated:Connect(function()
	local character = tool.Parent
	local player = game.Players:GetPlayerFromCharacter(character)
	if not player then return end

	local leaderstats = player:FindFirstChild("leaderstats")
	if leaderstats and leaderstats:FindFirstChild("Coins") then
		leaderstats.Coins.Value += 5
	end
end)`
    },
    {
      id: 17,
      title: "Gamepass Handler (MarketplaceService)",
      category: "Server Script",
      location: "ServerScriptService > GamepassHandler",
      description: "Comprueba si el jugador posee un Gamepass con UserOwnsGamePassAsync.",
      code: `-- ServerScriptService > GamepassHandler
local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")

local GAMEPASS_ID = 0 -- Reemplaza con ID real

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
      title: "Mascota que Sigue (Pet AI Básica) con Lerp",
      category: "Server Script",
      location: "Workspace > PetModel",
      description: "Sigue suavemente al dueño usando Lerp sobre CFrame.",
      code: `-- Workspace > Pet > Script
local pet = script.Parent
local primaryPart = pet.PrimaryPart or pet:FindFirstChild("HumanoidRootPart")

game.Players.PlayerAdded:Connect(function(player)
	player.CharacterAdded:Connect(function(character)
		local hrp = character:WaitForChild("HumanoidRootPart")

		while task.wait(0.1) do
			if hrp and primaryPart then
				primaryPart.CFrame = primaryPart.CFrame:Lerp(
					hrp.CFrame * CFrame.new(2, 0, 2),
					0.1
				)
			end
		end
	end)
end)`
    },
    {
      id: 19,
      title: "Anti-Chat Spam por Cooldown",
      category: "Server Script",
      location: "ServerScriptService > AntiSpam",
      description: "Evita spamear chat: si manda demasiado rápido, se avisa en server.",
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
      title: "Cinta Transportadora (Conveyor Belt) con Velocity",
      category: "Server Script",
      location: "Workspace > ConveyorPart",
      description: "Aplica velocidad en la dirección de LookVector a lo que toque/sea el part (según setup).",
      code: `-- Workspace > ConveyorPart > Script
local part = script.Parent
local SPEED = 10

part.AssemblyLinearVelocity = part.CFrame.LookVector * SPEED`
    }
  ];

  // ==========================================================================
  // 2) RENDER + BUSCADOR
  // ==========================================================================
  const libraryContainer = document.getElementById("library-container");
  const searchInput = document.getElementById("library-search");

  function renderLibrary(scripts) {
    if (!libraryContainer) return;
    libraryContainer.innerHTML = "";

    if (!scripts || scripts.length === 0) {
      libraryContainer.innerHTML = `
        <p style="color: var(--text-secondary); grid-column: 1/-1;">
          No se encontraron scripts que coincidan con la búsqueda.
        </p>`;
      return;
    }

    scripts.forEach(item => {
      const card = document.createElement("div");
      card.className = "glass-card script-card";

      const loc = (item.location || "").toLowerCase();

      let primaryTag = "Ubicación";
      let primaryClass = "tag-unknown";

      if (loc.includes("workspace")) {
        primaryTag = "Workspace";
        primaryClass = "tag-workspace";
      } else if (loc.includes("serverscriptservice")) {
        primaryTag = "ServerScriptService";
        primaryClass = "tag-serverscriptservice";
      } else if (loc.includes("startergui")) {
        primaryTag = "StarterGui";
        primaryClass = "tag-startergui";
      } else if (loc.includes("starterplayerscripts")) {
        primaryTag = "StarterPlayerScripts";
        primaryClass = "tag-starterplayerscripts";
      } else if (loc.includes("soundservice")) {
        primaryTag = "SoundService";
        primaryClass = "tag-soundservice";
      }

      card.innerHTML = `
        <div class="script-card-header">
          <div class="script-card-title-row">
            <span class="script-title">${item.title}</span>
          </div>
          <span class="script-badge">${item.category}</span>
        </div>

        <p class="script-description">${item.description}</p>

        <div class="script-location">
          <i class="fas fa-folder-open"></i>
          <span class="location-label-wrap">
            <span class="tag ${primaryClass}">
              <i class="fas fa-map-marker-alt"></i> ${primaryTag}
            </span>
            <span class="location-code">
              Ubicación: <code>${item.location}</code>
            </span>
          </span>
        </div>

        <pre><code>${item.code}</code></pre>

        <button class="btn-purple copy-btn" data-copy-scope="closest-card" style="width:100%;">
          <i class="fas fa-copy"></i> Copiar Código Completo
        </button>
      `;

      libraryContainer.appendChild(card);
    });

    setupCopyButtons(libraryContainer);
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
  // 3) BOTONES DE COPIAR (COPY)
  // ==========================================================================
  function setupCopyButtons(root = document) {
    const buttons = root.querySelectorAll(".copy-btn");
    buttons.forEach(btn => {
      if (btn.dataset.bound === "1") return;
      btn.dataset.bound = "1";

      btn.addEventListener("click", async () => {
        const scope = btn.closest(".script-card") || btn.closest(".message") || btn.closest(".fixer-container");
        const codeEl = scope ? scope.querySelector("pre code") : null;

        if (!codeEl) return;

        const text = codeEl.innerText;

        try {
          await navigator.clipboard.writeText(text);

          const original = btn.innerHTML;
          btn.innerHTML = `<i class="fas fa-check"></i> ¡Copiado con Éxito!`;

          setTimeout(() => {
            btn.innerHTML = original;
          }, 2000);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();

          const original = btn.innerHTML;
          btn.innerHTML = `<i class="fas fa-check"></i> ¡Copiado con Éxito!`;
          setTimeout(() => { btn.innerHTML = original; }, 2000);
        }
      });
    });
  }

  // ==========================================================================
  // 4) NAVEGACIÓN Y MENÚ LATERAL (SIDEBAR)
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
  // 5) CHAT E INTELIGENCIA ARTIFICIAL (CONEXIÓN A GROQ)
  // ==========================================================================
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  function appendMessage(sender, contentHtml) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${sender === "user" ? "user-message" : "ai-message"}`;

    if (sender === "user") {
      msgDiv.innerHTML = `
        <div class="message-content">${contentHtml}</div>
        <i class="fas fa-user avatar"></i>
      `;
    } else {
      msgDiv.innerHTML = `
        <i class="fas fa-robot avatar"></i>
        <div class="message-content">${contentHtml}</div>
      `;
    }

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setupCopyButtons(msgDiv);
  }

  async function generateCustomLuau(query) {
    if (!GROQ_API_KEY || GROQ_API_KEY === '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') {
      return `<p style="color: #ef4444;">⚠️ No has configurado tu clave API. Abre el archivo <code>script.js</code> y reemplaza el texto <code>'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'</code> en la línea 6 por tu clave real de Groq.</p>`;
    }

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
body: JSON.stringify({
model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: "Eres un experto programador de Roblox Studio. Responde SIEMPRE generando un código funcional en Luau dentro de un bloque markdown ```lua. Muestra un breve resumen de dónde colocar el script (ServerScriptService, Workspace, etc.)."
            },
            {
              role: "user",
              content: query
            }
          ],
          temperature: 0.2
        })
      });

      const data = await response.json();

      if (data.error) {
        return `<p style="color: #ef4444;">Error de la API: ${data.error.message}</p>`;
      }

      const rawContent = data.choices[0].message.content;

      // Extraer código dentro de bloques de markdown ```lua ... ```
      const codeMatch = rawContent.match(/```(?:lua)?\n([\s\S]*?)```/);
      const extractedCode = codeMatch ? codeMatch[1].trim() : rawContent;
      
      // Limpiar texto explicativo para mostrarlo arriba del código
      const textExplanation = rawContent.replace(/```[\s\S]*?```/g, "").trim();

      return `
        <p>${textExplanation || "Código generado con éxito:"}</p>
        <pre><code>${extractedCode}</code></pre>
        <button class="btn-purple copy-btn" style="margin-top:8px; width:100%;">
          <i class="fas fa-copy"></i> Copiar Código
        </button>
      `;
    } catch (error) {
      console.error(error);
      return `
        <p style="color: #ef4444;">Error al conectar con la IA. Revisa tu clave API o tu conexión a internet.</p>
      `;
    }
  }

  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const query = chatInput.value.trim();
      if (!query) return;

      appendMessage("user", query);
      chatInput.value = "";

      appendMessage("ai", "<p>🤖 Generando código Luau...</p>");

      const responseHtml = await generateCustomLuau(query);
      
      const lastAiMessage = chatMessages.lastElementChild.querySelector(".message-content");
      if (lastAiMessage) {
        lastAiMessage.innerHTML = responseHtml;
        setupCopyButtons(chatMessages.lastElementChild);
      }
    });
  }

  // ==========================================================================
  // 6) ERROR FIXER
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
        <p><strong>Diagnóstico de ForgeNova:</strong>
          El error suele indicar que se intentó acceder a una instancia/propiedad antes de que cargara en el mapa.
        </p>

        <p style="margin-top:8px;">
          <strong>Solución:</strong> usa <code>WaitForChild()</code> y valida nulos.
        </p>

        <pre><code>-- Corrección sugerida
local parte = workspace:WaitForChild("NombreDeTuParte")</code></pre>

        <button class="btn-purple copy-btn" style="margin-top:10px; width:100%;">
          <i class="fas fa-copy"></i> Copiar Solución
        </button>
      `;

      setupCopyButtons(fixerResult);
    });
  }

  // ==========================================================================
  // 7) CONFIGURACIÓN DE TEMAS Y COLORES
  // ==========================================================================
  const themeBtn = document.getElementById("theme-toggle-btn");
  const themeBtnText = document.getElementById("theme-btn-text");

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");

      const isLight = document.body.classList.contains("light-mode");
      if (themeBtnText) {
        themeBtnText.textContent = isLight ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro";
      }

      const icon = themeBtn.querySelector("i");
      if (icon) {
        icon.className = isLight ? "fas fa-moon" : "fas fa-sun";
      }
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

  // ==========================================================================
  // 8) LANDING Y PANTALLA PRINCIPAL
  // ==========================================================================
  const landingScreen = document.getElementById("landing-screen");
  const appScreen = document.getElementById("app-screen");
  const backHomeBtn = document.getElementById("btn-back-home");
  const enterHeroBtn = document.getElementById("btn-enter-app-hero");
  const enterTopBtn = document.getElementById("btn-enter-app-top");

  function showApp() {
    if (landingScreen) landingScreen.classList.add("hidden");
    if (appScreen) appScreen.classList.add("active");
    if (appScreen) appScreen.classList.remove("hidden");
  }

  function showLanding() {
    if (landingScreen) landingScreen.classList.remove("hidden");
    if (appScreen) appScreen.classList.remove("active");
  }

  if (backHomeBtn) backHomeBtn.addEventListener("click", showLanding);
  if (enterHeroBtn) enterHeroBtn.addEventListener("click", showApp);
  if (enterTopBtn) enterTopBtn.addEventListener("click", showApp);
});
