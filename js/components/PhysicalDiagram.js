/**
 * [AI 피지컬 3단계 다이어그램 인터랙션 컴포넌트]
 * 시니어 수강생의 호기심을 자극하고 단계별(감각, 사고, 행동) 메커니즘을
 * 클릭이나 호버 시 시각적으로 생생하게 반응하도록 제어합니다.
 */

const STEP_DETAILS = {
  sensing: {
    title: "1단계: 현실을 느끼는 감각 (Sensing)",
    message: "사람이 눈과 귀로 세상을 보듯, <strong>카메라·초음파·컬러 센서</strong>가 앞의 사물과 거리를 감지합니다."
  },
  thinking: {
    title: "2단계: 스스로 판단하는 두뇌 (Thinking)",
    message: "감지된 정보를 <strong>파이썬 AI 알고리즘</strong>이 순식간에 분석하여 '어디로 갈지, 무엇을 집을지' 결정합니다."
  },
  action: {
    title: "3단계: 현실에서 움직이는 손발 (Action)",
    message: "생각한 결과를 바탕으로 <strong>레고 스파이크 프라임 모터와 로봇 팔</strong>이 현실에서 힘차게 동작합니다."
  }
};

export class PhysicalDiagramManager {
  /**
   * @param {HTMLElement} containerEl - 다이어그램 섹션 컨테이너
   */
  constructor(containerEl) {
    this.container = containerEl;
    if (!this.container) return;

    this.cards = this.container.querySelectorAll('.step-card');
    this.exampleBox = this.container.querySelector('#diagramExampleBox');

    this.init();
  }

  init() {
    this.cards.forEach((card) => {
      const stepKey = card.dataset.step; // 'sensing', 'thinking', 'action'

      // 카드 클릭 시 하단 안내 문구 동적 전환
      card.addEventListener('click', () => {
        this.selectStep(stepKey, card);
      });
    });
  }

  /**
   * 특정 단계를 활성화하고 하단 안내 문구를 변경합니다.
   * @param {string} stepKey - 단계 식별자
   * @param {HTMLElement} activeCard - 선택된 카드 엘리먼트
   */
  selectStep(stepKey, activeCard) {
    const detail = STEP_DETAILS[stepKey];
    if (!detail || !this.exampleBox) return;

    // 선택된 카드 외곽선 강조
    this.cards.forEach((c) => c.classList.remove('selected'));
    activeCard.classList.add('selected');

    // 하단 설명 박스 갱신 및 부드러운 페이드인
    this.exampleBox.innerHTML = `
      <div style="font-weight: 700; font-size: 1.15em; margin-bottom: 6px;">💡 ${detail.title}</div>
      <div>${detail.message}</div>
    `;
    this.exampleBox.style.animation = 'none';
    // 리플로우 강제 유도 후 애니메이션 재적용
    void this.exampleBox.offsetWidth;
    this.exampleBox.style.animation = 'fadeIn 0.4s ease';
  }
}
