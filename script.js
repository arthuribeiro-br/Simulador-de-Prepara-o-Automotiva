const CARS = {
    gti:  { nome: "VW Golf GTI",            hp: 230, torque: 35, t100: 6.4, vmax: 240, consumo: 11, conf: 92 },
    civic:{ nome: "Honda Civic SI",          hp: 200, torque: 28, t100: 7.2, vmax: 225, consumo: 13, conf: 95 },
    gol:  { nome: "VW Gol",                 hp: 84,  torque: 13, t100: 12,  vmax: 170, consumo: 14, conf: 88 },
    bmw:  { nome: "BMW 320i",               hp: 184, torque: 27, t100: 7.1, vmax: 235, consumo: 10, conf: 85 },
    merc: { nome: "Mercedes C200",          hp: 204, torque: 30, t100: 7.0, vmax: 237, consumo: 10, conf: 87 },
    chev: { nome: "Chevrolet Chevette",     hp: 65,  torque: 10, t100: 16,  vmax: 150, consumo: 13, conf: 72 },
    evo:  { nome: "Mitsubishi Lancer EVO",  hp: 291, torque: 42, t100: 5.4, vmax: 250, consumo: 9,  conf: 80 },
    a3:   { nome: "Audi A3",               hp: 150, torque: 25, t100: 8.5, vmax: 210, consumo: 12, conf: 90 },
  };
  
  const MODS = [
    { id: "turbo",        label: "Turbo",              desc: "Força forçada de ar no motor",        cost: 8000, hp: +60, torque: +12, t100: -1.5, vmax: +20, consumo: -2, conf: -12, risk: 2 },
    { id: "supercharger", label: "Supercharger",        desc: "Compressor movido pelo motor",        cost: 9000, hp: +50, torque: +10, t100: -1.2, vmax: +18, consumo: -3, conf: -10, risk: 2 },
    { id: "remap",        label: "Remap de ECU",        desc: "Reprogramação da central eletrônica", cost: 2500, hp: +25, torque: +5,  t100: -0.5, vmax: +10, consumo: -1, conf: -4,  risk: 1 },
    { id: "freios",       label: "Upgrade de freios",   desc: "Discos e pinças esportivos",          cost: 3500, hp: 0,   torque: 0,   t100: -0.2, vmax: +5,  consumo: 0,  conf: +5,  risk: 0 },
    { id: "suspensao",    label: "Suspensão esportiva", desc: "Molas e amortecedores rebaixados",    cost: 4500, hp: 0,   torque: 0,   t100: -0.3, vmax: +8,  consumo: 0,  conf: +2,  risk: 0 },
  ];
  
  function buildMods() {
    document.getElementById('mods-grid').innerHTML = MODS.map(m => `
      <div class="mod-card" id="card-${m.id}" onclick="toggleMod('${m.id}')">
        <input type="checkbox" id="${m.id}" onclick="event.stopPropagation(); simulate()">
        <div>
          <div class="mod-name">${m.label}</div>
          <div class="mod-desc">${m.desc}</div>
          <div class="mod-cost">R$ ${m.cost.toLocaleString('pt-BR')}</div>
        </div>
      </div>`).join('');
  }
  
  function toggleMod(id) {
    const cb = document.getElementById(id);
    cb.checked = !cb.checked;
    document.getElementById('card-' + id).classList.toggle('selected', cb.checked);
    simulate();
  }
  
  function getBase() {
    return CARS[document.getElementById('modelo').value];
  }
  
  function getSelectedMods() {
    return MODS.filter(m => document.getElementById(m.id)?.checked);
  }
  
  function simulate() {
    const base = getBase();
    const mods = getSelectedMods();
    const budget = parseFloat(document.getElementById('orcamento').value) || 0;
  
    let hp = base.hp, torque = base.torque, t100 = base.t100, vmax = base.vmax, consumo = base.consumo, conf = base.conf;
    let totalCost = 0, maxRisk = 0;
  
    mods.forEach(m => {
      hp += m.hp; torque += m.torque; t100 += m.t100;
      vmax += m.vmax; consumo += m.consumo; conf += m.conf;
      totalCost += m.cost;
      maxRisk = Math.max(maxRisk, m.risk);
    });
  
    t100 = Math.max(t100, 2.5);
    consumo = Math.max(consumo, 4);
    conf = Math.min(Math.max(conf, 50), 100);
  
    renderBudget(totalCost, budget);
    renderResults(base, { hp, torque, t100, vmax, consumo, conf });
    renderRisk(maxRisk, mods);
    renderScores(base, { hp, t100, consumo, conf, totalCost, budget });
  }
  
  function renderBudget(cost, budget) {
    const pct = budget > 0 ? Math.min((cost / budget) * 100, 100) : 0;
    const bar = document.getElementById('budget-bar');
    bar.style.width = pct + '%';
    bar.className = 'bar-fill' + (cost > budget ? ' over' : '');
  
    document.getElementById('custo-label').textContent = 'R$ ' + cost.toLocaleString('pt-BR');
    document.getElementById('budget-label').textContent = 'R$ ' + budget.toLocaleString('pt-BR');
  
    const msg = document.getElementById('budget-msg');
    if (cost === 0) {
      msg.textContent = 'Nenhuma modificação selecionada.';
      msg.className = 'budget-msg';
    } else if (cost > budget) {
      msg.textContent = '⚠ Orçamento excedido em R$ ' + (cost - budget).toLocaleString('pt-BR');
      msg.className = 'budget-msg over';
    } else {
      msg.textContent = 'Dentro do orçamento — sobram R$ ' + (budget - cost).toLocaleString('pt-BR');
      msg.className = 'budget-msg ok';
    }
  }
  
  function renderResults(base, prep) {
    const metrics = [
      { label: 'Potência',       orig: base.hp + ' HP',            val: prep.hp + ' HP',            better: prep.hp > base.hp },
      { label: 'Torque',         orig: base.torque + ' kgfm',      val: prep.torque + ' kgfm',      better: prep.torque > base.torque },
      { label: '0–100 km/h',    orig: base.t100.toFixed(1) + ' s', val: prep.t100.toFixed(1) + ' s', better: prep.t100 < base.t100 },
      { label: 'Vel. máxima',    orig: base.vmax + ' km/h',        val: prep.vmax + ' km/h',        better: prep.vmax > base.vmax },
      { label: 'Consumo',        orig: base.consumo + ' km/l',     val: prep.consumo + ' km/l',     better: prep.consumo >= base.consumo },
      { label: 'Confiabilidade', orig: base.conf + '%',            val: prep.conf + '%',            better: prep.conf >= base.conf },
    ];
  
    document.getElementById('results-grid').innerHTML = metrics.map(m => `
      <div class="metric">
        <div class="metric-label">${m.label}</div>
        <div class="metric-orig">${m.orig}</div>
        <div class="metric-new ${m.better ? 'better' : 'worse'}">${m.val}</div>
      </div>`).join('');
  }
  
  function renderRisk(level, mods) {
    const labels  = ['Baixo', 'Médio', 'Alto'];
    const classes = ['low', 'mid', 'high'];
    const icons   = ['ti-circle-check', 'ti-alert-triangle', 'ti-alert-octagon'];
  
    const badge = document.getElementById('risk-badge');
    badge.className = 'badge ' + classes[level];
    badge.innerHTML = `<i class="ti ${icons[level]}"></i> ${labels[level]}`;
  
    const msgs = [];
    if (mods.find(m => m.id === 'turbo' || m.id === 'supercharger'))
      msgs.push('Compressores exigem aprovação do DETRAN e laudo técnico.');
    if (mods.find(m => m.id === 'remap'))
      msgs.push('Remap de ECU pode invalidar a garantia do fabricante.');
    if (level >= 1)
      msgs.push('Recomenda-se upgrade de freios e suspensão ao aumentar a potência.');
  
    const alertEl = document.getElementById('risk-alert');
    if (msgs.length) {
      alertEl.style.display = 'flex';
      alertEl.className = 'alert ' + (level === 2 ? 'warn' : 'info');
      alertEl.innerHTML = `<i class="ti ti-info-circle" style="flex-shrink:0;margin-top:2px"></i><div>${msgs.join('<br>')}</div>`;
    } else {
      alertEl.style.display = 'none';
    }
  }
  
  function renderScores(base, { hp, t100, consumo, conf, totalCost, budget }) {
    const hpGain = (hp - base.hp) / Math.max(base.hp, 1);
    const perf = Math.min(10, Math.max(0, 5 + hpGain * 8 + (base.t100 - t100) * 0.4));
    const seg  = Math.min(10, (conf / 100) * 10);
    const eco  = Math.min(10, (consumo / 15) * 10);
    const cb   = totalCost > 0 ? Math.min(10, Math.max(0, (perf * 1.2) - (totalCost / budget) * 3 + 5)) : 5;
  
    const scores = [
      { label: 'Desempenho',      val: perf, color: '#185FA5' },
      { label: 'Segurança',       val: seg,  color: '#0F6E56' },
      { label: 'Economia',        val: eco,  color: '#854F0B' },
      { label: 'Custo-benefício', val: cb,   color: '#533AB7' },
    ];
  
    document.getElementById('score-grid').innerHTML = scores.map(s => `
      <div class="score-item">
        <label>${s.label}</label>
        <div class="score-bar-bg"><div class="score-bar" style="width:${Math.round(s.val * 10)}%;background:${s.color}"></div></div>
        <div class="score-val">${s.val.toFixed(1)}</div>
      </div>`).join('');
  }
  
  function autoConfig() {
    const obj    = document.getElementById('objetivo').value;
    const budget = parseFloat(document.getElementById('orcamento').value) || 0;
  
    MODS.forEach(m => {
      document.getElementById(m.id).checked = false;
      document.getElementById('card-' + m.id).classList.remove('selected');
    });
  
    const order =
      obj === 'eco'   ? ['freios', 'suspensao', 'remap'] :
      obj === 'perf'  ? ['remap', 'turbo', 'freios', 'suspensao'] :
                        ['turbo', 'remap', 'freios', 'suspensao', 'supercharger'];
  
    let spent = 0;
    order.forEach(id => {
      const m = MODS.find(x => x.id === id);
      if (m && spent + m.cost <= budget) {
        document.getElementById(id).checked = true;
        document.getElementById('card-' + id).classList.add('selected');
        spent += m.cost;
      }
    });
  
    simulate();
  }
  
  function generateReport() {
    const base = getBase();
    const mods = getSelectedMods();
    alert(
      'Relatório de: ' + base.nome +
      '\nModificações: ' + (mods.length ? mods.map(m => m.label).join(', ') : 'nenhuma') +
      '\n\n(Integre aqui sua biblioteca de PDF, ex: jsPDF)'
    );
  }
  
  buildMods();
  simulate();

  /* =====================================================
   CÁLCULO PRINCIPAL DA PREPARAÇÃO
   ===================================================== */


function calculatePreparation(){


const original =
cars[state.vehicle];



let prepared = {


hp: original.hp,

torque: original.torque,

aceleracao: original.aceleracao,

vmax: original.vmax,

consumo: original.consumo,

confiabilidade: original.confiabilidade

};





state.selectedMods.forEach(id=>{


const mod =
modifications[id];



prepared.hp += mod.hp;

prepared.torque += mod.torque;

prepared.aceleracao += mod.aceleracao;

prepared.vmax += mod.vmax;

prepared.consumo += mod.consumo;

prepared.confiabilidade += mod.confiabilidade;



});






/*
Limitações acadêmicas:

Os valores são mantidos dentro de limites
realistas para evitar resultados impossíveis.
*/


prepared.hp =
Math.max(prepared.hp,0);



prepared.torque =
Math.max(prepared.torque,0);



prepared.aceleracao =
Math.max(prepared.aceleracao,2);



prepared.vmax =
Math.max(prepared.vmax,50);



prepared.consumo =
Math.max(prepared.consumo,3);



prepared.confiabilidade =
Math.min(
Math.max(prepared.confiabilidade,0),
100
);





state.prepared = prepared;



renderResults();


calculateBudget();


calculateSafety();


calculateScores();


generateRecommendations();


renderCharts();


}









/* =====================================================
   CÁLCULO FINANCEIRO
   ===================================================== */


function calculateBudget(){


let total = 0;



state.selectedMods.forEach(id=>{

total += modifications[id].preco;

});



let budget =
Number(state.budget);



let remaining =
budget-total;



let percentage =
budget>0 ?
(total/budget)*100 :
0;





document.getElementById(
"financeBudget"
).textContent =
formatMoney(budget);



document.getElementById(
"financeCost"
).textContent =
formatMoney(total);



document.getElementById(
"financeRemaining"
).textContent =
formatMoney(remaining);






const progress =
document.getElementById(
"budgetProgress"
);



progress.style.width =
Math.min(
percentage,
100
)+"%";



progress.classList.remove(
"over"
);



const status =
document.getElementById(
"budgetStatus"
);



if(total > budget && budget>0){


progress.classList.add(
"over"
);



status.innerHTML =
`
⚠ Orçamento excedido em
${formatMoney(total-budget)}
`;



showToast(
"Orçamento excedido.",
"warning"
);



}else if(total<=budget && budget>0){


status.innerHTML =
`
✓ Preparação dentro do orçamento
<br>
Utilizado:
${percentage.toFixed(0)}%
`;



}else{


status.textContent =
"Informe um orçamento válido.";


}




renderCostTable();


}







/* =====================================================
   TABELA DE CUSTOS
   ===================================================== */


function renderCostTable(){


const table =
document.getElementById(
"costTable"
);



table.innerHTML="";



let total=0;



state.selectedMods.forEach(id=>{


const mod =
modifications[id];


total+=mod.preco;



table.innerHTML += `


<tr>

<td>
${mod.nome}
</td>


<td>
${formatMoney(mod.preco)}
</td>


</tr>


`;



});



if(state.selectedMods.length===0){


table.innerHTML =
`

<tr>

<td colspan="2">
Nenhuma modificação selecionada.
</td>

</tr>

`;



}



table.innerHTML += `


<tr>

<th>
Total
</th>


<th>
${formatMoney(total)}
</th>


</tr>


`;



}









/* =====================================================
   RESULTADOS COMPARATIVOS
   ===================================================== */


function renderResults(){


const original =
cars[state.vehicle];


const prepared =
state.prepared;



const rows = [


[
"Potência",
original.hp+" HP",
prepared.hp.toFixed(0)+" HP",
difference(prepared.hp-original.hp)
],



[
"Torque",
original.torque+" kgfm",
prepared.torque.toFixed(1)+" kgfm",
difference(prepared.torque-original.torque)
],



[
"0-100 km/h",
original.aceleracao+"s",
prepared.aceleracao.toFixed(1)+"s",
difference(
original.aceleracao-prepared.aceleracao
)+"s"
],



[
"Velocidade máxima",
original.vmax+" km/h",
prepared.vmax.toFixed(0)+" km/h",
difference(
prepared.vmax-original.vmax
)
],



[
"Consumo",
original.consumo+" km/l",
prepared.consumo.toFixed(1)+" km/l",
difference(
prepared.consumo-original.consumo
)
],



[
"Confiabilidade",
original.confiabilidade+"%",
prepared.confiabilidade.toFixed(0)+"%",
difference(
prepared.confiabilidade-original.confiabilidade
)
]


];




const table =
document.getElementById(
"comparisonTable"
);



table.innerHTML="";



rows.forEach(row=>{


let color="neutral";



if(row[3].includes("+")){

color="good";

}


if(row[3].includes("-")){

color="bad";

}




table.innerHTML += `


<tr>

<td>${row[0]}</td>

<td>${row[1]}</td>

<td>${row[2]}</td>

<td class="${color}">
${row[3]}
</td>


</tr>


`;



});



}





function difference(value){


if(value>0)

return "+"+value.toFixed(1);



if(value<0)

return value.toFixed(1);



return "0";


}








/* =====================================================
   SISTEMA DE SEGURANÇA
   ===================================================== */


function calculateSafety(){


let risk=0;



state.selectedMods.forEach(id=>{

risk += modifications[id].risco;

});



let level="Baixo";

let css="risk-low";



if(risk>=4){

level="Alto";

css="risk-high";

}

else if(risk>=2){

level="Médio";

css="risk-medium";

}





document.getElementById(
"riskLevel"
).textContent =
level;



const indicator =
document.getElementById(
"riskIndicator"
);



indicator.className =
"risk-indicator "+css;





document.getElementById(
"securityText"
).textContent =


level==="Baixo"

?

"Preparação com alterações de menor impacto."

:

level==="Médio"

?

"Alterações que exigem maior atenção em componentes mecânicos."

:

"Alterações significativas no conjunto mecânico. Recomenda-se avaliação profissional."

;




let legal="";


if(state.selectedMods.includes("turbo"))

legal +=
"Alterações no sistema de motorização podem exigir regularização. ";


if(state.selectedMods.includes("remap"))

legal +=
"Alterações eletrônicas podem afetar emissões, garantia e funcionamento do veículo. ";



if(!legal)

legal =
"Nenhum aviso específico identificado.";



document.getElementById(
"legalizationText"
).textContent =
legal;



}


/* =====================================================
   SISTEMA DE PONTUAÇÃO
   ===================================================== */


function calculateScores(){

const original =
cars[state.vehicle];

const prepared =
state.prepared;



/*
Desempenho:
considera ganho de potência,
torque, aceleração e velocidade.
*/


let performance =
0;


performance +=
((prepared.hp-original.hp)/10);


performance +=
((prepared.torque-original.torque)/2);


performance +=
((original.aceleracao-prepared.aceleracao)*2);


performance +=
((prepared.vmax-original.vmax)/10);



performance =
clamp(performance,0,10);






/*
Segurança:
considera confiabilidade,
presença de freios,
suspensão e risco.
*/


let safety =
prepared.confiabilidade/10;



if(state.selectedMods.includes("freios"))

safety+=1;



if(state.selectedMods.includes("suspensao"))

safety+=1;



state.selectedMods.forEach(id=>{

safety -= modifications[id].risco*.5;

});



safety =
clamp(safety,0,10);







/*
Economia:
considera consumo e valor gasto.
*/


let economy =
prepared.consumo;



if(state.selectedMods.length)

economy -= state.selectedMods.length;



economy =
clamp(economy/2,0,10);







/*
Custo-benefício:
considera ganhos,
quantidade de peças
e relação com orçamento.
*/


let total =
getTotalCost();



let value =
performance*0.6;



if(state.budget>0){

value +=
(total<=state.budget ? 3 : 1);

}



value -=
state.selectedMods.length*.3;



value =
clamp(value,0,10);






document.getElementById(
"performanceScore"
).textContent =
performance.toFixed(1);



document.getElementById(
"securityScore"
).textContent =
safety.toFixed(1);



document.getElementById(
"economyScore"
).textContent =
economy.toFixed(1);



document.getElementById(
"valueScore"
).textContent =
value.toFixed(1);



}





function clamp(value,min,max){

return Math.min(
Math.max(value,min),
max
);

}







/* =====================================================
   RECOMENDAÇÕES AUTOMÁTICAS
   ===================================================== */


function generateRecommendations(){


let messages=[];



if(state.selectedMods.includes("turbo")){


messages.push(
"Turbo aumenta potência e torque. Verifique freios, suspensão, arrefecimento e componentes relacionados."
);


}



if(state.selectedMods.includes("supercharger")){


messages.push(
"Considere avaliar o sistema de arrefecimento e a capacidade dos componentes do motor."
);


}



if(state.selectedMods.includes("remap")){


messages.push(
"O remapeamento pode alterar o funcionamento do motor. Consulte profissionais especializados."
);


}



if(state.prepared.hp >
cars[state.vehicle].hp*1.3){


messages.push(
"O aumento de potência é significativo. Avalie reforços mecânicos e segurança."
);


}



if(
!state.selectedMods.includes("freios")
&&
state.selectedMods.length>0
){


messages.push(
"Considere adicionar upgrade de freios para acompanhar alterações de desempenho."
);


}




if(
!state.selectedMods.includes("suspensao")
&&
state.selectedMods.length>0
){


messages.push(
"Verifique a suspensão para manter estabilidade e controle."
);


}




if(
getTotalCost()>state.budget
&&
state.budget>0
){


messages.push(
"Sua configuração ultrapassa o orçamento informado."
);


}




if(messages.length===0){


messages.push(
"Selecione modificações para receber recomendações personalizadas."
);


}




document.getElementById(
"recommendations"
).innerHTML =
messages
.map(item=>`<p>• ${item}</p>`)
.join("");



}









/* =====================================================
   PREPARAÇÃO AUTOMÁTICA
   ===================================================== */


function generateAutomaticPreparation(){


state.selectedMods=[];



document
.querySelectorAll(".modification-card")
.forEach(card=>{

card.classList.remove("selected");

card.querySelector(".selected-icon")
.textContent="";

});





let available =
Object.keys(modifications);



let sorted=[];




if(state.goal==="economia"){


sorted=[
"remap",
"freios",
"suspensao"
];


}



if(state.goal==="desempenho"){


sorted=[
"remap",
"turbo",
"freios"
];


}



if(state.goal==="esportivo"){


sorted=[
"turbo",
"freios",
"suspensao"
];


}






let total=0;



sorted.forEach(id=>{


let price =
modifications[id].preco;



if(
total+price<=state.budget
||
state.budget===0
){


state.selectedMods.push(id);

total+=price;


}



});






document
.querySelectorAll(".modification-card")
.forEach(card=>{


if(
state.selectedMods.includes(card.dataset.id)
){


card.classList.add("selected");


card.querySelector(".selected-icon")
.textContent=
"✓ Selecionado";


}


});






calculatePreparation();



document.getElementById(
"automaticResult"
).innerHTML = `


<div class="summary-card">

<h3>
Preparação automática gerada!
</h3>


<p>
Objetivo:
${state.goal}
</p>


<p>
Orçamento:
${formatMoney(state.budget)}
</p>


<p>
Modificações:
</p>


${state.selectedMods
.map(id=>"✓ "+modifications[id].nome)
.join("<br>")}


</div>


`;



showToast(
"Preparação automática gerada com sucesso."
);



}









/* =====================================================
   GRÁFICOS
   ===================================================== */


function renderCharts(){


const original =
cars[state.vehicle];


const prepared =
state.prepared;



createChart(
"powerChart",
"Potência HP",
[
original.hp,
prepared.hp
]
);



createChart(
"torqueChart",
"Torque",
[
original.torque,
prepared.torque
]
);



createChart(
"performanceChart",
"Desempenho",
[
original.aceleracao,
prepared.aceleracao,
original.vmax,
prepared.vmax
]
);



createChart(
"scoreChart",
"Avaliação",
[
Number(document.getElementById("performanceScore").textContent),
Number(document.getElementById("securityScore").textContent),
Number(document.getElementById("economyScore").textContent),
Number(document.getElementById("valueScore").textContent)
]
);



}





function createChart(id,label,data){


if(state.charts[id])

state.charts[id].destroy();



state.charts[id]=
new Chart(
document.getElementById(id),
{

type:"bar",

data:{

labels:
data.length===4
?
["Original","Preparado","Extra1","Extra2"]
:
["Original","Preparado"],


datasets:[{

label,

data,

backgroundColor:[
"#38bdf8",
"#22c55e",
"#facc15",
"#ef4444"
]

}]

},

options:{

responsive:true,

plugins:{

legend:{
display:true
}

}

}

});


}









/* =====================================================
   PDF COM jsPDF
   ===================================================== */


function generatePDF(){


const {jsPDF}=window.jspdf;



const pdf =
new jsPDF();



const vehicle =
cars[state.vehicle];



let y=20;



function add(text){

pdf.text(
String(text),
20,
y
);

y+=10;


if(y>280){

pdf.addPage();

y=20;

}

}




add(
"SIMULADOR DE PREPARAÇÃO AUTOMOTIVA"
);


add(
"Aluno: Arthur Moreira Ribeiro"
);


add(
"Turma: 3º DS"
);


add(
"Data: "+new Date().toLocaleDateString()
);


add(
"Veículo: "+vehicle.nome
);


add(
"Objetivo: "+state.goal
);



pdf.addPage();

y=20;


add("DADOS DO VEÍCULO");

add("Potência: "+vehicle.hp+" HP");

add("Torque: "+vehicle.torque);

add("0-100: "+vehicle.aceleracao+"s");

add("Velocidade máxima: "+vehicle.vmax);

add("Consumo: "+vehicle.consumo);

add("Confiabilidade: "+vehicle.confiabilidade);




pdf.addPage();

y=20;


add("MODIFICAÇÕES");



if(state.selectedMods.length===0){

add("Nenhuma modificação selecionada.");

}else{


state.selectedMods.forEach(id=>{

let mod=
modifications[id];

add(
`${mod.nome} - ${formatMoney(mod.preco)}`
);


});


}



pdf.addPage();

y=20;


add("COMPARAÇÃO");

add(
`Potência:
${vehicle.hp}
-> 
${state.prepared.hp}`
);


add(
`Torque:
${vehicle.torque}
->
${state.prepared.torque}`
);


add(
`0-100:
${vehicle.aceleracao}
->
${state.prepared.aceleracao}`
);



pdf.addPage();

y=20;


add("SEGURANÇA");

add(
"Nível de risco: "+
document.getElementById("riskLevel").textContent
);



add(
"Recomendações:"
);



document
.querySelectorAll("#recommendations p")
.forEach(p=>{

add(p.textContent);

});




pdf.addPage();

y=20;


add("PONTUAÇÃO");

add(
"Desempenho: "+
performanceScore.textContent
);

add(
"Segurança: "+
securityScore.textContent
);

add(
"Economia: "+
economyScore.textContent
);

add(
"Custo-benefício: "+
valueScore.textContent
);



pdf.addPage();

y=20;


add(
"Este relatório foi gerado para fins educacionais."
);


add(
"Os valores são estimativas."
);



let filename =
vehicle.nome
.toLowerCase()
.replace(/[^a-z0-9]+/g,"-");



pdf.save(
"relatorio-preparacao-"+filename+".pdf"
);



showToast(
"Relatório gerado com sucesso."
);


}









/* =====================================================
   IMPRESSÃO
   ===================================================== */


function printReport(){

window.print();

}








/* =====================================================
   RESET
   ===================================================== */


function resetSimulation(){


if(
!confirm(
"Tem certeza que deseja apagar a configuração atual?"
)

)

return;



state={

vehicle:"gti",

goal:"economia",

budget:0,

selectedMods:[],

prepared:null,

charts:{}

};



document.getElementById(
"budget"
).value="";



document.getElementById(
"vehicleSelect"
).value="gti";



document.querySelectorAll(
".modification-card"
)
.forEach(card=>{

card.classList.remove("selected");

card.querySelector(".selected-icon")
.textContent="";

});



renderVehicle();

calculatePreparation();



showToast(
"Simulação resetada."
);


}









/* =====================================================
   UTILIDADES
   ===================================================== */


function getTotalCost(){


return state.selectedMods.reduce(
(total,id)=>
total+modifications[id].preco,
0
);


}



function formatMoney(value){


return Number(value)
.toLocaleString(
"pt-BR",
{
style:"currency",
currency:"BRL"
}
);


}





function showToast(message){


const container =
document.getElementById(
"toastContainer"
);



const toast =
document.createElement("div");


toast.className="toast";

toast.textContent=message;



container.appendChild(toast);



setTimeout(()=>{

toast.remove();

},3000);



}









/* =====================================================
   EVENTOS
   ===================================================== */


function setupEvents(){



document
.getElementById("vehicleSelect")
.addEventListener(
"change",
e=>{

state.vehicle=e.target.value;

renderVehicle();

calculatePreparation();

}

);




document
.getElementById("budget")
.addEventListener(
"input",
e=>{


let value=
Number(e.target.value);



if(value<0){

e.target.value=0;

showToast(
"Valor inválido."
);

}



state.budget=value;

calculatePreparation();



}

);





document
.getElementById("goal")
.addEventListener(
"change",
e=>{


state.goal=e.target.value;


calculatePreparation();


}

);





document
.getElementById("automaticButton")
.addEventListener(
"click",
generateAutomaticPreparation
);





document
.getElementById("pdfButton")
.addEventListener(
"click",
generatePDF
);





document
.getElementById("printButton")
.addEventListener(
"click",
printReport
);





document
.getElementById("resetButton")
.addEventListener(
"click",
resetSimulation
);





document
.getElementById("startSimulation")
.addEventListener(
"click",
()=>{

document
.getElementById("veiculo")
.scrollIntoView({
behavior:"smooth"
});

}

);





document
.getElementById("menuToggle")
.addEventListener(
"click",
()=>{

document
.getElementById("mainMenu")
.classList.toggle("active");


}

);



}







document.addEventListener(
"DOMContentLoaded",
initializeApp
);
