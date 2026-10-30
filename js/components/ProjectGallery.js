/**
 * [융합 작업물 갤러리 컴포넌트]
 * - 프로젝트 목록을 동적으로 렌더링하고 카테고리별(스파이크 프라임, 파이썬, 바이브 코딩) 필터링을 수행합니다.
 * - 프로젝트 카드를 클릭하면 상세 모달을 띄워 3단계 원리 및 사용 하드웨어/소프트웨어를 보여줍니다.
 */

export class ProjectGalleryManager {
  /**
   * @param {Object} options - DOM 엘리먼트 및 모달 인스턴스 참조 객체
   */
  constructor({
    gridEl,
    filterBarEl,
    projectModalInstance,
    modalTitleEl,
    modalHeroImgEl,
    modalSummaryEl,
    modalStepsEl,
    modalHardwareEl,
    modalSoftwareEl,
    modalExplanationEl
  }) {
    this.grid = gridEl;
    this.filterBar = filterBarEl;
    this.modal = projectModalInstance;

    // 상세 모달 내부 엘리먼트들
    this.modalTitle = modalTitleEl;
    this.modalHeroImg = modalHeroImgEl;
    this.modalSummary = modalSummaryEl;
    this.modalSteps = modalStepsEl;
    this.modalHardware = modalHardwareEl;
    this.modalSoftware = modalSoftwareEl;
    this.modalExplanation = modalExplanationEl;

    this.projects = [];
    this.currentFilter = 'all';

    this.initFilterEvents();
  }

  /**
   * 외부에서 로드한 프로젝트 JSON 데이터를 주입받아 초기 렌더링합니다.
   * @param {Array} projects - 프로젝트 데이터 배열
   */
  setProjects(projects) {
    this.projects = projects || [];
    this.render();
  }

  initFilterEvents() {
    if (!this.filterBar) return;

    const buttons = this.filterBar.querySelectorAll('.filter-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        this.currentFilter = btn.dataset.filter || 'all';
        this.render();
      });
    });
  }

  /**
   * 현재 필터 조건에 맞춰 카드 목록을 화면에 렌더링합니다.
   */
  render() {
    if (!this.grid) return;

    // 필터링 적용
    const filtered = this.projects.filter((p) => {
      if (this.currentFilter === 'all') return true;
      return p.category === this.currentFilter;
    });

    this.grid.innerHTML = '';

    if (filtered.length === 0) {
      this.grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          등록된 프로젝트가 없습니다.
        </div>
      `;
      return;
    }

    filtered.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.tabIndex = 0; // 키보드 접근성 확보
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${item.title} 상세 보기`);

      card.innerHTML = `
        <div class="project-thumb-wrap">
          <img src="${item.thumbnail}" alt="${item.title}" class="project-thumb-img" loading="lazy">
          <span class="project-badge-tag">${item.badge}</span>
        </div>
        <div class="project-content">
          <span class="project-category-label">${item.categoryName}</span>
          <h3 class="project-card-title">${item.title}</h3>
          <p class="project-summary">${item.summary}</p>
          <div class="project-card-footer">
            <span class="view-detail-link">
              자세히 보기 <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      `;

      // 클릭 또는 엔터 키 입력 시 상세 모달 오픈
      const openDetail = () => this.openDetailModal(item);
      card.addEventListener('click', openDetail);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail();
        }
      });

      this.grid.appendChild(card);
    });
  }

  /**
   * 프로젝트 상세 정보를 모달에 채워 넣고 모달을 띄웁니다.
   * @param {Object} item - 선택된 프로젝트 데이터 객체
   */
  openDetailModal(item) {
    if (!this.modal) return;

    if (this.modalTitle) this.modalTitle.textContent = item.title;
    if (this.modalHeroImg) {
      this.modalHeroImg.src = item.thumbnail;
      this.modalHeroImg.alt = item.title;
    }
    if (this.modalSummary) this.modalSummary.textContent = item.summary;

    // 3단계 작동 원리 렌더링
    if (this.modalSteps) {
      this.modalSteps.innerHTML = '';
      (item.howItWorks || []).forEach((step) => {
        const stepItem = document.createElement('div');
        stepItem.className = 'how-it-works-item';
        stepItem.innerHTML = `
          <span class="how-step-badge">${step.step}</span>
          <span class="how-step-desc">${step.desc}</span>
        `;
        this.modalSteps.appendChild(stepItem);
      });
    }

    // 사용 하드웨어 뱃지
    if (this.modalHardware) {
      this.modalHardware.innerHTML = '';
      (item.hardware || []).forEach((hw) => {
        const tag = document.createElement('span');
        tag.className = 'spec-tag';
        tag.textContent = `🤖 ${hw}`;
        this.modalHardware.appendChild(tag);
      });
    }

    // 사용 소프트웨어 뱃지
    if (this.modalSoftware) {
      this.modalSoftware.innerHTML = '';
      (item.software || []).forEach((sw) => {
        const tag = document.createElement('span');
        tag.className = 'spec-tag';
        tag.textContent = `💻 ${sw}`;
        this.modalSoftware.appendChild(tag);
      });
    }

    // 시니어 눈높이 친근한 해설
    if (this.modalExplanation) {
      this.modalExplanation.textContent = item.explanation || '';
    }

    // 모달 표시
    this.modal.open();
  }
}
