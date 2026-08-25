const data = {
  character: {
    items: [
      "images/cat.png",
      "images/hero.png",
      "images/pig.png",
      "images/rabbit.png"
    ]
  },
  background: {
    items: [
      "images/sky.avif",
      "images/yellow.webp"
    ]
  },
  effect: {
    items: [
      "images/back1.png",
      "images/back2.png"
    ]
  },
  color: {
    items: [
      {
        name: "Котик",
        colors: [
          "images/cat1.png",
          "images/cat2.png",
          "images/cat3.png"
        ]
      },
      {
        name: "Герой",
        colors: [
          "images/hero1.png",
          "images/hero2.png"
        ]
      },
      {
        name: "Кролик",
        colors: [
          "images/rabbit1.png",
          "images/rabbit1.png"
        ]
      }
    ]
  },
  text: {
    items: ["№1", "RARE DROP", "###"]
  }
};

// ================================
// СОСТОЯНИЕ
// ================================
let currentStep = "character";
let currentIndex = 0;
let currentColorCharIndex = 0;

const selected = {
  character: null,
  background: null,
  effect: null,
  color: null,
  text: null
};

const stepMap = [
  { label: 'Персонаж', key: 'character', groupClass: '.layer-char-group' },
  { label: 'Фон',      key: 'background', groupClass: '.layer-bg-group' },
  { label: 'Эффект',   key: 'effect',     groupClass: '.layer-effect-group' },
  { label: 'Цвет',     key: 'color',      groupClass: '.layer-color-group' },
  { label: 'Текст',    key: 'text',       groupClass: '.layer-text-group' }
];

// ================================
// ЭЛЕМЕНТЫ
// ================================
const carousel = document.querySelector(".carousel-container");
const mainImg = document.getElementById("layer-img"); 
const sideRight = document.getElementById("side-right");

const layerBg = document.getElementById("layer-bg");
const layerChar = document.getElementById("layer-char");
const layerEffect = document.getElementById("layer-effect");
const layerColor = document.getElementById("layer-color");
const layerText = document.getElementById("layer-text");

const prevBtn = document.querySelector(".round1");
const nextBtn = document.querySelector(".round0");
const stepButtons = document.querySelectorAll(".select-character");
const selectBtn = document.getElementById("selectBtn");

// ================================
// ФУНКЦИИ
// ================================

function showStep(stepKey) {
  currentStep = stepKey;
  currentIndex = 0;
  currentColorCharIndex = 0;

  // Обновляем только карусель, слои не трогаем
  updateCarousel();
  updateStepButtons();
}

function updateCarousel() {
  const items = data[currentStep].items;
  
  if (currentStep === "text") {
    // Для текста показываем в карусели текстовое превью
    if (mainImg) {
      mainImg.src = "";
      mainImg.alt = items[currentIndex] || "";
      mainImg.style.display = "none";
    }
    // Создаем текстовое превью
    let textPreview = document.querySelector(".text-preview");
    if (!textPreview) {
      textPreview = document.createElement("div");
      textPreview.className = "text-preview";
      textPreview.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 48px;
        font-weight: 900;
        color: white;
        text-shadow: 0 2px 4px rgba(0,0,0,0.6);
        z-index: 11;
      `;
      document.querySelector(".main-card").appendChild(textPreview);
    }
    textPreview.textContent = items[currentIndex] || "";
    
    if (sideRight && items.length > 1) {
      const nextIndex = (currentIndex + 1) % items.length;
      sideRight.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:white;font-size:24px;">${items[nextIndex]}</div>`;
    }
    return;
  } else {
    // Скрываем текстовое превью если оно есть
    const textPreview = document.querySelector(".text-preview");
    if (textPreview) textPreview.remove();
    if (mainImg) mainImg.style.display = "block";
  }

  if (currentStep === "color") {
    const charItem = data.color.items[currentColorCharIndex];
    if (mainImg && charItem) {
      mainImg.src = charItem.colors[currentIndex] || "";
    }
    if (sideRight && charItem && charItem.colors.length > 1) {
      const nextIndex = (currentIndex + 1) % charItem.colors.length;
      sideRight.innerHTML = `<img src="${charItem.colors[nextIndex]}" style="width:100%; height:100%; object-fit:cover; border-radius:15px;">`;
    } else if (sideRight) {
      sideRight.innerHTML = "";
    }
    return;
  }

  // Для обычных шагов (character, background, effect)
  if (mainImg) {
    mainImg.src = items[currentIndex] || "";
  }
  
  if (sideRight && items.length > 1) {
    const nextIndex = (currentIndex + 1) % items.length;
    sideRight.innerHTML = `<img src="${items[nextIndex]}" style="width:100%; height:100%; object-fit:cover; border-radius:15px;">`;
  } else if (sideRight) {
    sideRight.innerHTML = "";
  }
}

function updateStepButtons() {
  stepButtons.forEach(btn => {
    const text = btn.textContent.trim().toLowerCase();
    let stepKey = null;

    if (text.includes("персонаж")) stepKey = "character";
    else if (text.includes("фон")) stepKey = "background";
    else if (text.includes("эффект")) stepKey = "effect";
    else if (text.includes("цвет")) stepKey = "color";
    else if (text.includes("текст")) stepKey = "text";

    if (stepKey === currentStep) {
      btn.classList.add("active-step");
    } else {
      btn.classList.remove("active-step");
    }
  });
}

function selectCurrentItem() {
  const items = data[currentStep].items;

  // Сохраняем выбранный элемент
  if (currentStep === "text") {
    selected.text = items[currentIndex];
  } else if (currentStep === "color") {
    const charItem = data.color.items[currentColorCharIndex];
    selected.color = charItem?.colors?.[currentIndex] || null;
  } else {
    selected[currentStep] = items[currentIndex];
  }

  // Обновляем слои
  updateLayers();
}

function updateLayers() {
  // Показываем только выбранные слои
  if (selected.character) {
    layerChar.src = selected.character;
    document.querySelector(".layer-char-group").classList.remove("hidden");
    document.querySelector(".layer-char-group").classList.add("visible");
  }
  
  if (selected.background) {
    layerBg.src = selected.background;
    document.querySelector(".layer-bg-group").classList.remove("hidden");
    document.querySelector(".layer-bg-group").classList.add("visible");
  }
  
  if (selected.effect) {
    layerEffect.src = selected.effect;
    document.querySelector(".layer-effect-group").classList.remove("hidden");
    document.querySelector(".layer-effect-group").classList.add("visible");
  }
  
  if (selected.color) {
    layerColor.src = selected.color;
    document.querySelector(".layer-color-group").classList.remove("hidden");
    document.querySelector(".layer-color-group").classList.add("visible");
  }
  
  if (selected.text) {
    layerText.textContent = selected.text;
    document.querySelector(".layer-text-group").classList.remove("hidden");
    document.querySelector(".layer-text-group").classList.add("visible");
  }
}

function prevItem() {
  const items = data[currentStep].items;
  
  if (currentStep === "color") {
    const charItem = data.color.items[currentColorCharIndex];
    if (!charItem || charItem.colors.length <= 1) return;
    currentIndex--;
    if (currentIndex < 0) currentIndex = charItem.colors.length - 1;
  } else {
    if (items.length <= 1) return;
    currentIndex--;
    if (currentIndex < 0) currentIndex = items.length - 1;
  }
  
  updateCarousel();
}

function nextItem() {
  const items = data[currentStep].items;
  
  if (currentStep === "color") {
    const charItem = data.color.items[currentColorCharIndex];
    if (!charItem || charItem.colors.length <= 1) return;
    currentIndex++;
    if (currentIndex >= charItem.colors.length) currentIndex = 0;
  } else {
    if (items.length <= 1) return;
    currentIndex++;
    if (currentIndex >= items.length) currentIndex = 0;
  }
  
  updateCarousel();
}

// ================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ================================

stepButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const text = btn.textContent.trim().toLowerCase();
    let stepKey = null;

    if (text.includes("персонаж")) stepKey = "character";
    else if (text.includes("фон")) stepKey = "background";
    else if (text.includes("эффект")) stepKey = "effect";
    else if (text.includes("цвет")) stepKey = "color";
    else if (text.includes("текст")) stepKey = "text";

    if (!stepKey) return;

    stepButtons.forEach(b => b.classList.remove("active-step"));
    btn.classList.add("active-step");

    showStep(stepKey);
  });
});

if (prevBtn) prevBtn.addEventListener("click", prevItem);
if (nextBtn) nextBtn.addEventListener("click", nextItem);

if (selectBtn) {
  selectBtn.addEventListener("click", selectCurrentItem);
}

// ================================
// ИНИЦИАЛИЗАЦИЯ
// ================================

const defaultBtn = Array.from(stepButtons).find(b =>
  b.textContent.trim().toLowerCase().includes("персонаж")
);
if (defaultBtn) {
  defaultBtn.click();
} else {
  showStep("character");}
