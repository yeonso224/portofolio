/**
 * [시니어 접근성 컴포넌트: 글자 크기 3단계 조절기]
 * 50~70대 수강생을 위한 폰트 스케일 제어 (보통 100% / 크게 115% / 아주 크게 130%)
 * 선택한 배율은 브라우저의 localStorage에 자동 저장되어 재방문 시에도 유지됩니다.
 */

const STORAGE_KEY = 'portfolio_font_scale';

export class AccessibilityManager {
  /**
   * @param {HTMLElement} containerEl - 글자 크기 버튼 그룹 컨테이너
   */
  constructor(containerEl) {
    this.container = containerEl;
    this.currentScale = parseFloat(localStorage.getItem(STORAGE_KEY) || '1.0');
    this.buttons = this.container ? this.container.querySelectorAll('.scale-btn') : [];
    
    this.init();
  }

  init() {
    // 저장된 스케일 배율 적용
    this.applyScale(this.currentScale);

    // 각 버튼별 클릭 이벤트 리스너 바인딩
    this.buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const scaleVal = parseFloat(btn.dataset.scale || '1.0');
        this.applyScale(scaleVal);
      });
    });
  }

  /**
   * CSS 변수 --font-scale을 변경하고 버튼 활성 상태를 갱신합니다.
   * @param {number} scale - 배율 값 (1.0, 1.15, 1.3)
   */
  applyScale(scale) {
    this.currentScale = scale;
    // 최상위 :root 요소에 --font-scale 변수 업데이트
    document.documentElement.style.setProperty('--font-scale', scale.toString());
    
    // 로컬 스토리지에 영구 저장
    localStorage.setItem(STORAGE_KEY, scale.toString());

    // 버튼 활성화 클래스(active) 동기화
    this.buttons.forEach((btn) => {
      const btnScale = parseFloat(btn.dataset.scale || '1.0');
      btn.classList.toggle('active', Math.abs(btnScale - scale) < 0.01);
    });
  }
}
