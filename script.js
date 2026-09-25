/* ============================================================
   SIMULADOR DE PREPARAÇÃO AUTOMOTIVA
   Projeto acadêmico - 3º DS
   Aluno: Arthur Moreira Ribeiro
   ============================================================

   TECNOLOGIAS:
   - JavaScript puro
   - Chart.js
   - jsPDF

   IMPORTANTE:
   Os valores de desempenho são estimativas acadêmicas.
   Não representam garantia de desempenho real.
============================================================ */

/* ============================================================
   1. DADOS DOS VEÍCULOS
============================================================ */

const cars = {
    gti: {
        nome: "Volkswagen Golf GTI",
        hp: 230,
        torque: 35,
        aceleracao: 6.4,
        vmax: 240,
        consumo: 11,
        confiabilidade: 92
    },

    civicSi: {
        nome: "Honda Civic Si",
        hp: 208,
        torque: 26.5,
        aceleracao: 7.2,
        vmax: 230,
        consumo: 10.5,
        confiabilidade: 94
    },

    gol: {
        nome: "Volkswagen Gol",
        hp: 104,
        torque: 15.6,
        aceleracao: 10.8,
        vmax: 180,
        consumo: 12.5,
        confiabilidade: 88
    },

    bmw320i: {
        nome: "BMW 320i",
        hp: 184,
        torque: 30.6,
        aceleracao: 7.3,
        vmax: 235,
        consumo: 11.2,
        confiabilidade: 87
    },

    c200: {
        nome: "Mercedes-Benz C200",
        hp: 204,
        torque: 32.6,
        aceleracao: 7.3,
        vmax: 246,
        consumo: 10.8,
        confiabilidade: 89
    },

    chevette: {
        nome: "Chevrolet Chevette",
        hp: 82,
        torque: 12.8,
        aceleracao: 14.5,
        vmax: 160,
        consumo: 10,
        confiabilidade: 84
    },

    lancerEvolution: {
        nome: "Mitsubishi Lancer Evolution",
        hp: 291,
        torque: 41.5,
        aceleracao: 5.4,
        vmax: 250,
        consumo: 8.5,
        confiabilidade: 86
    },

    audiA3: {
        nome: "Audi A3",
        hp: 150,
        torque: 25.5,
        aceleracao: 8.4,
        vmax: 215,
        consumo: 12,
        confiabilidade: 88
    }
};


/* ============================================================
   2. DADOS DAS MODIFICAÇÕES
============================================================ */

const modifications = {

    turbo: {
        id: "turbo",
        nome: "Turbo",
        icone: "⚡",
        descricao:
            "Sistema de sobrealimentação destinado ao aumento significativo da potência e do torque.",

        preco: 8000,

        hp: 60,
        torque: 10,

        aceleracaoPercentual: -0.16,
        vmax: 20,

        consumo: -1.8,
        confiabilidade: -10,

        risco: 3,

        beneficioSeguranca: 0,
        impactoDesempenho: 9,

        objetivoPeso: {
            economia: 1,
            desempenho: 5,
            esportivo: 5
        }
    },

    supercharger: {
        id: "supercharger",
        nome: "Supercharger",
        icone: "🔧",
        descricao:
            "Sistema de sobrealimentação mecânica que aumenta a pressão de admissão do motor.",

        preco: 9500,

        hp: 50,
        torque: 8,

        aceleracaoPercentual: -0.13,
        vmax: 17,

        consumo: -1.5,
        confiabilidade: -8,

        risco: 3,

        beneficioSeguranca: 0,
        impactoDesempenho: 8,

        objetivoPeso: {
            economia: 1,
            desempenho: 4,
            esportivo: 4
        }
    },

    remap: {
        id: "remap",
        nome: "Remap de ECU",
        icone: "💻",
        descricao:
            "Recalibração dos parâmetros da unidade de gerenciamento eletrônico do motor.",

        preco: 2200,

        hp: 20,
        torque: 3,

        aceleracaoPercentual: -0.06,
        vmax: 8,

        consumo: -0.4,
        confiabilidade: -3,

        risco: 2,

        beneficioSeguranca: 0,
        impactoDesempenho: 5,

        objetivoPeso: {
            economia: 2,
            desempenho: 5,
            esportivo: 4
        }
    },

    brakes: {
        id: "brakes",
        nome: "Upgrade de Freios",
        icone: "🛑",
        descricao:
            "Atualização do sistema de frenagem para melhorar controle e capacidade de desaceleração.",

        preco: 3500,

        hp: 0,
        torque: 0,

        aceleracaoPercentual: 0,
        vmax: 0,

        consumo: 0,
        confiabilidade: 2,

        risco: 1,

        beneficioSeguranca: 10,
        impactoDesempenho: 2,

        objetivoPeso: {
            economia: 1,
            desempenho: 2,
            esportivo: 5
        }
    },

    suspension: {
        id: "suspension",
        nome: "Suspensão Esportiva",
        icone: "🏁",
        descricao:
            "Conjunto voltado à melhoria da estabilidade, controle de carroceria e comportamento dinâmico.",

        preco: 4500,

        hp: 0,
        torque: 0,

        aceleracaoPercentual: -0.01,
        vmax: 2,

        consumo: -0.1,
        confiabilidade: 1,

        risco: 1,

        beneficioSeguranca: 8,
        impactoDesempenho: 3,

        objetivoPeso: {
            economia: 1,
            desempenho: 3,
            esportivo: 5
        }
    }
};


/* ============================================================
   3. ESTADO GLOBAL DO SISTEMA
============================================================ */

const state = {

    vehicleId: "gti",

    budget: 0,

    objective: "desempenho",

    selectedModifications: [],

    preparation: null,

    scores: {
        desempenho: 0,
        seguranca: 0,
        economia: 0,
        custoBeneficio: 0
    },

    charts: {
        power: null,
        torque: null,
        performance: null,
        evaluation: null
    },

    automaticPreparation: null
};


/* ============================================================
   4. FUNÇÕES AUXILIARES
============================================================ */

function $(id) {
    return document.getElementById(id);
}


function safeNumber(value, fallback = 0) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return fallback;
    }

    return number;
}


function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}


function round(value, decimals = 1) {
    const factor = Math.pow(10, decimals);

    return Math.round(value * factor) / factor;
}


function formatNumber(value, decimals = 1) {
    return safeNumber(value).toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}


function formatCurrency(value) {
    return safeNumber(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


function formatPercent(value) {
    return `${formatNumber(value, 1)}%`;
}


function sanitizeFileName(text) {
    return String(text)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
}


function getCurrentCar() {
    return cars[state.vehicleId] || cars.gti;
}


function getSelectedModifications() {
    return state.selectedModifications
        .map(id => modifications[id])
        .filter(Boolean);
}


function hasModification(id) {
    return state.selectedModifications.includes(id);
}


function setText(id, value) {
    const element = $(id);

    if (element) {
        element.textContent = value;
    }
}


function setHTML(id, value) {
    const element = $(id);

    if (element) {
        element.innerHTML = value;
    }
}


/* ============================================================
   5. TOAST / NOTIFICAÇÕES
============================================================ */

function showToast(message, type = "info") {

    let container = $("toastContainer");

    if (!container) {
        container = document.createElement("div");

        container.id = "toastContainer";
        container.className = "toast-container";

        container.setAttribute("aria-live", "polite");
        container.setAttribute("aria-atomic", "true");

        document.body.appendChild(container);
    }

    const toast = document.createElement("div");

    toast.className = `toast toast-${type}`;

    const icons = {
        success: "✓",
        warning: "⚠",
        error: "✕",
        info: "ℹ"
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button
            type="button"
            class="toast-close"
            aria-label="Fechar notificação"
        >×</button>
    `;

    const closeButton = toast.querySelector(".toast-close");

    closeButton.addEventListener("click", () => {
        removeToast(toast);
    });

    container.appendChild(toast);

    setTimeout(() => {
        removeToast(toast);
    }, 4500);
}


function removeToast(toast) {

    if (!toast) {
        return;
    }

    toast.classList.add("toast-removing");

    setTimeout(() => {
        toast.remove();
    }, 300);
}


/* ============================================================
   6. BUILD DOS CARDS DE MODIFICAÇÃO
============================================================ */

function buildModificationCards() {

    const container =
        $("modificationsContainer") ||
        $("modificationsGrid") ||
        $("modificationCards");

    if (!container) {
        console.warn(
            "Container de modificações não encontrado."
        );

        return;
    }

    container.innerHTML = "";

    Object.values(modifications).forEach(mod => {

        const card = document.createElement("article");

        card.className = "modification-card";

        card.dataset.modification = mod.id;

        card.tabIndex = 0;

        card.setAttribute(
            "role",
            "button"
        );

        card.setAttribute(
            "aria-pressed",
            "false"
        );

        card.innerHTML = `
            <div class="modification-header">

                <div class="modification-icon">
                    ${mod.icone}
                </div>

                <div>
                    <h3>${mod.nome}</h3>

                    <span class="modification-price">
                        ${formatCurrency(mod.preco)}
                    </span>
                </div>

                <span
                    class="modification-check"
                    aria-hidden="true"
                >
                    ✓
                </span>

            </div>

            <p class="modification-description">
                ${mod.descricao}
            </p>

            <div class="modification-details">

                <div>
                    <span>Potência</span>
                    <strong>
                        ${mod.hp > 0 ? `+${mod.hp} HP` : "—"}
                    </strong>
                </div>

                <div>
                    <span>Torque</span>
                    <strong>
                        ${mod.torque > 0 ? `+${formatNumber(mod.torque)} kgfm` : "—"}
                    </strong>
                </div>

                <div>
                    <span>0–100 km/h</span>
                    <strong>
                        ${
                            mod.aceleracaoPercentual < 0
                                ? `${Math.abs(mod.aceleracaoPercentual * 100).toFixed(0)}%`
                                : "—"
                        }
                    </strong>
                </div>

                <div>
                    <span>Velocidade</span>
                    <strong>
                        ${
                            mod.vmax > 0
                                ? `+${mod.vmax} km/h`
                                : "—"
                        }
                    </strong>
                </div>

                <div>
                    <span>Consumo</span>
                    <strong>
                        ${
                            mod.consumo < 0
                                ? `${mod.consumo} km/l`
                                : "—"
                        }
                    </strong>
                </div>

                <div>
                    <span>Risco</span>
                    <strong>
                        ${getRiskLabel(mod.risco)}
                    </strong>
                </div>

            </div>

            <div class="modification-footer">

                <span>
                    Segurança:
                    ${
                        mod.beneficioSeguranca > 0
                            ? `+${mod.beneficioSeguranca}`
                            : "Neutro"
                    }
                </span>

                <span>
                    Impacto:
                    ${mod.impactoDesempenho}/10
                </span>

            </div>
        `;

        card.addEventListener("click", () => {
            toggleModification(mod.id);
        });

        card.addEventListener("keydown", event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                toggleModification(mod.id);
            }
        });

        container.appendChild(card);
    });

    updateModificationVisualState();
}


function toggleModification(id) {

    if (!modifications[id]) {
        return;
    }

    const index =
        state.selectedModifications.indexOf(id);

    if (index >= 0) {

        state.selectedModifications.splice(index, 1);

        showToast(
            `${modifications[id].nome} removido da preparação.`,
            "info"
        );

    } else {

        state.selectedModifications.push(id);

        showToast(
            `${modifications[id].nome} adicionado à preparação.`,
            "success"
        );
    }

    updateModificationVisualState();

    updateSimulation();
}


function updateModificationVisualState() {

    document
        .querySelectorAll(".modification-card")
        .forEach(card => {

            const id = card.dataset.modification;

            const selected =
                state.selectedModifications.includes(id);

            card.classList.toggle(
                "selected",
                selected
            );

            card.setAttribute(
                "aria-pressed",
                String(selected)
            );
        });
}


/* ============================================================
   7. RENDERIZAÇÃO DO VEÍCULO
============================================================ */

function renderVehicle() {

    const car = getCurrentCar();

    setText(
        "vehicleName",
        car.nome
    );

    setText(
        "originalPower",
        `${formatNumber(car.hp, 0)} HP`
    );

    setText(
        "originalTorque",
        `${formatNumber(car.torque)} kgfm`
    );

    setText(
        "originalAcceleration",
        `${formatNumber(car.aceleracao)} s`
    );

    setText(
        "originalVmax",
        `${formatNumber(car.vmax, 0)} km/h`
    );

    setText(
        "originalConsumption",
        `${formatNumber(car.consumo)} km/l`
    );

    setText(
        "originalReliability",
        `${formatNumber(car.confiabilidade, 0)}%`
    );

    setText(
        "vehicleCardName",
        car.nome
    );

    setText(
        "vehicleCardPower",
        `${formatNumber(car.hp, 0)} HP`
    );

    setText(
        "vehicleCardTorque",
        `${formatNumber(car.torque)} kgfm`
    );

    setText(
        "vehicleCardAcceleration",
        `${formatNumber(car.aceleracao)} s`
    );

    setText(
        "vehicleCardVmax",
        `${formatNumber(car.vmax, 0)} km/h`
    );

    setText(
        "vehicleCardConsumption",
        `${formatNumber(car.consumo)} km/l`
    );

    setText(
        "vehicleCardReliability",
        `${formatNumber(car.confiabilidade, 0)}%`
    );
}


/* ============================================================
   8. CÁLCULO CENTRAL DA PREPARAÇÃO
============================================================ */

function calculatePreparation() {

    const car = getCurrentCar();

    const selected =
        getSelectedModifications();

    let hp = car.hp;

    let torque = car.torque;

    let acceleration = car.aceleracao;

    let vmax = car.vmax;

    let consumption = car.consumo;

    let reliability = car.confiabilidade;

    selected.forEach(mod => {

        hp += mod.hp;

        torque += mod.torque;

        acceleration *=
            1 + mod.aceleracaoPercentual;

        vmax += mod.vmax;

        consumption += mod.consumo;

        reliability += mod.confiabilidade;
    });


    /*
        Limites de segurança matemática.

        Evitamos valores impossíveis ou negativos.
    */

    hp = Math.max(hp, 1);

    torque = Math.max(torque, 0.1);

    acceleration = Math.max(acceleration, 1);

    vmax = Math.max(vmax, 1);

    consumption = Math.max(consumption, 0.1);

    reliability =
        clamp(reliability, 0, 100);


    const cost =
        selected.reduce(
            (total, mod) => total + mod.preco,
            0
        );


    const powerGain =
        hp - car.hp;

    const torqueGain =
        torque - car.torque;

    const accelerationDifference =
        acceleration - car.aceleracao;

    const vmaxDifference =
        vmax - car.vmax;

    const consumptionDifference =
        consumption - car.consumo;

    const reliabilityDifference =
        reliability - car.confiabilidade;


    const risk =
        calculateSafetyRisk();


    const preparation = {

        original: {
            hp: car.hp,
            torque: car.torque,
            acceleration: car.aceleracao,
            vmax: car.vmax,
            consumption: car.consumo,
            reliability: car.confiabilidade
        },

        prepared: {
            hp: round(hp, 1),
            torque: round(torque, 1),
            acceleration: round(acceleration, 2),
            vmax: round(vmax, 1),
            consumption: round(consumption, 1),
            reliability: round(reliability, 1)
        },

        differences: {
            hp: round(powerGain, 1),
            torque: round(torqueGain, 1),
            acceleration: round(accelerationDifference, 2),
            vmax: round(vmaxDifference, 1),
            consumption: round(consumptionDifference, 1),
            reliability: round(reliabilityDifference, 1)
        },

        cost,

        risk
    };

    state.preparation = preparation;

    return preparation;
}


/* ============================================================
   9. ORÇAMENTO
============================================================ */

function calculateBudget() {

    const budgetInput =
        $("budget");

    let budget = 0;

    if (budgetInput) {

        let raw =
            budgetInput.value;

        /*
            Aceita valores digitados como:
            15000
            15000,50
            R$ 15.000,00
        */

        raw = String(raw)
            .replace(/[R$\s]/g, "")
            .replace(/\./g, "")
            .replace(",", ".");

        budget = Number(raw);
    }

    if (!Number.isFinite(budget)) {
        budget = 0;
    }

    budget = Math.max(0, budget);

    state.budget = budget;

    const preparation =
        state.preparation ||
        calculatePreparation();

    const cost =
        preparation.cost;

    const remaining =
        budget - cost;

    const percentage =
        budget > 0
            ? (cost / budget) * 100
            : cost > 0
                ? 100
                : 0;

    const exceeded =
        cost > budget && budget > 0;

    const invalid =
        budget <= 0;


    return {

        budget,

        cost,

        remaining,

        percentage,

        exceeded,

        invalid
    };
}


/* ============================================================
   10. RENDERIZAÇÃO DO ORÇAMENTO
============================================================ */

function renderBudget() {

    const budgetData =
        calculateBudget();

    setText(
        "budgetValue",
        formatCurrency(budgetData.budget)
    );

    setText(
        "preparationCost",
        formatCurrency(budgetData.cost)
    );

    setText(
        "remainingBudget",
        formatCurrency(
            budgetData.remaining
        )
    );

    setText(
        "budgetPercentage",
        formatPercent(
            budgetData.percentage
        )
    );


    const progress =
        $("budgetProgress");

    if (progress) {

        const visualPercentage =
            clamp(
                budgetData.percentage,
                0,
                100
            );

        progress.style.width =
            `${visualPercentage}%`;

        progress.classList.toggle(
            "danger",
            budgetData.exceeded
        );

        progress.classList.toggle(
            "warning",
            !budgetData.exceeded &&
            budgetData.percentage >= 80
        );
    }


    const status =
        $("budgetStatus");

    if (status) {

        status.classList.remove(
            "success",
            "warning",
            "danger"
        );

        if (budgetData.invalid) {

            status.textContent =
                "Informe um orçamento válido.";

            status.classList.add(
                "warning"
            );

        } else if (budgetData.exceeded) {

            status.textContent =
                `⚠ Orçamento excedido em ${formatCurrency(
                    Math.abs(budgetData.remaining)
                )}`;

            status.classList.add(
                "danger"
            );

        } else {

            status.textContent =
                "✓ Preparação dentro do orçamento.";

            status.classList.add(
                "success"
            );
        }
    }


    const error =
        $("budgetError");

    if (error) {

        if (budgetData.invalid) {

            error.textContent =
                "Informe um orçamento maior que zero.";

            error.hidden = false;

        } else {

            error.textContent = "";

            error.hidden = true;
        }
    }
}


/* ============================================================
   11. DETALHAMENTO DOS CUSTOS
============================================================ */

function renderCostDetails() {

    const container =
        $("costDetails");

    if (!container) {
        return;
    }

    const selected =
        getSelectedModifications();

    if (selected.length === 0) {

        container.innerHTML = `
            <tr>
                <td colspan="2">
                    Nenhuma modificação selecionada.
                </td>
            </tr>
        `;

        return;
    }


    container.innerHTML =
        selected.map(mod => `
            <tr>
                <td>${mod.nome}</td>
                <td>${formatCurrency(mod.preco)}</td>
            </tr>
        `).join("");


    const total =
        selected.reduce(
            (sum, mod) =>
                sum + mod.preco,
            0
        );

    container.innerHTML += `
        <tr class="total-row">
            <td><strong>Total</strong></td>
            <td>
                <strong>${formatCurrency(total)}</strong>
            </td>
        </tr>
    `;
}


/* ============================================================
   12. COMPARAÇÃO ORIGINAL X PREPARADO
============================================================ */

function renderComparison() {

    const preparation =
        state.preparation ||
        calculatePreparation();

    const rows = [

        {
            id: "comparisonPower",
            original:
                `${formatNumber(
                    preparation.original.hp,
                    0
                )} HP`,
            prepared:
                `${formatNumber(
                    preparation.prepared.hp,
                    0
                )} HP`,
            difference:
                preparation.differences.hp,
            suffix: " HP",
            positiveWhenGreater: true
        },

        {
            id: "comparisonTorque",
            original:
                `${formatNumber(
                    preparation.original.torque
                )} kgfm`,
            prepared:
                `${formatNumber(
                    preparation.prepared.torque
                )} kgfm`,
            difference:
                preparation.differences.torque,
            suffix: " kgfm",
            positiveWhenGreater: true
        },

        {
            id: "comparisonAcceleration",
            original:
                `${formatNumber(
                    preparation.original.acceleration,
                    2
                )} s`,
            prepared:
                `${formatNumber(
                    preparation.prepared.acceleration,
                    2
                )} s`,
            difference:
                preparation.differences.acceleration,
            suffix: " s",
            positiveWhenGreater: false
        },

        {
            id: "comparisonVmax",
            original:
                `${formatNumber(
                    preparation.original.vmax,
                    0
                )} km/h`,
            prepared:
                `${formatNumber(
                    preparation.prepared.vmax,
                    0
                )} km/h`,
            difference:
                preparation.differences.vmax,
            suffix: " km/h",
            positiveWhenGreater: true
        },

        {
            id: "comparisonConsumption",
            original:
                `${formatNumber(
                    preparation.original.consumption
                )} km/l`,
            prepared:
                `${formatNumber(
                    preparation.prepared.consumption
                )} km/l`,
            difference:
                preparation.differences.consumption,
            suffix: " km/l",
            positiveWhenGreater: true
        },

        {
            id: "comparisonReliability",
            original:
                `${formatNumber(
                    preparation.original.reliability,
                    0
                )}%`,
            prepared:
                `${formatNumber(
                    preparation.prepared.reliability,
                    0
                )}%`,
            difference:
                preparation.differences.reliability,
            suffix: "%",
            positiveWhenGreater: true
        }
    ];


    rows.forEach(row => {

        const element =
            $(row.id);

        if (!element) {
            return;
        }

        const difference =
            row.difference;

        let text;

        if (Math.abs(difference) < 0.01) {

            text =
                "Neutro";

        } else {

            const sign =
                difference > 0
                    ? "+"
                    : "";

            text =
                `${sign}${formatNumber(
                    difference,
                    Math.abs(difference) < 10
                        ? 2
                        : 1
                )}${row.suffix}`;
        }

        element.textContent =
            text;

        element.classList.remove(
            "positive",
            "negative",
            "neutral"
        );


        /*
            Para 0–100:
            valor menor = melhoria.

            Para os demais:
            valor maior = melhoria.
        */

        const isImprovement =
            row.positiveWhenGreater
                ? difference > 0
                : difference < 0;


        if (Math.abs(difference) < 0.01) {

            element.classList.add(
                "neutral"
            );

        } else if (isImprovement) {

            element.classList.add(
                "positive"
            );

        } else {

            element.classList.add(
                "negative"
            );
        }
    });


    setText(
        "preparedPower",
        `${formatNumber(
            preparation.prepared.hp,
            0
        )} HP`
    );

    setText(
        "preparedTorque",
        `${formatNumber(
            preparation.prepared.torque
        )} kgfm`
    );

    setText(
        "preparedAcceleration",
        `${formatNumber(
            preparation.prepared.acceleration,
            2
        )} s`
    );

    setText(
        "preparedVmax",
        `${formatNumber(
            preparation.prepared.vmax,
            0
        )} km/h`
    );

    setText(
        "preparedConsumption",
        `${formatNumber(
            preparation.prepared.consumption
        )} km/l`
    );

    setText(
        "preparedReliability",
        `${formatNumber(
            preparation.prepared.reliability,
            0
        )}%`
    );
}


/* ============================================================
   13. CÁLCULO DO RISCO
============================================================ */

function calculateSafetyRisk() {

    const selected =
        getSelectedModifications();

    if (selected.length === 0) {
        return {
            score: 0,
            level: "Baixo",
            description:
                "Nenhuma modificação de maior impacto foi selecionada."
        };
    }

    let riskScore =
        selected.reduce(
            (total, mod) =>
                total + mod.risco,
            0
        );


    const hasPowerModification =
        selected.some(
            mod =>
                mod.hp >= 20
        );

    const hasBrakes =
        hasModification("brakes");

    const hasSuspension =
        hasModification("suspension");


    if (
        hasPowerModification &&
        !hasBrakes
    ) {
        riskScore += 2;
    }

    if (
        hasPowerModification &&
        !hasSuspension
    ) {
        riskScore += 1;
    }


    let level;

    if (riskScore <= 3) {

        level = "Baixo";

    } else if (riskScore <= 7) {

        level = "Médio";

    } else {

        level = "Alto";
    }


    let description;

    if (level === "Baixo") {

        description =
            "Preparação com alterações de menor impacto. Ainda é importante realizar instalação, manutenção e inspeção adequadas.";

    } else if (level === "Médio") {

        description =
            "A preparação envolve alterações que exigem maior atenção à manutenção, compatibilidade dos componentes e segurança.";

    } else {

        description =
            "A preparação envolve alterações significativas no conjunto mecânico. Recomenda-se avaliação profissional, componentes compatíveis e atenção especial à segurança.";
    }


    return {
        score: riskScore,
        level,
        description
    };
}


/* ============================================================
   14. SEGURANÇA
============================================================ */

function calculateSafety() {

    const preparation =
        state.preparation ||
        calculatePreparation();

    const risk =
        calculateSafetyRisk();

    const selected =
        getSelectedModifications();

    let safetyScore =
        preparation.prepared.reliability;


    /*
        Freios e suspensão recebem peso positivo.

        O sistema parte da confiabilidade do veículo
        e adiciona benefícios de segurança.
    */

    selected.forEach(mod => {

        safetyScore +=
            mod.beneficioSeguranca * 1.5;
    });


    if (
        preparation.prepared.hp >
        preparation.original.hp * 1.2 &&
        !hasModification("brakes")
    ) {

        safetyScore -= 12;
    }


    if (
        preparation.prepared.hp >
        preparation.original.hp * 1.2 &&
        !hasModification("suspension")
    ) {

        safetyScore -= 6;
    }


    if (risk.level === "Médio") {
        safetyScore -= 5;
    }

    if (risk.level === "Alto") {
        safetyScore -= 12;
    }


    safetyScore =
        clamp(
            safetyScore,
            0,
            100
        );


    return {
        score: round(safetyScore, 1),
        risk
    };
}


function renderSafety() {

    const safety =
        calculateSafety();

    const risk =
        safety.risk;


    setText(
        "riskLevel",
        risk.level
    );

    setText(
        "riskDescription",
        risk.description
    );

    setText(
        "safetyScore",
        `${formatNumber(
            safety.score,
            0
        )}/100`
    );


    const indicator =
        $("riskIndicator");

    if (indicator) {

        indicator.classList.remove(
            "low",
            "medium",
            "high"
        );

        if (risk.level === "Baixo") {
            indicator.classList.add("low");
        } else if (risk.level === "Médio") {
            indicator.classList.add("medium");
        } else {
            indicator.classList.add("high");
        }
    }


    const riskBar =
        $("riskProgress");

    if (riskBar) {

        const percentage =
            risk.level === "Baixo"
                ? 30
                : risk.level === "Médio"
                    ? 60
                    : 90;

        riskBar.style.width =
            `${percentage}%`;
    }
}


/* ============================================================
   15. CÁLCULO DAS PONTUAÇÕES
============================================================ */

function calculateScores() {

    const preparation =
        state.preparation ||
        calculatePreparation();

    const budget =
        calculateBudget();

    const safety =
        calculateSafety();

    const selected =
        getSelectedModifications();


    /* --------------------------------------------------------
       DESEMPENHO

       Considera:
       - ganho de potência;
       - ganho de torque;
       - redução do 0–100;
       - aumento da velocidade máxima.
    -------------------------------------------------------- */

    const hpGainPercent =
        preparation.original.hp > 0
            ? (
                preparation.differences.hp /
                preparation.original.hp
            ) * 100
            : 0;

    const torqueGainPercent =
        preparation.original.torque > 0
            ? (
                preparation.differences.torque /
                preparation.original.torque
            ) * 100
            : 0;

    const accelerationImprovement =
        preparation.original.acceleration > 0
            ? (
                (
                    preparation.original.acceleration -
                    preparation.prepared.acceleration
                ) /
                preparation.original.acceleration
            ) * 100
            : 0;

    const vmaxGainPercent =
        preparation.original.vmax > 0
            ? (
                preparation.differences.vmax /
                preparation.original.vmax
            ) * 100
            : 0;


    const performanceScore =
        clamp(
            5 +
            hpGainPercent * 0.08 +
            torqueGainPercent * 0.06 +
            accelerationImprovement * 0.05 +
            vmaxGainPercent * 0.04,
            0,
            10
        );


    /* --------------------------------------------------------
       SEGURANÇA
    -------------------------------------------------------- */

    let safetyScore =
        safety.score / 10;


    /*
        Upgrade de freios e suspensão
        possuem influência adicional.
    */

    if (hasModification("brakes")) {
        safetyScore += 0.5;
    }

    if (hasModification("suspension")) {
        safetyScore += 0.3;
    }

    safetyScore =
        clamp(
            safetyScore,
            0,
            10
        );


    /* --------------------------------------------------------
       ECONOMIA

       Considera:
       - consumo;
       - confiabilidade;
       - custo.

       Quanto menor o consumo, melhor.
       A lógica usa o consumo original como referência.
    -------------------------------------------------------- */

    const consumptionVariation =
        preparation.original.consumption > 0
            ? (
                preparation.prepared.consumption /
                preparation.original.consumption
            )
            : 1;


    let economyScore =
        5 +
        (
            consumptionVariation - 1
        ) * 10;


    economyScore +=
        (
            preparation.prepared.reliability -
            preparation.original.reliability
        ) * 0.04;


    if (
        budget.budget > 0 &&
        budget.cost > 0
    ) {

        const costPercentage =
            budget.cost /
            budget.budget;

        economyScore -=
            costPercentage * 1.5;
    }


    economyScore =
        clamp(
            economyScore,
            0,
            10
        );


    /* --------------------------------------------------------
       CUSTO-BENEFÍCIO

       Considera:
       - ganho de desempenho;
       - custo;
       - utilização do orçamento;
       - quantidade de modificações.

       Orçamento zero é tratado explicitamente.
    -------------------------------------------------------- */

    let costBenefitScore = 0;


    if (budget.budget <= 0) {

        /*
            Sem orçamento informado,
            não existe como avaliar corretamente
            o custo-benefício financeiro.
        */

        costBenefitScore =
            selected.length > 0
                ? 3
                : 0;

    } else {

        const performanceGain =
            Math.max(
                0,
                performanceScore - 5
            );

        const costRatio =
            budget.cost /
            budget.budget;

        const modificationEfficiency =
            selected.length > 0
                ? performanceGain /
                    selected.length
                : 0;

        costBenefitScore =
            5 +
            performanceGain * 0.8 +
            modificationEfficiency * 0.6 -
            costRatio * 3;


        if (
            budget.cost > budget.budget
        ) {
            costBenefitScore -= 2;
        }
    }


    costBenefitScore =
        clamp(
            costBenefitScore,
            0,
            10
        );


    state.scores = {

        desempenho:
            round(performanceScore, 1),

        seguranca:
            round(safetyScore, 1),

        economia:
            round(economyScore, 1),

        custoBeneficio:
            round(costBenefitScore, 1)
    };


    return state.scores;
}


/* ============================================================
   16. RENDERIZAÇÃO DAS PONTUAÇÕES
============================================================ */

function renderScores() {

    const scores =
        calculateScores();


    setText(
        "scorePerformance",
        `${formatNumber(
            scores.desempenho
        )}/10`
    );

    setText(
        "scoreSafety",
        `${formatNumber(
            scores.seguranca
        )}/10`
    );

    setText(
        "scoreEconomy",
        `${formatNumber(
            scores.economia
        )}/10`
    );

    setText(
        "scoreCostBenefit",
        `${formatNumber(
            scores.custoBeneficio
        )}/10`
    );


    updateScoreBar(
        "performanceScoreBar",
        scores.desempenho
    );

    updateScoreBar(
        "safetyScoreBar",
        scores.seguranca
    );

    updateScoreBar(
        "economyScoreBar",
        scores.economia
    );

    updateScoreBar(
        "costBenefitScoreBar",
        scores.custoBeneficio
    );
}


function updateScoreBar(id, score) {

    const bar = $(id);

    if (!bar) {
        return;
    }

    const percentage =
        clamp(
            score * 10,
            0,
            100
        );

    bar.style.width =
        `${percentage}%`;

    bar.setAttribute(
        "aria-valuenow",
        String(score)
    );
}


/* ============================================================
   17. RECOMENDAÇÕES
============================================================ */

function generateRecommendations() {

    const recommendations = [];

    const preparation =
        state.preparation ||
        calculatePreparation();

    const budget =
        calculateBudget();

    const selected =
        getSelectedModifications();


    if (hasModification("turbo")) {

        recommendations.push({
            type: "warning",
            title: "Turbo selecionado",
            text:
                "O aumento de potência pode exigir atenção especial aos freios, suspensão, arrefecimento e demais componentes."
        });
    }


    if (hasModification("supercharger")) {

        recommendations.push({
            type: "warning",
            title: "Supercharger selecionado",
            text:
                "Considere verificar o sistema de arrefecimento e a capacidade dos componentes do motor."
        });
    }


    if (hasModification("remap")) {

        recommendations.push({
            type: "info",
            title: "Remap de ECU",
            text:
                "O remapeamento pode alterar o funcionamento do motor e pode afetar condições de garantia. Consulte documentação e profissionais especializados."
        });
    }


    if (
        preparation.prepared.hp >
        preparation.original.hp * 1.20
    ) {

        recommendations.push({
            type: "warning",
            title: "Aumento expressivo de potência",
            text:
                "Considere reforçar componentes relacionados à segurança, frenagem, suspensão e controle do veículo."
        });
    }


    if (
        preparation.prepared.hp >
        preparation.original.hp * 1.10 &&
        !hasModification("brakes")
    ) {

        recommendations.push({
            type: "warning",
            title: "Freios",
            text:
                "Considere adicionar um upgrade de freios para acompanhar alterações significativas de desempenho."
        });
    }


    if (
        preparation.prepared.hp >
        preparation.original.hp * 1.10 &&
        !hasModification("suspension")
    ) {

        recommendations.push({
            type: "info",
            title: "Suspensão",
            text:
                "Considere verificar ou atualizar a suspensão para acompanhar alterações de desempenho."
        });
    }


    if (budget.exceeded) {

        recommendations.push({
            type: "danger",
            title: "Orçamento excedido",
            text:
                "Sua configuração atual ultrapassa o orçamento informado. Revise as modificações selecionadas."
        });
    }


    if (selected.length === 0) {

        recommendations.push({
            type: "info",
            title: "Configuração original",
            text:
                "Selecione modificações para visualizar alterações de desempenho, custo e segurança."
        });
    }


    if (
        state.objective === "economia" &&
        preparation.prepared.consumption <
        preparation.original.consumption
    ) {

        recommendations.push({
            type: "success",
            title: "Objetivo de economia",
            text:
                "A configuração atual prioriza uma abordagem de menor impacto e preservação de consumo."
        });
    }


    if (
        state.objective === "desempenho" &&
        selected.length === 0
    ) {

        recommendations.push({
            type: "info",
            title: "Objetivo de desempenho",
            text:
                "Para explorar o objetivo de desempenho, considere modificações compatíveis com seu orçamento."
        });
    }


    if (
        state.objective === "esportivo" &&
        (
            !hasModification("brakes") ||
            !hasModification("suspension")
        )
    ) {

        recommendations.push({
            type: "warning",
            title: "Uso esportivo",
            text:
                "Para uma preparação de uso esportivo, avalie especialmente freios e suspensão."
        });
    }


    return recommendations;
}


function renderRecommendations() {

    const container =
        $("recommendationsContainer") ||
        $("recommendationsList");

    if (!container) {
        return;
    }

    const recommendations =
        generateRecommendations();


    container.innerHTML =
        recommendations.map(rec => `

            <article class="
                recommendation
                recommendation-${rec.type}
            ">

                <div class="recommendation-icon">

                    ${
                        rec.type === "warning"
                            ? "⚠"
                            : rec.type === "danger"
                                ? "!"
                                : rec.type === "success"
                                    ? "✓"
                                    : "ℹ"
                    }

                </div>

                <div>

                    <h4>
                        ${rec.title}
                    </h4>

                    <p>
                        ${rec.text}
                    </p>

                </div>

            </article>

        `).join("");
}


/* ============================================================
   18. LEGALIZAÇÃO
============================================================ */

function generateLegalizationWarnings() {

    const warnings = [];


    warnings.push({
        type: "general",
        text:
            "Algumas modificações podem exigir regularização, inspeção ou documentação específica conforme a legislação aplicável. Verifique as exigências atuais dos órgãos competentes antes de realizar alterações no veículo."
    });


    if (hasModification("turbo")) {

        warnings.push({
            type: "warning",
            text:
                "Alterações no sistema de motorização podem estar sujeitas a requisitos de regularização."
        });
    }


    if (hasModification("supercharger")) {

        warnings.push({
            type: "warning",
            text:
                "Alterações no sistema de motorização podem exigir avaliação de conformidade e documentação específica."
        });
    }


    if (hasModification("remap")) {

        warnings.push({
            type: "warning",
            text:
                "Alterações no gerenciamento eletrônico podem afetar emissões, garantia e conformidade do veículo."
        });
    }


    if (hasModification("brakes")) {

        warnings.push({
            type: "info",
            text:
                "Alterações no sistema de frenagem devem ser realizadas com componentes compatíveis e instalação adequada."
        });
    }


    if (hasModification("suspension")) {

        warnings.push({
            type: "info",
            text:
                "Alterações na suspensão podem modificar características do veículo e devem ser avaliadas conforme os requisitos aplicáveis."
        });
    }


    return warnings;
}


function renderLegalization() {

    const container =
        $("legalizationContainer") ||
        $("legalizationWarnings");

    if (!container) {
        return;
    }

    const warnings =
        generateLegalizationWarnings();


    container.innerHTML =
        warnings.map(item => `

            <div class="
                legal-warning
                legal-${item.type}
            ">

                <span
                    class="legal-icon"
                    aria-hidden="true"
                >
                    ${
                        item.type === "warning"
                            ? "⚠"
                            : item.type === "info"
                                ? "ℹ"
                                : "!"
                    }
                </span>

                <p>
                    ${item.text}
                </p>

            </div>

        `).join("");
}


/* ============================================================
   19. GRÁFICOS
============================================================ */

function destroyChart(chartName) {

    if (
        state.charts[chartName] &&
        typeof state.charts[chartName].destroy === "function"
    ) {

        state.charts[chartName].destroy();

        state.charts[chartName] =
            null;
    }
}


function getChartCanvas(id) {

    const canvas = $(id);

    if (!canvas) {
        return null;
    }

    return canvas;
}


function renderCharts() {

    /*
        Chart.js é opcional para evitar que o restante
        do sistema quebre caso a biblioteca não esteja carregada.
    */

    if (typeof Chart === "undefined") {

        console.warn(
            "Chart.js não está carregado."
        );

        return;
    }


    const preparation =
        state.preparation ||
        calculatePreparation();

    const scores =
        state.scores ||
        calculateScores();


    /* --------------------------------------------------------
       GRÁFICO 1 - POTÊNCIA
    -------------------------------------------------------- */

    const powerCanvas =
        getChartCanvas("powerChart");

    if (powerCanvas) {

        destroyChart("power");

        state.charts.power =
            new Chart(
                powerCanvas.getContext("2d"),
                {
                    type: "bar",

                    data: {

                        labels: [
                            "Original",
                            "Preparado"
                        ],

                        datasets: [{
                            label: "Potência (HP)",

                            data: [
                                preparation.original.hp,
                                preparation.prepared.hp
                            ],

                            backgroundColor: [
                                "#64748b",
                                "#22c55e"
                            ],

                            borderRadius: 8
                        }]
                    },

                    options: getChartOptions(
                        "Potência (HP)"
                    )
                }
            );
    }


    /* --------------------------------------------------------
       GRÁFICO 2 - TORQUE
    -------------------------------------------------------- */

    const torqueCanvas =
        getChartCanvas("torqueChart");

    if (torqueCanvas) {

        destroyChart("torque");

        state.charts.torque =
            new Chart(
                torqueCanvas.getContext("2d"),
                {
                    type: "bar",

                    data: {

                        labels: [
                            "Original",
                            "Preparado"
                        ],

                        datasets: [{
                            label: "Torque (kgfm)",

                            data: [
                                preparation.original.torque,
                                preparation.prepared.torque
                            ],

                            backgroundColor: [
                                "#64748b",
                                "#3b82f6"
                            ],

                            borderRadius: 8
                        }]
                    },

                    options: getChartOptions(
                        "Torque (kgfm)"
                    )
                }
            );
    }


    /* --------------------------------------------------------
       GRÁFICO 3 - DESEMPENHO
    -------------------------------------------------------- */

    const performanceCanvas =
        getChartCanvas(
            "performanceChart"
        );

    if (performanceCanvas) {

        destroyChart("performance");

        state.charts.performance =
            new Chart(
                performanceCanvas.getContext("2d"),
                {
                    type: "bar",

                    data: {

                        labels: [
                            "0–100 (s)",
                            "Velocidade (km/h)"
                        ],

                        datasets: [

                            {
                                label: "Original",

                                data: [
                                    preparation.original.acceleration,
                                    preparation.original.vmax
                                ],

                                backgroundColor:
                                    "#64748b",

                                borderRadius: 8
                            },

                            {
                                label: "Preparado",

                                data: [
                                    preparation.prepared.acceleration,
                                    preparation.prepared.vmax
                                ],

                                backgroundColor:
                                    "#f97316",

                                borderRadius: 8
                            }
                        ]
                    },

                    options: getChartOptions(
                        "Desempenho"
                    )
                }
            );
    }


    /* --------------------------------------------------------
       GRÁFICO 4 - AVALIAÇÃO
    -------------------------------------------------------- */

    const evaluationCanvas =
        getChartCanvas(
            "evaluationChart"
        );

    if (evaluationCanvas) {

        destroyChart("evaluation");

        state.charts.evaluation =
            new Chart(
                evaluationCanvas.getContext("2d"),
                {
                    type: "radar",

                    data: {

                        labels: [
                            "Desempenho",
                            "Segurança",
                            "Economia",
                            "Custo-benefício"
                        ],

                        datasets: [{
                            label:
                                "Avaliação da preparação",

                            data: [
                                scores.desempenho,
                                scores.seguranca,
                                scores.economia,
                                scores.custoBeneficio
                            ],

                            backgroundColor:
                                "rgba(34, 197, 94, 0.18)",

                            borderColor:
                                "#22c55e",

                            pointBackgroundColor:
                                "#22c55e",

                            pointBorderColor:
                                "#ffffff",

                            pointHoverBackgroundColor:
                                "#ffffff",

                            pointHoverBorderColor:
                                "#22c55e"
                        }]
                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        scales: {

                            r: {

                                min: 0,

                                max: 10,

                                ticks: {
                                    stepSize: 2
                                }
                            }
                        },

                        plugins: {

                            legend: {
                                display: true
                            }
                        }
                    }
                }
            );
    }
}


function getChartOptions(title) {

    return {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                display: true
            },

            title: {
                display: false,
                text: title
            }
        },

        scales: {

            y: {
                beginAtZero: true
            }
        },

        animation: {
            duration: 500
        }
    };
}


/* ============================================================
   20. RESUMO FINAL
============================================================ */

function renderSummary() {

    const car =
        getCurrentCar();

    const preparation =
        state.preparation ||
        calculatePreparation();

    const budget =
        calculateBudget();

    const scores =
        calculateScores();

    const risk =
        calculateSafetyRisk();


    setText(
        "summaryVehicle",
        car.nome
    );

    setText(
        "summaryObjective",
        getObjectiveLabel(
            state.objective
        )
    );

    setText(
        "summaryBudget",
        formatCurrency(
            budget.budget
        )
    );

    setText(
        "summaryCost",
        formatCurrency(
            preparation.cost
        )
    );

    setText(
        "summaryRemaining",
        formatCurrency(
            budget.remaining
        )
    );


    setText(
        "summaryOriginalPower",
        `${formatNumber(
            preparation.original.hp,
            0
        )} HP`
    );

    setText(
        "summaryPreparedPower",
        `${formatNumber(
            preparation.prepared.hp,
            0
        )} HP`
    );

    setText(
        "summaryPowerGain",
        `${
            preparation.differences.hp >= 0
                ? "+"
                : ""
        }${formatNumber(
            preparation.differences.hp,
            0
        )} HP`
    );


    setText(
        "summaryOriginalTorque",
        `${formatNumber(
            preparation.original.torque
        )} kgfm`
    );

    setText(
        "summaryPreparedTorque",
        `${formatNumber(
            preparation.prepared.torque
        )} kgfm`
    );

    setText(
        "summaryTorqueGain",
        `${
            preparation.differences.torque >= 0
                ? "+"
                : ""
        }${formatNumber(
            preparation.differences.torque
        )} kgfm`
    );


    setText(
        "summaryOriginalAcceleration",
        `${formatNumber(
            preparation.original.acceleration,
            2
        )} s`
    );

    setText(
        "summaryPreparedAcceleration",
        `${formatNumber(
            preparation.prepared.acceleration,
            2
        )} s`
    );


    setText(
        "summaryVmax",
        `${formatNumber(
            preparation.prepared.vmax,
            0
        )} km/h`
    );

    setText(
        "summaryConsumption",
        `${formatNumber(
            preparation.prepared.consumption
        )} km/l`
    );

    setText(
        "summaryReliability",
        `${formatNumber(
            preparation.prepared.reliability,
            0
        )}%`
    );

    setText(
        "summaryRisk",
        risk.level
    );


    setText(
        "summaryScores",
        `${formatNumber(
            scores.desempenho
        )} / ${formatNumber(
            scores.seguranca
        )} / ${formatNumber(
            scores.economia
        )} / ${formatNumber(
            scores.custoBeneficio
        )}`
    );


    const modificationsContainer =
        $("summaryModifications");

    if (modificationsContainer) {

        const selected =
            getSelectedModifications();

        if (selected.length === 0) {

            modificationsContainer.innerHTML =
                "<li>Nenhuma modificação selecionada.</li>";

        } else {

            modificationsContainer.innerHTML =
                selected
                    .map(
                        mod =>
                            `<li>✓ ${mod.nome}</li>`
                    )
                    .join("");
        }
    }
}


/* ============================================================
   21. OBJETIVOS
============================================================ */

function getObjectiveLabel(objective) {

    const labels = {

        economia:
            "Economia",

        desempenho:
            "Desempenho",

        esportivo:
            "Uso Esportivo"
    };

    return labels[objective] ||
        "Desempenho";
}


/* ============================================================
   22. PREPARAÇÃO AUTOMÁTICA
============================================================ */

function generateAutomaticPreparation() {

    const budget =
        calculateBudget();

    if (budget.budget <= 0) {

        showToast(
            "Informe um orçamento válido antes de gerar a preparação automática.",
            "warning"
        );

        const input =
            $("budget");

        if (input) {
            input.focus();
        }

        return;
    }


    /*
        A preparação automática começa do zero.
    */

    state.selectedModifications = [];


    const objective =
        state.objective;


    /*
        Cada objetivo recebe uma ordem de prioridade.
    */

    let priority;

    if (objective === "economia") {

        priority = [
            "remap",
            "suspension",
            "brakes",
            "turbo",
            "supercharger"
        ];

    } else if (objective === "esportivo") {

        priority = [
            "brakes",
            "suspension",
            "remap",
            "turbo",
            "supercharger"
        ];

    } else {

        priority = [
            "remap",
            "turbo",
            "brakes",
            "suspension",
            "supercharger"
        ];
    }


    /*
        Calcula uma pontuação de prioridade.

        Quanto maior o peso do objetivo,
        mais cedo a modificação será avaliada.
    */

    const sorted =
        priority
            .map((id, index) => {

                const mod =
                    modifications[id];

                return {
                    id,

                    priority:
                        mod.objetivoPeso[
                            objective
                        ] || 0,

                    originalIndex:
                        index
                };
            })
            .sort(
                (a, b) => {

                    if (
                        b.priority !==
                        a.priority
                    ) {

                        return (
                            b.priority -
                            a.priority
                        );
                    }

                    return (
                        a.originalIndex -
                        b.originalIndex
                    );
                }
            );


    /*
        Estratégia:

        1. Tenta adicionar modificações sem exceder orçamento.
        2. Para desempenho/esportivo, procura preservar
           modificações de segurança.
        3. Para economia, evita adicionar modificações
           de grande impacto se elas consumirem muito
           do orçamento.
    */

    let currentCost = 0;


    sorted.forEach(item => {

        const mod =
            modifications[item.id];

        const newCost =
            currentCost +
            mod.preco;


        if (newCost > budget.budget) {
            return;
        }


        if (
            objective === "economia" &&
            (
                item.id === "turbo" ||
                item.id === "supercharger"
            )
        ) {

            /*
                Evita sobrealimentação automática
                para o objetivo de economia.
            */

            return;
        }


        state.selectedModifications.push(
            item.id
        );

        currentCost =
            newCost;
    });


    /*
        Para preparação esportiva/desempenho,
        tenta garantir freios e suspensão
        quando houver orçamento.
    */

    if (
        objective !== "economia"
    ) {

        const safetyMods = [
            "brakes",
            "suspension"
        ];

        safetyMods.forEach(id => {

            if (
                hasModification(id)
            ) {
                return;
            }

            const mod =
                modifications[id];

            if (
                currentCost +
                mod.preco <=
                budget.budget
            ) {

                state.selectedModifications.push(
                    id
                );

                currentCost +=
                    mod.preco;
            }
        });
    }


    /*
        Caso nenhuma modificação caiba,
        mantém a configuração original.
    */

    updateModificationVisualState();

    updateSimulation();


    state.automaticPreparation = {

        objective,

        budget:
            budget.budget,

        modifications:
            [...state.selectedModifications],

        cost:
            currentCost
    };


    renderAutomaticPreparationMessage();


    showToast(
        "Preparação automática gerada com sucesso.",
        "success"
    );
}


function renderAutomaticPreparationMessage() {

    const container =
        $("automaticResult") ||
        $("automaticPreparationResult");

    if (!container) {
        return;
    }


    const selected =
        getSelectedModifications();

    const objective =
        getObjectiveLabel(
            state.objective
        );

    const budget =
        state.budget;


    let reason;

    if (state.objective === "economia") {

        reason =
            "Foram priorizadas alterações de menor impacto e melhor preservação de consumo, respeitando o orçamento.";

    } else if (state.objective === "esportivo") {

        reason =
            "Foram priorizados desempenho, controle do veículo, freios e suspensão dentro do orçamento informado.";

    } else {

        reason =
            "Foram priorizadas alterações capazes de aumentar desempenho e torque, buscando manter a configuração dentro do orçamento.";
    }


    container.innerHTML = `

        <div class="automatic-result-card">

            <h3>
                Preparação automática gerada!
            </h3>

            <p>
                <strong>Objetivo:</strong>
                ${objective}
            </p>

            <p>
                <strong>Orçamento:</strong>
                ${formatCurrency(budget)}
            </p>

            <h4>
                Modificações selecionadas:
            </h4>

            ${
                selected.length
                    ? `
                        <ul>
                            ${
                                selected
                                    .map(
                                        mod =>
                                            `<li>✓ ${mod.nome}</li>`
                                    )
                                    .join("")
                            }
                        </ul>
                    `
                    : `
                        <p>
                            Nenhuma modificação coube
                            no orçamento informado.
                        </p>
                    `
            }

            <p>
                ${reason}
            </p>

        </div>
    `;
}


/* ============================================================
   23. ATUALIZAÇÃO GERAL DA SIMULAÇÃO
============================================================ */

function updateSimulation() {

    /*
        Ordem importante:

        1. Calcula preparação.
        2. Calcula orçamento.
        3. Renderiza resultados.
        4. Calcula pontuação.
        5. Atualiza gráficos.
    */

    calculatePreparation();

    calculateBudget();

    calculateScores();

    renderComparison();

    renderBudget();

    renderCostDetails();

    renderSafety();

    renderRecommendations();

    renderLegalization();

    renderScores();

    renderSummary();

    renderCharts();
}


/* ============================================================
   24. VALIDAÇÃO DO ORÇAMENTO
============================================================ */

function validateBudgetInput(showMessage = true) {

    const input =
        $("budget");

    if (!input) {
        return false;
    }


    let raw =
        input.value
            .trim();


    if (!raw) {

        if (showMessage) {

            showToast(
                "Informe um orçamento para continuar.",
                "warning"
            );
        }

        return false;
    }


    raw =
        raw
            .replace(/[R$\s]/g, "")
            .replace(/\./g, "")
            .replace(",", ".");


    const value =
        Number(raw);


    if (
        !Number.isFinite(value) ||
        value <= 0
    ) {

        if (showMessage) {

            showToast(
                "O orçamento deve ser um valor positivo.",
                "warning"
            );
        }

        return false;
    }


    state.budget =
        value;

    return true;
}


/* ============================================================
   25. FORMATAÇÃO DO CAMPO DE ORÇAMENTO
============================================================ */

function formatBudgetInput() {

    const input =
        $("budget");

    if (!input) {
        return;
    }


    let raw =
        input.value
            .replace(/\D/g, "");


    if (!raw) {
        return;
    }


    const cents =
        Number(raw);


    const value =
        cents / 100;


    input.value =
        value.toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
}


/* ============================================================
   26. SELEÇÃO DE VEÍCULO
============================================================ */

function handleVehicleChange(event) {

    const value =
        event.target.value;

    if (!cars[value]) {

        console.warn(
            "Veículo não encontrado:",
            value
        );

        return;
    }


    state.vehicleId =
        value;


    /*
        A preparação anterior é mantida?
        Não.

        Trocar de veículo significa recalcular
        a simulação sobre a nova base.
    */

    state.selectedModifications = [];

    state.automaticPreparation = null;


    updateModificationVisualState();

    renderVehicle();

    updateSimulation();


    showToast(
        `Veículo alterado para ${cars[value].nome}.`,
        "info"
    );
}


/* ============================================================
   27. OBJETIVO
============================================================ */

function handleObjectiveChange(event) {

    state.objective =
        event.target.value;


    updateSimulation();


    showToast(
        `Objetivo definido como ${getObjectiveLabel(
            state.objective
        )}.`,
        "info"
    );
}


/* ============================================================
   28. SCROLL SUAVE
============================================================ */

function scrollToElement(id) {

    const element =
        $(id);

    if (!element) {
        return;
    }

    element.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* ============================================================
   29. MENU MOBILE
============================================================ */

function setupMobileMenu() {

    const toggle =
        $("menuToggle") ||
        $("mobileMenuToggle");

    const menu =
        $("mainMenu") ||
        $("navMenu");

    if (!toggle || !menu) {
        return;
    }


    toggle.addEventListener(
        "click",
        () => {

            const opened =
                menu.classList.toggle(
                    "open"
                );

            toggle.setAttribute(
                "aria-expanded",
                String(opened)
            );
        }
    );


    menu
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    menu.classList.remove(
                        "open"
                    );

                    toggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            );
        });
}


/* ============================================================
   30. IMPRESSÃO
============================================================ */

function printReport() {

    /*
        Atualiza os dados antes de imprimir.
    */

    updateSimulation();

    window.print();
}


/* ============================================================
   31. PREPARAÇÃO DO PDF
============================================================ */

function getJsPDF() {

    if (
        typeof window.jspdf !==
        "undefined" &&
        window.jspdf.jsPDF
    ) {

        return window.jspdf.jsPDF;
    }


    if (
        typeof window.jsPDF !==
        "undefined"
    ) {

        return window.jsPDF;
    }


    return null;
}


/* ============================================================
   32. FUNÇÕES AUXILIARES PARA PDF
============================================================ */

function pdfText(
    doc,
    text,
    x,
    y,
    options = {}
) {

    const {
        size = 10,
        color = [40, 40, 40],
        bold = false,
        align = "left"
    } = options;


    doc.setFontSize(size);

    doc.setTextColor(
        color[0],
        color[1],
        color[2]
    );

    doc.setFont(
        "helvetica",
        bold
            ? "bold"
            : "normal"
    );


    doc.text(
        String(text),
        x,
        y,
        {
            align
        }
    );
}


function pdfTitle(
    doc,
    title,
    subtitle
) {

    pdfText(
        doc,
        title,
        20,
        25,
        {
            size: 20,
            color: [15, 23, 42],
            bold: true
        }
    );


    if (subtitle) {

        pdfText(
            doc,
            subtitle,
            20,
            34,
            {
                size: 10,
                color: [100, 116, 139]
            }
        );
    }


    doc.setDrawColor(
        34,
        197,
        94
    );

    doc.setLineWidth(1);

    doc.line(
        20,
        40,
        190,
        40
    );
}


function pdfWrappedText(
    doc,
    text,
    x,
    y,
    maxWidth,
    options = {}
) {

    const {
        size = 10,
        color = [50, 50, 50],
        lineHeight = 5
    } = options;


    doc.setFontSize(size);

    doc.setTextColor(
        color[0],
        color[1],
        color[2]
    );

    doc.setFont(
        "helvetica",
        "normal"
    );


    const lines =
        doc.splitTextToSize(
            String(text),
            maxWidth
        );


    doc.text(
        lines,
        x,
        y
    );


    return (
        y +
        lines.length *
        lineHeight
    );
}


function pdfTable(
    doc,
    headers,
    rows,
    startY,
    columnWidths
) {

    let y =
        startY;

    const rowHeight =
        8;

    const startX =
        20;


    /*
        Cabeçalho.
    */

    doc.setFillColor(
        15,
        23,
        42
    );

    doc.setTextColor(
        255,
        255,
        255
    );

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(8);


    let x =
        startX;


    headers.forEach(
        (header, index) => {

            doc.rect(
                x,
                y,
                columnWidths[index],
                rowHeight,
                "F"
            );

            doc.text(
                String(header),
                x + 2,
                y + 5
            );

            x +=
                columnWidths[index];
        }
    );


    y +=
        rowHeight;


    /*
        Linhas.
    */

    rows.forEach(
        row => {

            x =
                startX;


            doc.setTextColor(
                40,
                40,
                40
            );

            doc.setFont(
                "helvetica",
                "normal"
            );


            row.forEach(
                (cell, index) => {

                    doc.setDrawColor(
                        210,
                        214,
                        220
                    );

                    doc.rect(
                        x,
                        y,
                        columnWidths[index],
                        rowHeight
                    );

                    const text =
                        String(cell);

                    const lines =
                        doc.splitTextToSize(
                            text,
                            columnWidths[index] - 4
                        );


                    doc.text(
                        lines.slice(0, 2),
                        x + 2,
                        y + 4
                    );


                    x +=
                        columnWidths[index];
                }
            );


            y +=
                rowHeight;
        }
    );


    return y;
}


function addPdfFooter(
    doc,
    pageNumber
) {

    const pageHeight =
        doc.internal.pageSize.getHeight();

    doc.setFontSize(8);

    doc.setTextColor(
        120,
        120,
        120
    );

    doc.text(
        "Simulador de Preparação Automotiva — Projeto acadêmico — 3º DS",
        20,
        pageHeight - 10
    );

    doc.text(
        String(pageNumber),
        190,
        pageHeight - 10,
        {
            align: "right"
        }
    );
}


/* ============================================================
   33. GERAÇÃO DO PDF
============================================================ */

function generatePDF() {

    /*
        Atualiza tudo antes da geração.
    */

    updateSimulation();


    const JsPDF =
        getJsPDF();


    if (!JsPDF) {

        showToast(
            "A biblioteca jsPDF não foi carregada. Verifique o CDN no HTML.",
            "error"
        );

        return;
    }


    const car =
        getCurrentCar();

    const preparation =
        state.preparation ||
        calculatePreparation();

    const budget =
        calculateBudget();

    const scores =
        calculateScores();

    const safety =
        calculateSafety();

    const risk =
        safety.risk;

    const recommendations =
        generateRecommendations();

    const legalWarnings =
        generateLegalizationWarnings();

    const selected =
        getSelectedModifications();


    /*
        Criação do documento.
    */

    const doc =
        new JsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });


    const today =
        new Date();


    const dateString =
        today.toLocaleDateString(
            "pt-BR"
        );


    let page =
        1;


    /* ========================================================
       PÁGINA 1 - CAPA
    ======================================================== */

    doc.setFillColor(
        15,
        23,
        42
    );

    doc.rect(
        0,
        0,
        210,
        297,
        "F"
    );


    doc.setFillColor(
        34,
        197,
        94
    );

    doc.rect(
        0,
        0,
        210,
        8,
        "F"
    );


    pdfText(
        doc,
        "SIMULADOR DE",
        20,
        70,
        {
            size: 18,
            color: [148, 163, 184],
            bold: true
        }
    );


    pdfText(
        doc,
        "PREPARAÇÃO",
        20,
        88,
        {
            size: 30,
            color: [255, 255, 255],
            bold: true
        }
    );


    pdfText(
        doc,
        "AUTOMOTIVA",
        20,
        110,
        {
            size: 30,
            color: [34, 197, 94],
            bold: true
        }
    );


    pdfText(
        doc,
        "Projeto acadêmico",
        20,
        135,
        {
            size: 12,
            color: [203, 213, 225]
        }
    );


    pdfText(
        doc,
        "Aluno: Arthur Moreira Ribeiro",
        20,
        150,
        {
            size: 11,
            color: [255, 255, 255]
        }
    );


    pdfText(
        doc,
        "Turma: 3º DS",
        20,
        158,
        {
            size: 11,
            color: [255, 255, 255]
        }
    );


    pdfText(
        doc,
        `Veículo: ${car.nome}`,
        20,
        177,
        {
            size: 12,
            color: [255, 255, 255],
            bold: true
        }
    );


    pdfText(
        doc,
        `Objetivo: ${getObjectiveLabel(
            state.objective
        )}`,
        20,
        187,
        {
            size: 12,
            color: [255, 255, 255]
        }
    );


    pdfText(
        doc,
        `Data da geração: ${dateString}`,
        20,
        202,
        {
            size: 10,
            color: [148, 163, 184]
        }
    );


    pdfText(
        doc,
        "Os valores apresentados são estimativas para fins educacionais.",
        20,
        260,
        {
            size: 9,
            color: [148, 163, 184]
        }
    );


    addPdfFooter(
        doc,
        page
    );


    /* ========================================================
       PÁGINA 2 - DADOS DO VEÍCULO
    ======================================================== */

    doc.addPage();

    page++;

    pdfTitle(
        doc,
        "Dados do veículo",
        "Configuração original"
    );


    const vehicleRows = [

        [
            "Modelo",
            car.nome
        ],

        [
            "Potência",
            `${formatNumber(
                car.hp,
                0
            )} HP`
        ],

        [
            "Torque",
            `${formatNumber(
                car.torque
            )} kgfm`
        ],

        [
            "0–100 km/h",
            `${formatNumber(
                car.aceleracao,
                2
            )} s`
        ],

        [
            "Velocidade máxima",
            `${formatNumber(
                car.vmax,
                0
            )} km/h`
        ],

        [
            "Consumo",
            `${formatNumber(
                car.consumo
            )} km/l`
        ],

        [
            "Confiabilidade",
            `${formatNumber(
                car.confiabilidade,
                0
            )}%`
        ]
    ];


    pdfTable(
        doc,
        [
            "Parâmetro",
            "Valor"
        ],
        vehicleRows,
        50,
        [
            75,
            105
        ]
    );


    addPdfFooter(
        doc,
        page
    );


    /* ========================================================
       PÁGINA 3 - MODIFICAÇÕES
    ======================================================== */

    doc.addPage();

    page++;

    pdfTitle(
        doc,
        "Modificações",
        "Itens selecionados na preparação"
    );


    let modificationRows;


    if (selected.length === 0) {

        modificationRows = [
            [
                "Nenhuma modificação",
                "Configuração original",
                "R$ 0,00"
            ]
        ];

    } else {

        modificationRows =
            selected.map(
                mod => [
                    mod.nome,
                    mod.descricao,
                    formatCurrency(
                        mod.preco
                    )
                ]
            );
    }


    pdfTable(
        doc,
        [
            "Modificação",
            "Descrição",
            "Custo"
        ],
        modificationRows,
        50,
        [
            45,
            100,
            25
        ]
    );


    addPdfFooter(
        doc,
        page
    );


    /* ========================================================
       PÁGINA 4 - COMPARAÇÃO
    ======================================================== */

    doc.addPage();

    page++;

    pdfTitle(
        doc,
        "Comparação",
        "Original x preparado"
    );


    const comparisonRows = [

        [
            "Potência",
            `${formatNumber(
                preparation.original.hp,
                0
            )} HP`,
            `${formatNumber(
                preparation.prepared.hp,
                0
            )} HP`,
            `${preparation.differences.hp >= 0 ? "+" : ""}${formatNumber(
                preparation.differences.hp,
                0
            )} HP`
        ],

        [
            "Torque",
            `${formatNumber(
                preparation.original.torque
            )} kgfm`,
            `${formatNumber(
                preparation.prepared.torque
            )} kgfm`,
            `${preparation.differences.torque >= 0 ? "+" : ""}${formatNumber(
                preparation.differences.torque
            )} kgfm`
        ],

        [
            "0–100 km/h",
            `${formatNumber(
                preparation.original.acceleration,
                2
            )} s`,
            `${formatNumber(
                preparation.prepared.acceleration,
                2
            )} s`,
            `${preparation.differences.acceleration > 0 ? "+" : ""}${formatNumber(
                preparation.differences.acceleration,
                2
            )} s`
        ],

        [
            "Velocidade máxima",
            `${formatNumber(
                preparation.original.vmax,
                0
            )} km/h`,
            `${formatNumber(
                preparation.prepared.vmax,
                0
            )} km/h`,
            `${preparation.differences.vmax >= 0 ? "+" : ""}${formatNumber(
                preparation.differences.vmax,
                0
            )} km/h`
        ],

        [
            "Consumo",
            `${formatNumber(
                preparation.original.consumption
            )} km/l`,
            `${formatNumber(
                preparation.prepared.consumption
            )} km/l`,
            `${preparation.differences.consumption > 0 ? "+" : ""}${formatNumber(
                preparation.differences.consumption
            )} km/l`
        ],

        [
            "Confiabilidade",
            `${formatNumber(
                preparation.original.reliability,
                0
            )}%`,
            `${formatNumber(
                preparation.prepared.reliability,
                0
            )}%`,
            `${preparation.differences.reliability > 0 ? "+" : ""}${formatNumber(
                preparation.differences.reliability,
                0
            )}%`
        ]
    ];


    pdfTable(
        doc,
        [
            "Parâmetro",
            "Original",
            "Preparado",
            "Diferença"
        ],
        comparisonRows,
        50,
        [
            55,
            40,
            40,
            35
        ]
    );


    addPdfFooter(
        doc,
        page
    );


    /* ========================================================
       PÁGINA 5 - FINANCEIRO
    ======================================================== */

    doc.addPage();

    page++;

    pdfTitle(
        doc,
        "Resumo financeiro",
        "Orçamento e custo da preparação"
    );


    const budgetRows = [

        [
            "Orçamento disponível",
            formatCurrency(
                budget.budget
            )
        ],

        [
            "Custo total",
            formatCurrency(
                budget.cost
            )
        ],

        [
            "Valor restante",
            formatCurrency(
                budget.remaining
            )
        ],

        [
            "Percentual utilizado",
            formatPercent(
                budget.percentage
            )
        ],

        [
            "Status",
            budget.exceeded
                ? "Orçamento excedido"
                : budget.budget > 0
                    ? "Dentro do orçamento"
                    : "Orçamento não informado"
        ]
    ];


    pdfTable(
        doc,
        [
            "Item",
            "Valor"
        ],
        budgetRows,
        50,
        [
            90,
            80
        ]
    );


    pdfText(
        doc,
        "Detalhamento dos custos",
        20,
        120,
        {
            size: 13,
            bold: true,
            color: [15, 23, 42]
        }
    );


    if (selected.length > 0) {

        pdfTable(
            doc,
            [
                "Modificação",
                "Custo"
            ],
            selected.map(
                mod => [
                    mod.nome,
                    formatCurrency(
                        mod.preco
                    )
                ]
            ),
            130,
            [
                120,
                50
            ]
        );

    } else {

        pdfText(
            doc,
            "Nenhuma modificação selecionada.",
            20,
            132,
            {
                size: 10
            }
        );
    }


    addPdfFooter(
        doc,
        page
    );


    /* ========================================================
       PÁGINA 6 - SEGURANÇA
    ======================================================== */

    doc.addPage();

    page++;

    pdfTitle(
        doc,
        "Segurança e legalização",
        "Avaliação da configuração"
    );


    pdfText(
        doc,
        `Nível de risco: ${risk.level}`,
        20,
        55,
        {
            size: 13,
            bold: true,
            color:
                risk.level === "Baixo"
                    ? [22, 163, 74]
                    : risk.level === "Médio"
                        ? [217, 119, 6]
                        : [220, 38, 38]
        }
    );


    let y = 68;


    y =
        pdfWrappedText(
            doc,
            risk.description,
            20,
            y,
            170,
            {
                size: 10
            }
        );


    y += 10;


    pdfText(
        doc,
        "Recomendações",
        20,
        y,
        {
            size: 13,
            bold: true,
            color: [15, 23, 42]
        }
    );


    y += 8;


    recommendations
        .slice(0, 6)
        .forEach(
            rec => {

                y =
                    pdfWrappedText(
                        doc,
                        `• ${rec.title}: ${rec.text}`,
                        22,
                        y,
                        165,
                        {
                            size: 9,
                            lineHeight: 4.5
                        }
                    );

                y += 3;
            }
        );


    y += 6;


    pdfText(
        doc,
        "Legalização",
        20,
        y,
        {
            size: 13,
            bold: true,
            color: [15, 23, 42]
        }
    );


    y += 8;


    legalWarnings
        .slice(0, 5)
        .forEach(
            warning => {

                y =
                    pdfWrappedText(
                        doc,
                        `• ${warning.text}`,
                        22,
                        y,
                        165,
                        {
                            size: 9,
                            lineHeight: 4.5
                        }
                    );

                y += 3;
            }
        );


    addPdfFooter(
        doc,
        page
    );


    /* ========================================================
       PÁGINA 7 - PONTUAÇÃO
    ======================================================== */

    doc.addPage();

    page++;

    pdfTitle(
        doc,
        "Pontuação",
        "Avaliação dinâmica da preparação"
    );


    const scoreRows = [

        [
            "Desempenho",
            `${formatNumber(
                scores.desempenho
            )}/10`
        ],

        [
            "Segurança",
            `${formatNumber(
                scores.seguranca
            )}/10`
        ],

        [
            "Economia",
            `${formatNumber(
                scores.economia
            )}/10`
        ],

        [
            "Custo-benefício",
            `${formatNumber(
                scores.custoBeneficio
            )}/10`
        ]
    ];


    pdfTable(
        doc,
        [
            "Categoria",
            "Nota"
        ],
        scoreRows,
        55,
        [
            120,
            50
        ]
    );


    /*
        Barras visuais.
    */

    let barY =
        110;


    scoreRows.forEach(
        ([label, value]) => {

            const score =
                Number(
                    String(value)
                        .replace(",", ".")
                        .replace("/10", "")
                );


            pdfText(
                doc,
                label,
                20,
                barY,
                {
                    size: 9,
                    bold: true
                }
            );


            doc.setFillColor(
                226,
                232,
                240
            );

            doc.roundedRect(
                20,
                barY + 3,
                150,
                6,
                2,
                2,
                "F"
            );


            doc.setFillColor(
                34,
                197,
                94
            );

            doc.roundedRect(
                20,
                barY + 3,
                150 * (
                    clamp(
                        score,
                        0,
                        10
                    ) / 10
                ),
                6,
                2,
                2,
                "F"
            );


            barY += 22;
        }
    );


    addPdfFooter(
        doc,
        page
    );


    /* ========================================================
       PÁGINA FINAL - OBSERVAÇÃO
    ======================================================== */

    doc.addPage();

    page++;

    pdfTitle(
        doc,
        "Observação",
        "Limitações do simulador"
    );


    const observation =
        "Este relatório foi gerado pelo Simulador de Preparação Automotiva para fins educacionais. Os valores apresentados são estimativas e não representam garantia de desempenho, consumo, confiabilidade ou segurança. Os resultados reais dependem do veículo, peças utilizadas, instalação, manutenção, combustível, condições de uso e configuração.";


    pdfWrappedText(
        doc,
        observation,
        20,
        60,
        170,
        {
            size: 11,
            lineHeight: 6
        }
    );


    pdfWrappedText(
        doc,
        "Os requisitos de regularização podem variar conforme a legislação aplicável. Consulte os órgãos competentes e profissionais habilitados.",
        20,
        110,
        170,
        {
            size: 11,
            lineHeight: 6
        }
    );


    pdfWrappedText(
        doc,
        "Este projeto foi desenvolvido como uma aplicação acadêmica utilizando HTML5, CSS3 e JavaScript.",
        20,
        160,
        170,
        {
            size: 10,
            color: [80, 80, 80],
            lineHeight: 5
        }
    );


    addPdfFooter(
        doc,
        page
    );


    /* ========================================================
       DOWNLOAD
    ======================================================== */

    const fileName =
        `relatorio-preparacao-${sanitizeFileName(
            car.nome
        )}.pdf`;


    try {

        doc.save(
            fileName
        );

        showToast(
            "Relatório gerado com sucesso.",
            "success"
        );

    } catch (error) {

        console.error(
            "Erro ao gerar PDF:",
            error
        );

        showToast(
            "Não foi possível gerar o PDF.",
            "error"
        );
    }
}


/* ============================================================
   34. RESET
============================================================ */

function resetSimulation() {

    const confirmed =
        window.confirm(
            "Tem certeza que deseja apagar a configuração atual?"
        );


    if (!confirmed) {
        return;
    }


    state.vehicleId =
        "gti";

    state.budget =
        0;

    state.objective =
        "desempenho";

    state.selectedModifications =
        [];

    state.preparation =
        null;

    state.automaticPreparation =
        null;


    /*
        Restaurar select de veículo.
    */

    const vehicleSelect =
        $("vehicleSelect") ||
        $("vehicle");

    if (vehicleSelect) {

        vehicleSelect.value =
            "gti";
    }


    /*
        Restaurar orçamento.
    */

    const budgetInput =
        $("budget");

    if (budgetInput) {

        budgetInput.value =
            "";
    }


    /*
        Restaurar objetivo.
    */

    const objectiveSelect =
        $("objective");

    if (objectiveSelect) {

        objectiveSelect.value =
            "desempenho";
    }


    /*
        Desmarcar radio/checkboxes relacionados.
    */

    document
        .querySelectorAll(
            'input[type="checkbox"][data-modification], input[name="modification"]'
        )
        .forEach(
            input => {
                input.checked = false;
            }
        );


    updateModificationVisualState();

    renderVehicle();

    updateSimulation();

    renderAutomaticPreparationMessage();


    showToast(
        "A simulação foi restaurada ao estado inicial.",
        "success"
    );
}


/* ============================================================
   35. CONFIGURAÇÃO DE EVENTOS
============================================================ */

function setupEvents() {

    /*
        Veículo.
    */

    const vehicleSelect =
        $("vehicleSelect") ||
        $("vehicle");

    if (vehicleSelect) {

        vehicleSelect.addEventListener(
            "change",
            handleVehicleChange
        );
    }


    /*
        Objetivo.
    */

    const objectiveSelect =
        $("objective");

    if (objectiveSelect) {

        objectiveSelect.addEventListener(
            "change",
            handleObjectiveChange
        );
    }


    /*
        Orçamento.
    */

    const budgetInput =
        $("budget");

    if (budgetInput) {

        budgetInput.addEventListener(
            "input",
            () => {

                /*
                    Atualiza imediatamente,
                    mas não bloqueia a digitação.
                */

                let raw =
                    budgetInput.value
                        .replace(/[^\d,.-]/g, "");

                budgetInput.value =
                    raw;

                updateSimulation();
            }
        );


        budgetInput.addEventListener(
            "blur",
            () => {

                if (
                    budgetInput.value.trim()
                ) {

                    /*
                        Conversão amigável para
                        formato brasileiro.
                    */

                    let raw =
                        budgetInput.value
                            .replace(/[R$\s]/g, "")
                            .replace(/\./g, "")
                            .replace(",", ".");

                    const value =
                        Number(raw);

                    if (
                        Number.isFinite(value) &&
                        value > 0
                    ) {

                        budgetInput.value =
                            value.toLocaleString(
                                "pt-BR",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            );

                        state.budget =
                            value;

                    } else {

                        budgetInput.value =
                            "";
                    }
                }

                updateSimulation();
            }
        );
    }


    /*
        Preparação automática.
    */

    const automaticButton =
        $("generateAutomatic") ||
        $("automaticPreparationButton") ||
        $("generateAutomaticPreparation");


    if (automaticButton) {

        automaticButton.addEventListener(
            "click",
            generateAutomaticPreparation
        );
    }


    /*
        PDF.
    */

    const pdfButton =
        $("generatePDF") ||
        $("generatePdfButton") ||
        $("pdfButton");


    if (pdfButton) {

        pdfButton.addEventListener(
            "click",
            () => {

                if (
                    !validateBudgetInput(
                        true
                    )
                ) {

                    return;
                }

                generatePDF();
            }
        );
    }


    /*
        Impressão.
    */

    const printButton =
        $("printReport") ||
        $("printButton");


    if (printButton) {

        printButton.addEventListener(
            "click",
            printReport
        );
    }


    /*
        Reset.
    */

    const resetButton =
        $("resetSimulation") ||
        $("resetButton");


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetSimulation
        );
    }


    /*
        Botão "Começar Simulação".
    */

    const startButton =
        $("startSimulation") ||
        $("startButton");


    if (startButton) {

        startButton.addEventListener(
            "click",
            () => {

                scrollToElement(
                    "simulator"
                );

            }
        );
    }


    /*
        Links internos.
    */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    event => {

                        const targetId =
                            link
                                .getAttribute("href")
                                .substring(1);

                        const target =
                            $(targetId);

                        if (!target) {
                            return;
                        }

                        event.preventDefault();

                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }
                );
            }
        );
}


/* ============================================================
   36. INICIALIZAÇÃO
============================================================ */

function initializeApp() {

    console.log(
        "Inicializando Simulador de Preparação Automotiva..."
    );


    /*
        Monta os cards.
    */

    buildModificationCards();


    /*
        Configura eventos.
    */

    setupEvents();

    setupMobileMenu();


    /*
        Renderização inicial.
    */

    renderVehicle();

    updateSimulation();


    /*
        Estado inicial.
    */

    const vehicleSelect =
        $("vehicleSelect") ||
        $("vehicle");

    if (vehicleSelect) {

        if (
            cars[
                vehicleSelect.value
            ]
        ) {

            state.vehicleId =
                vehicleSelect.value;
        } else {

            vehicleSelect.value =
                "gti";

            state.vehicleId =
                "gti";
        }
    }


    const objectiveSelect =
        $("objective");

    if (objectiveSelect) {

        if (
            [
                "economia",
                "desempenho",
                "esportivo"
            ].includes(
                objectiveSelect.value
            )
        ) {

            state.objective =
                objectiveSelect.value;
        } else {

            objectiveSelect.value =
                "desempenho";
        }
    }


    renderVehicle();

    updateSimulation();


    /*
        Avisa que o sistema está pronto.
    */

    console.log(
        "Simulador inicializado com sucesso."
    );
}


/* ============================================================
   37. EXPOSIÇÃO DE FUNÇÕES
   Útil para testes e apresentação.
============================================================ */

window.SimuladorAutomotivo = {

    state,

    cars,

    modifications,

    initializeApp,

    calculatePreparation,

    calculateBudget,

    calculateSafety,

    calculateScores,

    generateRecommendations,

    generateAutomaticPreparation,

    generatePDF,

    printReport,

    resetSimulation,

    updateSimulation,

    showToast
};


/* ============================================================
   38. START
============================================================ */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();
}
