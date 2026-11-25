<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AutoForge — Simulador de Preparação Automotiva</title>
    <!-- Google Fonts & Tailwind CDN -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        :root {
          --bg-primary: #090909;
          --bg-card: #151515;
          --accent-orange: #FF6B00;
          --border-dark: #222222;
        }

        body {
          background-color: var(--bg-primary);
          color: #f3f4f6;
          font-family: 'Plus Jakarta Sans', sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Scrollbar Customizada */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: var(--bg-primary);
        }
        ::-webkit-scrollbar-thumb {
          background: #262626;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--accent-orange);
        }

        /* Animações de Fade */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Estilos de Impressão (PDF / Print) */
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          header, footer, button, nav {
            display: none !important;
          }
          #pdf-container {
            background-color: #ffffff !important;
            border: none !important;
            color: #000000 !important;
          }
        }
    </style>
</head>
<body class="bg-[#090909] text-gray-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#FF6B00] selection:text-white min-h-screen flex flex-col">

    <!-- Header / Navbar -->
    <header class="sticky top-0 z-50 bg-[#090909]/90 backdrop-blur-md border-b border-[#222]">
        <div class="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <div class="flex items-center gap-3 cursor-pointer" onclick="switchTab('home')">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#cc5500] flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-[#FF6B00]/20">AF</div>
                <div>
                    <h1 class="font-extrabold tracking-wider text-lg text-white">AUTO<span class="text-[#FF6B00]">FORGE</span></h1>
                    <p class="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Tuning Simulator</p>
                </div>
            </div>
            
            <nav class="hidden md:flex items-center gap-1 bg-[#151515] p-1.5 rounded-full border border-[#262626]">
                <button onclick="switchTab('home')" id="nav-home" class="px-5 py-2 rounded-full text-xs font-semibold transition-all text-white bg-[#FF6B00] shadow-md">Início</button>
                <button onclick="switchTab('simulator')" id="nav-simulator" class="px-5 py-2 rounded-full text-xs font-semibold transition-all text-gray-400 hover:text-white">Simulador</button>
                <button onclick="switchTab('performance')" id="nav-performance" class="px-5 py-2 rounded-full text-xs font-semibold transition-all text-gray-400 hover:text-white">Desempenho</button>
                <button onclick="switchTab('budget')" id="nav-budget" class="px-5 py-2 rounded-full text-xs font-semibold transition-all text-gray-400 hover:text-white">Orçamento</button>
                <button onclick="switchTab('smart')" id="nav-smart" class="px-5 py-2 rounded-full text-xs font-semibold transition-all text-gray-400 hover:text-white">IA Smart</button>
                <button onclick="switchTab('safety')" id="nav-safety" class="px-5 py-2 rounded-full text-xs font-semibold transition-all text-gray-400 hover:text-white">Legal & Segurança</button>
                <button onclick="switchTab('report')" id="nav-report" class="px-5 py-2 rounded-full text-xs font-semibold transition-all text-gray-400 hover:text-white">Relatório PDF</button>
            </nav>

            <div class="flex items-center gap-3">
                <button onclick="resetSimulation()" class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151515] hover:bg-[#222] border border-[#262626] text-xs font-semibold text-gray-300 transition-all">
                    Reiniciar
                </button>
                <button onclick="switchTab('simulator')" class="px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold transition-all shadow-lg shadow-[#FF6B00]/25 flex items-center gap-2">
                    Montar Projeto
                </button>
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <main class="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        <!-- HOME TAB -->
        <section id="tab-home" class="space-y-16 animate-fade-in">
            <div class="relative rounded-3xl overflow-hidden border border-[#222] bg-gradient-to-r from-[#151515] to-[#090909] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
                <div class="absolute inset-0 z-0 opacity-20 bg-cover bg-center pointer-events-none" style="background-image: url('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=80')"></div>
                <div class="relative z-10 max-w-xl space-y-6">
                    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] text-xs font-bold">
                        ⚡ NOVA VERSÃO 2.0 DISPONÍVEL
                    </div>
                    <h2 class="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                        Seu carro.<br>Sua preparação.<br><span class="text-[#FF6B00]">Seu projeto.</span>
                    </h2>
                    <p class="text-gray-400 text-sm md:text-base leading-relaxed">
                        Simule modificações de alta performance em tempo real. Analise potência, torque, custos detalhados, balanço de frenagem e conformidade legal com o DETRAN.
                    </p>
                    <div class="flex flex-wrap gap-4 pt-2">
                        <button onclick="switchTab('simulator')" class="px-8 py-4 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-sm transition-all shadow-xl shadow-[#FF6B00]/30 flex items-center gap-3">
                            Começar Simulação ➔
                        </button>
                        <button onclick="switchTab('smart')" class="px-8 py-4 rounded-xl bg-[#151515] hover:bg-[#222] border border-[#262626] text-white font-bold text-sm transition-all">
                            IA Preparação Inteligente
                        </button>
                    </div>
                </div>
                <div class="relative z-10 w-full md:w-1/2 rounded-2xl overflow-hidden shadow-2xl border border-[#262626]">
                    <img src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80" alt="Carro Preparado" class="w-full h-80 object-cover hover:scale-105 transition-transform duration-700">
                </div>
            </div>

            <!-- Como Funciona & Categorias -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-[#151515] border border-[#222] p-8 rounded-2xl space-y-4 hover:border-[#FF6B00]/50 transition-all">
                    <div class="w-12 h-12 rounded-xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center font-bold text-xl">01</div>
                    <h3 class="text-lg font-bold text-white">Escolha o Veículo</h3>
                    <p class="text-xs text-gray-400 leading-relaxed">Selecione entre hatches esportivos, sedãs de luxo, muscle cars e superhatches com especificações técnicas reais.</p>
                </div>
                <div class="bg-[#151515] border border-[#222] p-8 rounded-2xl space-y-4 hover:border-[#FF6B00]/50 transition-all">
                    <div class="w-12 h-12 rounded-xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center font-bold text-xl">02</div>
                    <h3 class="text-lg font-bold text-white">Adicione Upgrades</h3>
                    <p class="text-xs text-gray-400 leading-relaxed">Configure turbos, superchargers, remaps de ECU, kits de freios ventilados e suspensões coilover ajustáveis.</p>
                </div>
                <div class="bg-[#151515] border border-[#222] p-8 rounded-2xl space-y-4 hover:border-[#FF6B00]/50 transition-all">
                    <div class="w-12 h-12 rounded-xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center font-bold text-xl">03</div>
                    <h3 class="text-lg font-bold text-white">Analise Resultados</h3>
                    <p class="text-xs text-gray-400 leading-relaxed">Monitore ganho de potência, gráficos de desempenho, pontuação de confiabilidade e relatórios PDF profissionais.</p>
                </div>
            </div>
        </section>

        <!-- SIMULATOR TAB -->
        <section id="tab-simulator" class="hidden space-y-8 animate-fade-in">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#151515] p-6 rounded-2xl border border-[#222]">
                <div>
                    <h2 class="text-2xl font-extrabold text-white">Configurador de Veículo</h2>
                    <p class="text-xs text-gray-400">Escolha a base e selecione os upgrades para transformar seu carro.</p>
                </div>
                <div class="flex items-center gap-3 w-full md:w-auto">
                    <label class="text-xs font-semibold text-gray-300">Veículo Base:</label>
                    <select id="car-select" onchange="changeCar(this.value)" class="bg-[#090909] border border-[#262626] text-white text-xs rounded-xl px-4 py-2.5 outline-none focus:border-[#FF6B00]">
                        <!-- Populado via JS -->
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Vehicle Preview & Stats Summary -->
                <div class="lg:col-span-1 space-y-6">
                    <div class="bg-[#151515] border border-[#222] rounded-2xl overflow-hidden p-6 space-y-4">
                        <div class="relative rounded-xl overflow-hidden h-48 border border-[#262626]">
                            <img id="car-img" src="" alt="Veículo Selecionado" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'">
                            <div class="absolute top-3 left-3 bg-[#090909]/80 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-[#FF6B00] border border-[#222]">
                                <span id="car-badge">Stage Atual</span>
                            </div>
                        </div>
                        <div>
                            <h3 id="car-name-title" class="text-xl font-bold text-white">Nome do Carro</h3>
                            <p id="car-specs-subtitle" class="text-xs text-gray-400">Motorização original</p>
                        </div>
                        
                        <!-- Mini Teaser Telemetry -->
                        <div class="grid grid-cols-2 gap-3 pt-2 border-t border-[#222]">
                            <div class="bg-[#090909] p-3 rounded-xl border border-[#222]">
                                <span class="text-[10px] uppercase text-gray-500 font-semibold">Potência Total</span>
                                <p id="teaser-hp" class="text-lg font-extrabold text-[#FF6B00]">0 HP</p>
                            </div>
                            <div class="bg-[#090909] p-3 rounded-xl border border-[#222]">
                                <span class="text-[10px] uppercase text-gray-500 font-semibold">Custo Upgrades</span>
                                <p id="teaser-cost" class="text-lg font-extrabold text-white">R$ 0</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Upgrades Catalog -->
                <div class="lg:col-span-2 space-y-4">
                    <h3 class="text-lg font-bold text-white">Modificações Disponíveis</h3>
                    <div id="upgrades-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Renderizado via JS -->
                    </div>
                </div>
            </div>
        </section>

        <!-- PERFORMANCE TAB -->
        <section id="tab-performance" class="hidden space-y-8 animate-fade-in">
            <div class="flex justify-between items-center bg-[#151515] p-6 rounded-2xl border border-[#222]">
                <div>
                    <h2 class="text-2xl font-extrabold text-white">Painel de Desempenho & Telemetria</h2>
                    <p class="text-xs text-gray-400">Comparação em tempo real entre o veículo original e a versão preparada.</p>
                </div>
                <button onclick="switchTab('simulator')" class="px-4 py-2 bg-[#FF6B00] text-white text-xs font-bold rounded-xl">Editar Upgrades</button>
            </div>

            <!-- KPI Cards Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-[#151515] border border-[#222] p-5 rounded-2xl space-y-1">
                    <span class="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Potência (HP)</span>
                    <div class="flex items-baseline gap-2">
                        <h3 id="perf-hp" class="text-2xl font-extrabold text-white">0</h3>
                        <span id="perf-hp-diff" class="text-xs font-bold text-[#FF6B00]">+0</span>
                    </div>
                </div>
                <div class="bg-[#151515] border border-[#222] p-5 rounded-2xl space-y-1">
                    <span class="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Torque (kgfm)</span>
                    <div class="flex items-baseline gap-2">
                        <h3 id="perf-torque" class="text-2xl font-extrabold text-white">0</h3>
                        <span id="perf-torque-diff" class="text-xs font-bold text-[#FF6B00]">+0</span>
                    </div>
                </div>
                <div class="bg-[#151515] border border-[#222] p-5 rounded-2xl space-y-1">
                    <span class="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">0–100 km/h</span>
                    <div class="flex items-baseline gap-2">
                        <h3 id="perf-accel" class="text-2xl font-extrabold text-white">0s</h3>
                        <span id="perf-accel-diff" class="text-xs font-bold text-green-500">-0s</span>
                    </div>
                </div>
                <div class="bg-[#151515] border border-[#222] p-5 rounded-2xl space-y-1">
                    <span class="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Confiabilidade</span>
                    <h3 id="perf-reliability" class="text-2xl font-extrabold text-white">100%</h3>
                </div>
            </div>

            <!-- Charts Container -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-[#151515] border border-[#222] p-6 rounded-2xl space-y-4">
                    <h4 class="text-sm font-bold text-white">Curva de Potência (HP) vs. RPM</h4>
                    <div class="h-64 relative">
                        <canvas id="powerChart"></canvas>
                    </div>
                </div>
                <div class="bg-[#151515] border border-[#222] p-6 rounded-2xl space-y-4">
                    <h4 class="text-sm font-bold text-white">Análise Dinâmica (Radar)</h4>
                    <div class="h-64 relative flex items-center justify-center">
                        <canvas id="radarChart"></canvas>
                    </div>
                </div>
            </div>
        </section>

        <!-- BUDGET TAB -->
        <section id="tab-budget" class="hidden space-y-8 animate-fade-in">
            <div class="bg-[#151515] p-6 rounded-2xl border border-[#222] space-y-6">
                <div>
                    <h2 class="text-2xl font-extrabold text-white">Calculadora de Orçamento</h2>
                    <p class="text-xs text-gray-400">Defina o seu teto financeiro e receba recomendações otimizadas de custo-benefício.</p>
                </div>
                <div class="flex flex-col sm:flex-row gap-4 items-center">
                    <div class="w-full sm:w-1/3 space-y-2">
                        <label class="text-xs font-semibold text-gray-300">Orçamento Disponível (R$)</label>
                        <input type="number" id="budget-input" value="15000" step="1000" class="w-full bg-[#090909] border border-[#262626] rounded-xl px-4 py-3 text-white font-bold text-sm outline-none focus:border-[#FF6B00]">
                    </div>
                    <button onclick="calculateBudget()" class="w-full sm:w-auto px-8 py-3.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-[#FF6B00]/20">
                        Otimizar Configuração
                    </button>
                </div>
            </div>

            <div id="budget-results" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Populado via JS -->
            </div>
        </section>

        <!-- SMART PREPARATION TAB -->
        <section id="tab-smart" class="hidden space-y-8 animate-fade-in">
            <div class="bg-[#151515] p-8 rounded-2xl border border-[#222] space-y-6">
                <div>
                    <h2 class="text-2xl font-extrabold text-white">IA Preparação Inteligente</h2>
                    <p class="text-xs text-gray-400">Informe suas prioridades e nossa inteligência criará o setup perfeito para o seu perfil.</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="space-y-2">
                        <label class="text-xs font-semibold text-gray-300">Veículo</label>
                        <select id="smart-car" class="w-full bg-[#090909] border border-[#262626] text-white text-xs rounded-xl px-4 py-3 outline-none focus:border-[#FF6B00]">
                            <!-- Populado via JS -->
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="text-xs font-semibold text-gray-300">Objetivo Principal</label>
                        <select id="smart-goal" class="w-full bg-[#090909] border border-[#262626] text-white text-xs rounded-xl px-4 py-3 outline-none focus:border-[#FF6B00]">
                            <option value="performance">Desempenho Máximo (Pista / Arrancada)</option>
                            <option value="balanced">Uso Esportivo Diário (Equilibrado)</option>
                            <option value="economy">Eficiência & Custo-Benefício</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="text-xs font-semibold text-gray-300">Orçamento Limite</label>
                        <select id="smart-budget-limit" class="w-full bg-[#090909] border border-[#262626] text-white text-xs rounded-xl px-4 py-3 outline-none focus:border-[#FF6B00]">
                            <option value="10000">Até R$ 10.000</option>
                            <option value="25000" selected>Até R$ 25.000</option>
                            <option value="50000">Até R$ 50.000</option>
                            <option value="100000">Sem Limite</option>
                        </select>
                    </div>
                </div>
                <button onclick="runSmartSetup()" class="w-full py-4 bg-gradient-to-r from-[#FF6B00] to-[#cc5500] hover:opacity-90 text-white font-bold text-sm rounded-xl transition-all shadow-xl shadow-[#FF6B00]/25">
                    Gerar Setup com IA ⚡
                </button>
            </div>

            <div id="smart-output" class="hidden bg-[#151515] p-8 rounded-2xl border border-[#222] space-y-6">
                <!-- Resultado da IA -->
            </div>
        </section>

        <!-- SAFETY & LEGALITY TAB -->
        <section id="tab-safety" class="hidden space-y-8 animate-fade-in">
            <div class="bg-[#151515] p-6 rounded-2xl border border-[#222] space-y-2">
                <h2 class="text-2xl font-extrabold text-white">Segurança, Confiabilidade & Legislação (Brasil)</h2>
                <p class="text-xs text-gray-400">Análise de risco estrutural e orientações de regularização junto ao DETRAN / INMETRO.</p>
            </div>
            <div id="safety-list" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Populado via JS -->
            </div>
        </section>

        <!-- PDF REPORT TAB -->
        <section id="tab-report" class="hidden space-y-8 animate-fade-in">
            <div class="flex justify-between items-center bg-[#151515] p-6 rounded-2xl border border-[#222]">
                <div>
                    <h2 class="text-2xl font-extrabold text-white">Relatório Técnico do Projeto</h2>
                    <p class="text-xs text-gray-400">Documento pronto para exportação em PDF com todas as especificações do seu projeto.</p>
                </div>
                <div class="flex gap-3">
                    <button onclick="exportReportPDF()" class="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#FF6B00]/20">
                        📥 Baixar Arquivo PDF
                    </button>
                    <button onclick="window.print()" class="px-5 py-2.5 bg-[#151515] hover:bg-[#222] border border-[#262626] text-white text-xs font-bold rounded-xl transition-all">
                        🖨️ Imprimir
                    </button>
                </div>
            </div>

            <!-- Printable Report Document -->
            <div id="pdf-container" class="bg-[#151515] border border-[#222] p-8 md:p-12 rounded-3xl space-y-8 text-gray-200">
                <div class="flex justify-between items-start border-b border-[#262626] pb-8">
                    <div>
                        <h1 class="text-3xl font-extrabold text-white tracking-wider">AUTO<span class="text-[#FF6B00]">FORGE</span></h1>
                        <p class="text-xs text-gray-400">Relatório Técnico de Preparação Automotiva</p>
                    </div>
                    <div class="text-right">
                        <p id="report-date" class="text-xs text-gray-400">Data: 24/11/2026</p>
                        <p class="text-[10px] text-[#FF6B00] font-bold uppercase">Status: Projeto Simulado</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-[#090909] p-6 rounded-2xl border border-[#222] space-y-3">
                        <h3 class="text-sm font-bold text-[#FF6B00] uppercase tracking-wider">Veículo Base</h3>
                        <p id="report-car-name" class="text-lg font-extrabold text-white">-</p>
                        <p id="report-car-details" class="text-xs text-gray-400">-</p>
                    </div>
                    <div class="bg-[#090909] p-6 rounded-2xl border border-[#222] space-y-3">
                        <h3 class="text-sm font-bold text-[#FF6B00] uppercase tracking-wider">Resumo de Desempenho</h3>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <span class="text-gray-400">Potência Final:</span> <strong id="report-hp" class="text-white">-</strong>
                            <span class="text-gray-400">Torque Final:</span> <strong id="report-torque" class="text-white">-</strong>
                            <span class="text-gray-400">0-100 km/h:</span> <strong id="report-accel" class="text-white">-</strong>
                            <span class="text-gray-400">Custo Total:</span> <strong id="report-cost" class="text-[#FF6B00]">-</strong>
                        </div>
                    </div>
                </div>

                <div class="space-y-4">
                    <h3 class="text-sm font-bold text-white uppercase tracking-wider">Modificações Aplicadas</h3>
                    <div id="report-upgrades-list" class="space-y-2">
                        <!-- Preenchido via JS -->
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="mt-auto border-t border-[#222] bg-[#090909] py-8 text-center text-xs text-gray-500">
        <p>AutoForge Simulator © 2026. Desenvolvido para entusiastas automotivos de alta performance.</p>
    </footer>

    <!-- Script Principal -->
    <script>
        // Base de Dados de Veículos (atualizada com as fotos fornecidas)
        const carsData = {
            golf: {
                name: "Volkswagen Golf GTI (MK7.5)",
                specs: "2.0 TSI Turbo • 230 HP • 35.7 kgfm",
                hp: 230,
                torque: 35.7,
                accel: 6.2,
                topSpeed: 250,
                consumption: "10.5 km/l",
                img: "Volkswagen Golf GTI.jpg",
                badge: "Hot Hatch"
            },
            civic: {
                name: "Honda Civic Si (FC)",
                specs: "1.5 VTEC Turbo • 208 HP • 26.5 kgfm",
                hp: 208,
                torque: 26.5,
                accel: 7.3,
                topSpeed: 238,
                consumption: "12.0 km/l",
                img: "Honda Civic SI.jpg",
                badge: "Sport Sedan"
            },
            bmw: {
                name: "BMW 320i M Sport (G20)",
                specs: "2.0 TwinPower Turbo • 184 HP • 30.6 kgfm",
                hp: 184,
                torque: 30.6,
                accel: 7.1,
                topSpeed: 235,
                consumption: "11.2 km/l",
                img: "BMW 320i.jpg",
                badge: "Luxury Sport"
            },
            audi: {
                name: "Audi RS3 Sedan (8V)",
                specs: "2.5 TFSI 5-Cyl Turbo • 400 HP • 48.9 kgfm",
                hp: 400,
                torque: 48.9,
                accel: 4.1,
                topSpeed: 280,
                consumption: "8.5 km/l",
                img: "Audi RS3.jpg",
                badge: "Super Sedan"
            },
            mustang: {
                name: "Ford Mustang GT (S550)",
                specs: "5.0L Coyote V8 • 466 HP • 56.7 kgfm",
                hp: 466,
                torque: 56.7,
                accel: 4.3,
                topSpeed: 250,
                consumption: "6.8 km/l",
                img: "Ford Mustang.jpg",
                badge: "Muscle Car"
            }
        };

        // Catálogo de Modificações
        const upgradesData = [
            {
                id: "ecu",
                name: "Remap de ECU (Stage 2)",
                desc: "Otimização eletrônica de ponto de ignição, pressão de turbo e limite de torque.",
                cost: 4500,
                hpGain: 45,
                torqueGain: 7.0,
                accelGain: -0.4,
                reliability: -5,
                risk: "Médio",
                legal: "Necessário registro de alteração de potência no DETRAN se exceder 10%."
            },
            {
                id: "turbo",
                name: "Upgrade de Turbo / Carregador",
                desc: "Instalação de turbina redimensionada com rotor em alumínio billet e maior vazão.",
                cost: 12000,
                hpGain: 90,
                torqueGain: 12.5,
                accelGain: -0.7,
                reliability: -15,
                risk: "Alto",
                legal: "Exige vistoria Inmetro e laudo técnico para regularização no documento."
            },
            {
                id: "exhaust",
                name: "Escape Esportivo Full Inox",
                desc: "Sistema redimensionado sem restrições com ponteiras esportivas e ronco grave.",
                cost: 6500,
                hpGain: 18,
                torqueGain: 3.0,
                accelGain: -0.1,
                reliability: 0,
                risk: "Baixo",
                legal: "Deve respeitar limites máximos de ruído (CONAMA 80 dB)."
            },
            {
                id: "intercooler",
                name: "Intercooler de Alta Eficiência",
                desc: "Colmeia frontal redimensionada para reduzir a temperatura do ar admitido.",
                cost: 3800,
                hpGain: 15,
                torqueGain: 2.5,
                accelGain: -0.1,
                reliability: 5,
                risk: "Baixo",
                legal: "Dispensado de regularização por ser componente térmico auxiliar."
            },
            {
                id: "brakes",
                name: "Kit Freios Esportivos (Big Brake)",
                desc: "Discos ranhurados e pinças de 4/6 pistões com pastilhas de alto coeficiente de atrito.",
                cost: 9500,
                hpGain: 0,
                torqueGain: 0,
                accelGain: -0.2,
                reliability: 10,
                risk: "Baixo",
                legal: "Recomendado para segurança e estabilidade veicular em alta performance."
            },
            {
                id: "suspension",
                name: "Suspensão Coilover Ajustável",
                desc: "Amortecedores e molas esportivas reguláveis em altura, carga e rebaixamento.",
                cost: 7800,
                hpGain: 0,
                torqueGain: 0,
                accelGain: -0.1,
                reliability: 0,
                risk: "Médio",
                legal: "Altura mínima de 100mm do solo e regularização obrigatória no DETRAN."
            }
        ];

        // Estado da Aplicação
        let currentCarKey = "golf";
        let activeUpgrades = [];
        let powerChartInstance = null;
        let radarChartInstance = null;

        // Inicialização
        document.addEventListener("DOMContentLoaded", () => {
            populateCarSelects();
            changeCar("golf");
            setupCharts();
        });

        // Navegação por Abas
        function switchTab(tabId) {
            const tabs = ["home", "simulator", "performance", "budget", "smart", "safety", "report"];
            tabs.forEach(t => {
                const el = document.getElementById(`tab-${t}`);
                const nav = document.getElementById(`nav-${t}`);
                if (el) el.classList.add("hidden");
                if (nav) {
                    nav.classList.remove("bg-[#FF6B00]", "text-white", "shadow-md");
                    nav.classList.add("text-gray-400");
                }
            });

            const activeEl = document.getElementById(`tab-${tabId}`);
            const activeNav = document.getElementById(`nav-${tabId}`);
            if (activeEl) activeEl.classList.remove("hidden");
            if (activeNav) {
                activeNav.classList.add("bg-[#FF6B00]", "text-white", "shadow-md");
                activeNav.classList.remove("text-gray-400");
            }

            if (tabId === "performance") updateCharts();
            if (tabId === "report") updateReportData();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        function populateCarSelects() {
            const selects = [document.getElementById("car-select"), document.getElementById("smart-car")];
            selects.forEach(select => {
                if (!select) return;
                select.innerHTML = "";
                for (const [key, car] of Object.entries(carsData)) {
                    const opt = document.createElement("option");
                    opt.value = key;
                    opt.textContent = car.name;
                    select.appendChild(opt);
                }
            });
        }

        function changeCar(key) {
            currentCarKey = key;
            activeUpgrades = [];
            const car = carsData[key];
            
            document.getElementById("car-select").value = key;
            document.getElementById("smart-car").value = key;
            document.getElementById("car-name-title").textContent = car.name;
            document.getElementById("car-specs-subtitle").textContent = car.specs;
            document.getElementById("car-img").src = car.img;
            document.getElementById("car-badge").textContent = car.badge;

            renderUpgradesList();
            updateTelemetry();
        }

        function renderUpgradesList() {
            const container = document.getElementById("upgrades-list");
            container.innerHTML = "";

            upgradesData.forEach(up => {
                const isSelected = activeUpgrades.includes(up.id);
                const card = document.createElement("div");
                card.className = `p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isSelected ? "bg-[#1f150d] border-[#FF6B00]" : "bg-[#151515] border-[#222] hover:border-[#333]"
                }`;
                
                card.innerHTML = `
                    <div class="space-y-1">
                        <div class="flex justify-between items-start">
                            <h4 class="text-sm font-bold text-white">${up.name}</h4>
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                                up.risk === 'Alto' ? 'bg-red-500/10 text-red-500 border border-red-500/30' :
                                up.risk === 'Médio' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' :
                                'bg-green-500/10 text-green-500 border border-green-500/30'
                            }">Risco ${up.risk}</span>
                        </div>
                        <p class="text-xs text-gray-400 leading-relaxed">${up.desc}</p>
                    </div>
                    <div class="flex justify-between items-center pt-3 border-t border-[#222]">
                        <div>
                            <span class="text-[10px] text-gray-500 uppercase font-semibold">Custo Est.</span>
                            <p class="text-xs font-bold text-white">R$ ${up.cost.toLocaleString()}</p>
                        </div>
                        <button onclick="toggleUpgrade('${up.id}')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isSelected ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30' : 'bg-[#FF6B00] text-white hover:bg-[#e05e00]'
                        }">
                            ${isSelected ? 'Remover' : 'Adicionar'}
                        </button>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function toggleUpgrade(id) {
            if (activeUpgrades.includes(id)) {
                activeUpgrades = activeUpgrades.filter(item => item !== id);
            } else {
                activeUpgrades.push(id);
            }
            renderUpgradesList();
            updateTelemetry();
        }

        function calculateTotals() {
            const car = carsData[currentCarKey];
            let hp = car.hp;
            let torque = car.torque;
            let accel = car.accel;
            let cost = 0;
            let reliability = 100;

            activeUpgrades.forEach(id => {
                const up = upgradesData.find(u => u.id === id);
                if (up) {
                    hp += up.hpGain;
                    torque += up.torqueGain;
                    accel += up.accelGain;
                    cost += up.cost;
                    reliability += up.reliability;
                }
            });

            return {
                hp,
                torque: Number(torque.toFixed(1)),
                accel: Number(Math.max(2.8, accel).toFixed(1)),
                cost,
                reliability: Math.max(30, reliability)
            };
        }

        function updateTelemetry() {
            const totals = calculateTotals();
            
            document.getElementById("teaser-hp").textContent = `${totals.hp} HP`;
            document.getElementById("teaser-cost").textContent = `R$ ${totals.cost.toLocaleString()}`;
            
            document.getElementById("perf-hp").textContent = totals.hp;
            document.getElementById("perf-hp-diff").textContent = `+${totals.hp - carsData[currentCarKey].hp}`;
            document.getElementById("perf-torque").textContent = `${totals.torque} kgfm`;
            document.getElementById("perf-torque-diff").textContent = `+${(totals.torque - carsData[currentCarKey].torque).toFixed(1)}`;
            document.getElementById("perf-accel").textContent = `${totals.accel}s`;
            
            const relEl = document.getElementById("perf-reliability");
            relEl.textContent = `${totals.reliability}%`;
            relEl.className = `text-2xl font-extrabold ${totals.reliability < 60 ? 'text-red-500' : totals.reliability < 80 ? 'text-yellow-500' : 'text-green-500'}`;

            renderSafetyList();
        }

        function setupCharts() {
            const ctxPower = document.getElementById("powerChart").getContext("2d");
            powerChartInstance = new Chart(ctxPower, {
                type: 'line',
                data: {
                    labels: ['2000', '3000', '4000', '5000', '6000', '7000'],
                    datasets: [
                        {
                            label: 'Original',
                            data: [120, 160, 200, 230, 210, 180],
                            borderColor: '#71717a',
                            tension: 0.4,
                            borderWidth: 2
                        },
                        {
                            label: 'Preparado',
                            data: [130, 180, 240, 290, 320, 300],
                            borderColor: '#FF6B00',
                            backgroundColor: 'rgba(255, 107, 0, 0.1)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: '#a1a1aa', font: { size: 10 } } } },
                    scales: {
                        x: { grid: { color: '#222' }, ticks: { color: '#71717a' } },
                        y: { grid: { color: '#222' }, ticks: { color: '#71717a' } }
                    }
                }
            });

            const ctxRadar = document.getElementById("radarChart").getContext("2d");
            radarChartInstance = new Chart(ctxRadar, {
                type: 'radar',
                data: {
                    labels: ['Potência', 'Torque', 'Aceleração', 'Frenagem', 'Confiabilidade', 'Economia'],
                    datasets: [
                        {
                            label: 'Original',
                            data: [60, 60, 60, 60, 95, 80],
                            borderColor: '#71717a',
                            backgroundColor: 'rgba(113, 113, 122, 0.1)'
                        },
                        {
                            label: 'Preparado',
                            data: [90, 85, 95, 85, 75, 50],
                            borderColor: '#FF6B00',
                            backgroundColor: 'rgba(255, 107, 0, 0.2)'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: '#a1a1aa', font: { size: 10 } } } },
                    scales: {
                        r: {
                            grid: { color: '#222' },
                            angleLines: { color: '#222' },
                            ticks: { display: false }
                        }
                    }
                }
            });
        }

        function updateCharts() {
            if (!powerChartInstance || !radarChartInstance) return;
            const totals = calculateTotals();
            const car = carsData[currentCarKey];

            const hpMultiplier = totals.hp / car.hp;
            powerChartInstance.data.datasets[0].data = [car.hp*0.5, car.hp*0.7, car.hp*0.9, car.hp, car.hp*0.9, car.hp*0.8];
            powerChartInstance.data.datasets[1].data = [car.hp*0.55, car.hp*0.8, car.hp*1.05, totals.hp, totals.hp*0.95, totals.hp*0.85];
            powerChartInstance.update();

            radarChartInstance.data.datasets[1].data = [
                Math.min(100, hpMultiplier * 70),
                Math.min(100, (totals.torque / car.torque) * 70),
                Math.min(100, (car.accel / totals.accel) * 80),
                activeUpgrades.includes('brakes') ? 95 : 60,
                totals.reliability,
                Math.max(30, 90 - (activeUpgrades.length * 10))
            ];
            radarChartInstance.update();
        }

        function calculateBudget() {
            const limit = parseFloat(document.getElementById("budget-input").value) || 15000;
            const container = document.getElementById("budget-results");
            container.innerHTML = "";

            const affordable = upgradesData.filter(u => u.cost <= limit);
            
            if (affordable.length === 0) {
                container.innerHTML = `<div class="col-span-3 text-center py-12 text-gray-400">Nenhum upgrade disponível para este orçamento. Tente aumentar o valor.</div>`;
                return;
            }

            affordable.forEach(up => {
                const card = document.createElement("div");
                card.className = "bg-[#151515] border border-[#222] p-6 rounded-2xl space-y-4 flex flex-col justify-between";
                card.innerHTML = `
                    <div class="space-y-2">
                        <span class="text-[10px] font-bold text-[#FF6B00] uppercase">Compatível com seu orçamento</span>
                        <h4 class="text-base font-bold text-white">${up.name}</h4>
                        <p class="text-xs text-gray-400">${up.desc}</p>
                    </div>
                    <div class="pt-4 border-t border-[#222] flex justify-between items-center">
                        <span class="text-sm font-extrabold text-white">R$ ${up.cost.toLocaleString()}</span>
                        <button onclick="addUpgradeFromBudget('${up.id}')" class="px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold rounded-xl transition-all">
                            Selecionar na Simulação
                        </button>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function addUpgradeFromBudget(id) {
            if (!activeUpgrades.includes(id)) {
                activeUpgrades.push(id);
            }
            switchTab('simulator');
            updateTelemetry();
        }

        function runSmartSetup() {
            const carKey = document.getElementById("smart-car").value;
            const goal = document.getElementById("smart-goal").value;
            const budgetLimit = parseFloat(document.getElementById("smart-budget-limit").value);

            currentCarKey = carKey;
            const car = carsData[carKey];
            
            let selected = [];
            let currentCost = 0;

            const priorityOrder = goal === 'performance' ? ['turbo', 'ecu', 'intercooler', 'brakes', 'exhaust', 'suspension'] :
                                  goal === 'balanced' ? ['ecu', 'exhaust', 'brakes', 'suspension', 'intercooler', 'turbo'] :
                                  ['ecu', 'exhaust', 'intercooler'];

            for (const id of priorityOrder) {
                const up = upgradesData.find(u => u.id === id);
                if (up && (currentCost + up.cost) <= budgetLimit) {
                    selected.push(id);
                    currentCost += up.cost;
                }
            }

            activeUpgrades = selected;
            updateTelemetry();

            const output = document.getElementById("smart-output");
            output.classList.remove("hidden");
            output.innerHTML = `
                <div class="space-y-6">
                    <div class="flex justify-between items-center border-b border-[#222] pb-4">
                        <div>
                            <span class="text-xs font-bold text-[#FF6B00] uppercase">Configuração IA Gerada</span>
                            <h3 class="text-xl font-extrabold text-white">${car.name}</h3>
                        </div>
                        <div class="text-right">
                            <span class="text-xs text-gray-400">Investimento Total:</span>
                            <p class="text-lg font-extrabold text-white">R$ ${currentCost.toLocaleString()}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="bg-[#090909] p-4 rounded-xl border border-[#222]">
                            <span class="text-[10px] uppercase text-gray-500 font-semibold">Nova Potência</span>
                            <p class="text-lg font-extrabold text-[#FF6B00]">${calculateTotals().hp} HP</p>
                        </div>
                        <div class="bg-[#090909] p-4 rounded-xl border border-[#222]">
                            <span class="text-[10px] uppercase text-gray-500 font-semibold">0–100 km/h</span>
                            <p class="text-lg font-extrabold text-white">${calculateTotals().accel}s</p>
                        </div>
                        <div class="bg-[#090909] p-4 rounded-xl border border-[#222]">
                            <span class="text-[10px] uppercase text-gray-500 font-semibold">Modificações</span>
                            <p class="text-lg font-extrabold text-white">${selected.length} itens</p>
                        </div>
                    </div>
                    <button onclick="switchTab('simulator')" class="px-6 py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs rounded-xl transition-all">
                        Ver na Tela de Simulador ➔
                    </button>
                </div>
            `;
        }

        function renderSafetyList() {
            const container = document.getElementById("safety-list");
            container.innerHTML = "";

            if (activeUpgrades.length === 0) {
                container.innerHTML = `<div class="col-span-2 text-center py-12 text-gray-400">Nenhuma modificação aplicada. O veículo encontra-se totalmente original de fábrica.</div>`;
                return;
            }

            activeUpgrades.forEach(id => {
                const up = upgradesData.find(u => u.id === id);
                if (!up) return;

                const card = document.createElement("div");
                card.className = "bg-[#151515] border border-[#222] p-6 rounded-2xl space-y-3";
                card.innerHTML = `
                    <div class="flex justify-between items-center">
                        <h4 class="text-sm font-bold text-white">${up.name}</h4>
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                            up.risk === 'Alto' ? 'bg-red-500/10 text-red-500 border border-red-500/30' :
                            up.risk === 'Médio' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' :
                            'bg-green-500/10 text-green-500 border border-green-500/30'
                        }">Risco ${up.risk}</span>
                    </div>
                    <p class="text-xs text-gray-400"><strong class="text-white">Conformidade Legal (Brasil):</strong> ${up.legal}</p>
                `;
                container.appendChild(card);
            });
        }

        function updateReportData() {
            const car = carsData[currentCarKey];
            const totals = calculateTotals();

            document.getElementById("report-car-name").textContent = car.name;
            document.getElementById("report-car-details").textContent = car.specs;
            document.getElementById("report-hp").textContent = `${totals.hp} HP (+${totals.hp - car.hp})`;
            document.getElementById("report-torque").textContent = `${totals.torque} kgfm (+${(totals.torque - car.torque).toFixed(1)})`;
            document.getElementById("report-accel").textContent = `${totals.accel}s`;
            document.getElementById("report-cost").textContent = `R$ ${totals.cost.toLocaleString()}`;

            const list = document.getElementById("report-upgrades-list");
            list.innerHTML = "";

            if (activeUpgrades.length === 0) {
                list.innerHTML = `<p class="text-xs text-gray-500">Nenhuma modificação selecionada.</p>`;
                return;
            }

            activeUpgrades.forEach(id => {
                const up = upgradesData.find(u => u.id === id);
                const item = document.createElement("div");
                item.className = "flex justify-between text-xs py-2 border-b border-[#222]";
                item.innerHTML = `<span class="text-gray-300">• ${up.name}</span> <span class="font-bold text-[#FF6B00]">R$ ${up.cost.toLocaleString()}</span>`;
                list.appendChild(item);
            });
        }

        function exportReportPDF() {
            const element = document.getElementById("pdf-container");
            const car = carsData[currentCarKey];
            const opt = {
                margin:       10,
                filename:     `AutoForge_${car.name.replace(/\s+/g, '_')}_Relatorio.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#151515' },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().from(element).set(opt).save();
        }

        function resetSimulation() {
            activeUpgrades = [];
            renderUpgradesList();
            updateTelemetry();
            alert("Simulação reiniciada com sucesso!");
        }

        // Expor funções globalmente para eventos de clique do HTML
        window.switchTab = switchTab;
        window.changeCar = changeCar;
        window.toggleUpgrade = toggleUpgrade;
        window.calculateBudget = calculateBudget;
        window.addUpgradeFromBudget = addUpgradeFromBudget;
        window.runSmartSetup = runSmartSetup;
        window.exportReportPDF = exportReportPDF;
        window.resetSimulation = resetSimulation;
    </script>
</body>
</html>
