/**
 * [공통 팝업 모달 관리 컴포넌트]
 * 모달 창 열기/닫기, 배경 클릭 시 닫기, ESC 키보드 입력 대응, 스크롤 잠금 제어
 */

export class ModalManager {
  /**
   * @param {string} modalId - 대상 모달의 DOM ID
   */
  constructor(modalId) {
    this.modalEl = document.getElementById(modalId);
    if (!this.modalEl) return;

    this.closeButtons = this.modalEl.querySelectorAll('.modal-close-btn, [data-modal-close]');
    this.bindEvents();
  }

  bindEvents() {
    // 닫기 버튼 클릭 시 닫기
    this.closeButtons.forEach((btn) => {
      btn.addEventListener('click', () => this.close());
    });

    // 뒷배경(Overlay) 어두운 영역 클릭 시 닫기
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.close();
      }
    });

    // 키보드 ESC 키 입력 시 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  /**
   * 모달 열기 및 바디 스크롤 잠금
   */
  open() {
    if (!this.modalEl) return;
    this.modalEl.classList.add('open');
    this.modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // 뒷배경 스크롤 방지
  }

  /**
   * 모달 닫기 및 스크롤 잠금 해제
   */
  close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('open');
    this.modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /**
   * 모달 열림 여부 확인
   * @returns {boolean}
   */
  isOpen() {
    return this.modalEl ? this.modalEl.classList.contains('open') : false;
  }
}
