/**
 * [포트폴리오 메인 애플리케이션 엔트리 포인트]
 * - 분리된 각 컴포넌트(네비게이션, 접근성, 다이어그램, 관리자 모드, 작업물 갤러리, 모달)를 조립합니다.
 * - JSON 데이터 파일(profile.json, projects.json)을 로드하여 화면을 초기화합니다.
 */

import { NavbarManager } from './components/Navbar.js';
import { AccessibilityManager } from './components/Accessibility.js';
import { ModalManager } from './components/Modal.js';
import { PhysicalDiagramManager } from './components/PhysicalDiagram.js';
import { ProfileAdminManager } from './components/ProfileAdmin.js';
import { ProjectGalleryManager } from './components/ProjectGallery.js';

class PortfolioApp {
  constructor() {
    this.toastEl = document.getElementById('toastMsg');
    this.toastTimeout = null;

    this.init();
  }

  /**
   * 토스트 알림 메시지를 화면 하단에 띄웁니다.
   * @param {string} message - 표시할 안내 문구
   */
  showToast(message) {
    if (!this.toastEl) return;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);

    this.toastEl.textContent = message;
    this.toastEl.classList.add('show');

    this.toastTimeout = setTimeout(() => {
      this.toastEl.classList.remove('show');
    }, 3000);
  }

  async init() {
    // 1. 상단 네비게이션 컴포넌트 초기화
    new NavbarManager(document.querySelector('.navbar'));

    // 2. 시니어 접근성 글자 크기 조절기 초기화
    new AccessibilityManager(document.getElementById('fontScaleGroup'));

    // 3. 모달 인스턴스 초기화 (관리자 PIN 모달 & 프로젝트 상세 모달)
    const pinModal = new ModalManager('pinModal');
    const projectDetailModal = new ModalManager('projectDetailModal');

    // 4. AI 피지컬 3단계 인터랙티브 인포그래픽 초기화
    new PhysicalDiagramManager(document.getElementById('diagramSection'));

    // 5. 나만 편집 가능한 자기소개란 컴포넌트 초기화
    new ProfileAdminManager({
      aboutCardEl: document.getElementById('aboutCard'),
      bioTextEl: document.getElementById('instructorBioText'),
      bioEditEl: document.getElementById('instructorBioEdit'),
      adminBtnEl: document.getElementById('adminLockBtn'),
      adminBannerEl: document.getElementById('adminModeBanner'),
      saveBtnEl: document.getElementById('saveBioBtn'),
      cancelBtnEl: document.getElementById('cancelBioBtn'),
      backupBtnEl: document.getElementById('backupBioBtn'),
      pinModalInstance: pinModal,
      pinInputEl: document.getElementById('adminPinInput'),
      pinConfirmBtnEl: document.getElementById('pinConfirmBtn'),
      pinErrorEl: document.getElementById('pinErrorMsg'),
      showToastFn: (msg) => this.showToast(msg)
    });

    // 6. 작업물 갤러리 컴포넌트 초기화
    const galleryManager = new ProjectGalleryManager({
      gridEl: document.getElementById('projectsGrid'),
      filterBarEl: document.getElementById('filterBar'),
      projectModalInstance: projectDetailModal,
      modalTitleEl: document.getElementById('modalProjectTitle'),
      modalHeroImgEl: document.getElementById('modalProjectImg'),
      modalSummaryEl: document.getElementById('modalProjectSummary'),
      modalStepsEl: document.getElementById('modalProjectSteps'),
      modalHardwareEl: document.getElementById('modalHardwareTags'),
      modalSoftwareEl: document.getElementById('modalSoftwareTags'),
      modalExplanationEl: document.getElementById('modalProjectExplanation')
    });

    // 7. JSON 데이터 로드 및 렌더링
    await this.loadInitialData(galleryManager);
  }

  /**
   * profile.json 및 projects.json 데이터를 비동기로 로드합니다.
   * @param {ProjectGalleryManager} galleryManager - 갤러리 관리자 인스턴스
   */
  async loadInitialData(galleryManager) {
    try {
      const [profileRes, projectsRes] = await Promise.all([
        fetch('data/profile.json'),
        fetch('data/projects.json')
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        this.renderProfileData(profileData);
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        galleryManager.setProjects(projectsData);
      }
    } catch (err) {
      console.warn('데이터 로드 실패, 기본 정적 컨텐츠를 유지합니다:', err);
    }
  }

  /**
   * 프로필 데이터를 화면에 바인딩합니다. (단, 이미 사용자가 수정한 bio가 localStorage에 있다면 그 내용을 우선 유지)
   * @param {Object} data - 프로필 JSON 데이터
   */
  renderProfileData(data) {
    const savedBio = localStorage.getItem('portfolio_instructor_bio');
    const bioTextEl = document.getElementById('instructorBioText');
    if (bioTextEl && !savedBio && data.bio) {
      bioTextEl.textContent = data.bio;
    }

    // 기술 역량 그리드 렌더링
    const skillsGrid = document.getElementById('skillsGrid');
    if (skillsGrid && data.skills) {
      skillsGrid.innerHTML = '';
      data.skills.forEach((skill) => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.innerHTML = `
          <h4 class="skill-name">✨ ${skill.name}</h4>
          <p class="skill-desc">${skill.desc}</p>
        `;
        skillsGrid.appendChild(card);
      });
    }
  }
}

// DOM 준비 완료 시 메인 앱 실행
document.addEventListener('DOMContentLoaded', () => {
  window.portfolioApp = new PortfolioApp();
});
