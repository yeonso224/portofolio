/**
 * [나만 편집 가능한 자기소개란 & 관리자 PIN 인증 컴포넌트]
 * - 4자리 PIN 번호 인증을 거쳐야만 편집 모드로 진입합니다.
 * - 별도의 DB 서버 없이도 브라우저 localStorage에 안전하게 영구 저장됩니다.
 * - 수정된 내용을 profile.json 파일로 즉시 백업 다운로드할 수 있습니다.
 */

const STORAGE_BIO_KEY = 'portfolio_instructor_bio';
const STORAGE_PIN_KEY = 'portfolio_admin_pin';
const DEFAULT_PIN = '1234'; // 초기 기본 관리자 PIN 번호

export class ProfileAdminManager {
  /**
   * @param {Object} options - 각 UI 요소들의 참조 객체
   */
  constructor({
    aboutCardEl,
    bioTextEl,
    bioEditEl,
    adminBtnEl,
    adminBannerEl,
    saveBtnEl,
    cancelBtnEl,
    backupBtnEl,
    pinModalInstance,
    pinInputEl,
    pinConfirmBtnEl,
    pinErrorEl,
    showToastFn
  }) {
    this.aboutCard = aboutCardEl;
    this.bioText = bioTextEl;
    this.bioEdit = bioEditEl;
    this.adminBtn = adminBtnEl;
    this.adminBanner = adminBannerEl;
    this.saveBtn = saveBtnEl;
    this.cancelBtn = cancelBtnEl;
    this.backupBtn = backupBtnEl;
    this.pinModal = pinModalInstance;
    this.pinInput = pinInputEl;
    this.pinConfirmBtn = pinConfirmBtnEl;
    this.pinError = pinErrorEl;
    this.showToast = showToastFn || (() => {});

    this.isAdmin = false;
    this.init();
  }

  init() {
    // 저장된 소개글이 있다면 우선 복원
    const savedBio = localStorage.getItem(STORAGE_BIO_KEY);
    if (savedBio && this.bioText) {
      this.bioText.textContent = savedBio;
    }

    this.bindEvents();
  }

  bindEvents() {
    // 1. 상단 또는 본문의 관리자 버튼 클릭 시
    if (this.adminBtn) {
      this.adminBtn.addEventListener('click', () => {
        if (this.isAdmin) {
          // 이미 관리자 상태라면 모드 종료
          this.logoutAdmin();
        } else {
          // PIN 입력 모달 열기
          this.openPinModal();
        }
      });
    }

    // 2. PIN 확인 버튼 클릭 시
    if (this.pinConfirmBtn) {
      this.pinConfirmBtn.addEventListener('click', () => this.verifyPin());
    }

    // 3. PIN 입력창 엔터키 입력 시
    if (this.pinInput) {
      this.pinInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.verifyPin();
        }
      });
    }

    // 4. 소개글 저장 버튼 클릭 시
    if (this.saveBtn) {
      this.saveBtn.addEventListener('click', () => this.saveBio());
    }

    // 5. 편집 취소 버튼 클릭 시
    if (this.cancelBtn) {
      this.cancelBtn.addEventListener('click', () => this.cancelEdit());
    }

    // 6. 백업 파일(JSON) 다운로드 버튼 클릭 시
    if (this.backupBtn) {
      this.backupBtn.addEventListener('click', () => this.downloadBackup());
    }
  }

  /**
   * PIN 입력 모달을 열고 입력창을 초기화합니다.
   */
  openPinModal() {
    if (this.pinInput) {
      this.pinInput.value = '';
    }
    if (this.pinError) {
      this.pinError.textContent = '';
    }
    if (this.pinModal) {
      this.pinModal.open();
      setTimeout(() => this.pinInput && this.pinInput.focus(), 200);
    }
  }

  /**
   * 4자리 PIN 일치 여부 확인
   */
  verifyPin() {
    const inputVal = (this.pinInput ? this.pinInput.value : '').trim();
    const correctPin = localStorage.getItem(STORAGE_PIN_KEY) || DEFAULT_PIN;

    if (inputVal === correctPin) {
      // 인증 성공
      this.isAdmin = true;
      if (this.pinModal) this.pinModal.close();
      this.activateAdminMode();
      this.showToast('🔓 관리자 인증 성공! 자기소개 편집이 가능합니다.');
    } else {
      // 인증 실패
      if (this.pinError) {
        this.pinError.textContent = '❌ 비밀번호가 올바르지 않습니다. 다시 입력해 주세요.';
      }
      if (this.pinInput) {
        this.pinInput.value = '';
        this.pinInput.focus();
      }
    }
  }

  /**
   * 관리자 편집 모드 활성화 (인라인 편집창 노출)
   */
  activateAdminMode() {
    if (this.adminBtn) {
      this.adminBtn.classList.add('unlocked');
      this.adminBtn.innerHTML = `<span>🔓 편집 모드 해제</span>`;
    }

    if (this.adminBanner) {
      this.adminBanner.classList.add('active');
    }

    if (this.aboutCard) {
      this.aboutCard.classList.add('is-editing');
    }

    // 기존 본문 내용을 텍스트에어리어에 복사 채우기
    if (this.bioEdit && this.bioText) {
      this.bioEdit.value = this.bioText.textContent.trim();
      this.bioEdit.focus();
    }
  }

  /**
   * 관리자 모드 종료 (보기 모드로 복귀)
   */
  logoutAdmin() {
    this.isAdmin = false;
    if (this.adminBtn) {
      this.adminBtn.classList.remove('unlocked');
      this.adminBtn.innerHTML = `<span>🔒 소개 편집</span>`;
    }

    if (this.adminBanner) {
      this.adminBanner.classList.remove('active');
    }

    if (this.aboutCard) {
      this.aboutCard.classList.remove('is-editing');
    }

    this.showToast('🔒 관리자 편집 모드가 종료되었습니다.');
  }

  /**
   * 편집한 소개글을 localStorage에 저장하고 화면에 즉시 반영
   */
  saveBio() {
    if (!this.bioEdit || !this.bioText) return;

    const newBio = this.bioEdit.value.trim();
    if (!newBio) {
      alert('소개글 내용을 입력해 주세요.');
      return;
    }

    // 텍스트 반영
    this.bioText.textContent = newBio;
    
    // 로컬 스토리지에 영구 저장
    localStorage.setItem(STORAGE_BIO_KEY, newBio);

    // 편집 모드 종료
    this.logoutAdmin();
    this.showToast('✅ 소개글이 안전하게 저장되었습니다!');
  }

  /**
   * 편집 취소
   */
  cancelEdit() {
    this.logoutAdmin();
  }

  /**
   * 현재 소개 정보를 JSON 파일로 백업 다운로드
   */
  downloadBackup() {
    const currentBio = this.bioText ? this.bioText.textContent : '';
    const backupData = {
      name: "정연소",
      updatedAt: new Date().toISOString(),
      bio: currentBio
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instructor-profile-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.showToast('📥 프로필 백업 파일이 다운로드되었습니다.');
  }
}
