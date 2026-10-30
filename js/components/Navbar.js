/**
 * [상단 네비게이션 제어 컴포넌트]
 * 스크롤 감지에 따른 네비게이션 바 스타일 전환, 모바일 메뉴 열기/닫기 제어
 */

export class NavbarManager {
  /**
   * @param {HTMLElement} navbarEl - 네비게이션 바 DOM 엘리먼트
   */
  constructor(navbarEl) {
    this.navbar = navbarEl;
    if (!this.navbar) return;

    this.menu = this.navbar.querySelector('.navbar-menu');
    this.mobileToggleBtn = this.navbar.querySelector('.mobile-menu-btn');
    this.navLinks = this.navbar.querySelectorAll('.nav-link');

    this.init();
  }

  init() {
    // 1. 윈도우 스크롤 시 네비게이션 높이/그림자 효과 전환
    window.addEventListener('scroll', () => {
      const isScrolled = window.scrollY > 20;
      this.navbar.classList.toggle('scrolled', isScrolled);
    });

    // 2. 모바일 메뉴 버튼 토글
    if (this.mobileToggleBtn && this.menu) {
      this.mobileToggleBtn.addEventListener('click', () => {
        this.menu.classList.toggle('open');
      });

      // 메뉴 링크 클릭 시 모바일 메뉴 자동 닫기
      this.navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          this.menu.classList.remove('open');
        });
      });
    }
  }
}
