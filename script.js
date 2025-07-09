const choices = [
  "전혀 아니다", "아니다", "보통이다", "그렇다", "매우 그렇다"
];

const stressExplanations = {
  I: "내향적이고 자기비판적인 성향으로, 감정을 안으로 삭이며 스트레스를 처리합니다.",
  E: "감정이 격해지면 외적으로 분출하며, 스트레스를 주변 사람과의 관계에서 표현하는 경향이 있습니다.",
  S: "스트레스를 받으면 신체적 증상(두통, 소화불량 등)으로 반응하는 경향이 강합니다."
};

const stressDurationExplanations = {
  A: "단기적이고 즉각적인 스트레스 반응이며 스트레스가 비교적 빨리 해소되는 편입니다. 원인이 사라지면 감정도 회복됩니다.",
  C: "만성적인 스트레스 반응이며 스트레스가 쉽게 사라지지 않고 오랫동안 지속되는 경향이 있습니다."
};

const anxietyExplanations = {
  P: "미래에 대한 불확실성에서 불안을 느끼며, 걱정이 많고 대비하려는 경향이 강합니다.",
  F: "평가나 실수에 대한 두려움이 크고, 완벽주의적 성향을 보입니다.",
  H: "건강에 민감하며, 사소한 신체 변화에도 불안해하는 경향이 있습니다.",
  R: "사람들과의 관계에서 거절, 눈치, 평판에 대해 예민하게 반응합니다.",
  M: "불안 수준이 비교적 낮은 편이며, 상황에 따라 일시적으로 반응합니다.",
  E: "불안이 지속적이며 강하게 나타나는 유형으로 다양한 상황에서 불편함을 느낍니다."
};

window.onload = () => {
  const startBtn = document.getElementById("start-btn");
      const startScreen = document.getElementById("start-screen");
      const testForm = document.getElementById("testForm");

      startBtn.addEventListener("click", () => {
        startScreen.style.display = "none";
        testForm.style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  
    window.scrollTo({ top: 0, behavior: "smooth" });
  
  // 라디오 버튼 자동 생성
  document.querySelectorAll(".options").forEach((container) => {
    const name = container.getAttribute("data-name");
    choices.forEach((labelText, i) => {
      const val = i + 1;
      const id = `${name}-${val}`;
      const input = `<input type="radio" id="${id}" name="${name}" value="${val}" />`;
      const label = `<label for="${id}">${labelText}</label>`;
      container.innerHTML += input + label;
    });
  });

  document.getElementById("testForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const scores = {
      I: 0, E: 0, S: 0,
      A: 0, C: 0,
      P: 0, F: 0, H: 0, R: 0,
      M: 0, E2: 0
    };

    let totalAnxietyScore = 0;

    const data = new FormData(this);
    for (const [name, value] of data.entries()) {
      const group = document.querySelector(`[data-name="${name}"]`)?.parentElement?.getAttribute("data-group");
      if (group) {
        const val = parseInt(value);
        if (scores[group] !== undefined) {
          scores[group] += val;
        }
        if (["P", "F", "H", "R"].includes(group)) {
          totalAnxietyScore += val;
        }
      }
    }

    const stressDir = maxKey(scores, ["I", "E", "S"]);
    const stressLevel = scores["C"] >= scores["A"] ? "C" : "A";
    const anxietyDir = maxKey(scores, ["P", "F", "H", "R"]);
    const anxietyLevel = totalAnxietyScore >= 60 ? "E" : "M";

    document.getElementById("result").innerHTML = `
      당신의 스트레스 유형은 <strong>${stressDir}-${stressLevel}</strong>형이고,<br>
      불안 유형은 <strong>${anxietyDir}-${anxietyLevel}</strong>형입니다.
    `;

    document.getElementById("explanation").innerHTML = `
      <p><strong>${stressDir}-${stressLevel}</strong>형 해석:<br>${stressExplanations[stressDir]}</p>
      <p><strong>스트레스 지속 정도 (${stressLevel}형)</strong>:<br>${stressDurationExplanations[stressLevel]}</p>
      <p><strong>${anxietyDir}-${anxietyLevel}</strong>형 해석:<br>${anxietyExplanations[anxietyDir]}</p>
      <p><strong>불안 발현 정도 (${anxietyLevel}형)</strong>:<br>${
        anxietyLevel === "E"
          ? "불안이 강하게 드러나는 경향이 있습니다. 다양한 상황에서 지속적인 불안이 나타날 수 있습니다."
          : "불안이 비교적 낮은 편이며, 일시적이거나 특정 상황에서만 나타날 수 있습니다."
      }</p>
    `;
  });
};
const linkSection = document.getElementById("link-section");
const resultLink = document.getElementById("result-link");

resultLink.href = "https://docs.google.com/forms/d/e/1FAIpQLSdoqkqp1wSQ5mr3VHmMdvmD3aBvBDGmzA7Td0it48Lx7wzbSg/viewform?usp=header"; // 원하는 링크로 변경
linkSection.style.display = "block";
function maxKey(obj, keys) {
  return keys.reduce((a, b) => (obj[a] >= obj[b] ? a : b));
}