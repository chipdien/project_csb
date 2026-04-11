// ==UserScript==
// @name         Auto Nhập Key - Điền Key - Tìm kiếm - Lấy link - Hủy - Lặp - 2.2
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Bấm Bắt đầu: chỉ quét & tick sp theo giá/target. Bấm Lấy link: mới mở modal và bấm “Lấy link”. Có preset giá 50k-100k, 100k-200k, 200k-500k.
// @match        https://affiliate.shopee.vn/*product_offer*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    /* ===== Timings ===== */
    const CFG = {
        waitAfterFilter: 600,
        waitAfterNav: 520,
        maxShopeeSelect: 100,
        openBatchRetry: 3,
        clickGap: 180,
        modalAppearTimeout: 15000,
        layLinkTimeout: 15000,
    };

    /* ===== Keywords ===== */
    // Load keywords từ localStorage
    function loadKeywords() {
        try {
            const saved = localStorage.getItem('affKeywords');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('[AFF] Lỗi load keywords:', e);
            return [];
        }
    }

    function saveKeywords(keywords) {
        try {
            localStorage.setItem('affKeywords', JSON.stringify(keywords));
        } catch (e) {
            console.error('[AFF] Lỗi save keywords:', e);
        }
    }

    let KEYWORDS = loadKeywords();
    let currentKeywordIndex = 0; // Theo dõi vị trí keyword hiện tại

    /* ===== Helpers ===== */
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const T = el => (el ? (el.innerText || el.textContent || '') : '').trim();
    const parsePrice = s => { s = (s || '').replace(/[^\d]/g, ''); return s ? +s : NaN; };

    // Hàm điền giá trị vào input (hỗ trợ React)
    function setInputValue(input, value) {
        if (!input) return false;

        // Trigger React setter
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, value);

        // Dispatch events để React nhận biết
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        return true;
    }

    function selectedCount() {
        const n = $('#batch-bar .selected-num .emphasic');
        return n ? parseInt(n.textContent.trim() || '0', 10) || 0 : 0;
    }
    function selectedLimit() {
        const nums = $$('#batch-bar .selected-num .emphasic');
        if (nums.length >= 2) return parseInt(nums[1].textContent.trim() || `${CFG.maxShopeeSelect}`, 10) || CFG.maxShopeeSelect;
        return CFG.maxShopeeSelect;
    }
    function nextPage() {
        const next = $('.offer-list-page .page-next');
        if (next && !next.classList.contains('disabled')) { next.click(); return true; }
        return false;
    }

    /* ===== UI ===== */
    GM_addStyle(`
    :root{--bg:#fff;--text:#111827;--muted:#6b7280;--pri:#ff4d30;--bd:#e5e7eb}
    #affPanel{position:fixed;top:16px;right:16px;z-index:999999;background:var(--bg);color:var(--text);
      width:360px;max-width:92vw;border:1px solid var(--bd);border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.12);
      font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}
    #affPanel header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid var(--bd)}
    #affPanel .title{font-weight:700}
    #affPanel .pill{margin-left:6px;background:var(--pri);color:#fff;padding:2px 8px;border-radius:999px;font-size:11px}
    #affPanel .body{padding:12px}
    #affPanel .grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
    #affPanel label{font-size:12px;color:var(--muted);display:block;margin-bottom:4px;font-weight:500}
    #affPanel input{width:100%;border:1px solid var(--bd);border-radius:10px;padding:8px 10px;font-size:14px}
    #affPanel .row-actions{display:flex;gap:8px;margin-top:12px}
    #affPanel button{border:none;border-radius:10px;padding:9px 12px;font-weight:600;cursor:pointer}
    #affPanel .btn{flex:1}
    #affPanel .btn[disabled]{opacity:.6;cursor:not-allowed}
    #affPanel .btn-primary{background:var(--pri);color:#fff}
    #affPanel .btn-ghost{background:#f3f4f6}
    #affPanel .status{margin-top:10px;font-size:12px;color:var(--muted);min-height:16px}
    @media (max-width:780px){#affPanel{left:16px;right:16px;width:auto}#affPanel .grid{grid-template-columns:1fr 1fr}}

    #keyModal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999999;display:none;align-items:center;justify-content:center}
    #keyModal.show{display:flex}
    #keyModal .modal-content{background:var(--bg);border-radius:14px;width:500px;max-width:90vw;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.3)}
    #keyModal .modal-header{padding:16px 20px;border-bottom:1px solid var(--bd);display:flex;justify-content:space-between;align-items:center}
    #keyModal .modal-title{font-weight:700;font-size:16px}
    #keyModal .modal-close{background:none;border:none;font-size:24px;cursor:pointer;color:var(--muted);padding:0;width:30px;height:30px}
    #keyModal .modal-body{padding:20px;overflow-y:auto;flex:1}
    #keyModal #newKeyInput{width:100%;border:1px solid var(--bd);border-radius:10px;padding:10px 12px;font-size:14px;min-height:300px;resize:vertical;font-family:inherit;line-height:1.5}
    #keyModal .hint{margin-top:8px;font-size:12px;color:var(--muted);text-align:center}
  `);

    const panel = document.createElement('div');
    panel.id = 'affPanel';
    panel.innerHTML = `
    <header><div class="title">Shp AFF <span class="pill">Auto</span></div>
      <button id="affCollapse" class="btn-ghost" style="border:1px solid var(--bd);padding:6px 10px">Thu gọn</button>
    </header>
    <div class="body">
      <div class="grid">
        <div><label>Giá từ</label><input id="affMin" type="number" placeholder="50000" value="150000"></div>
        <div><label>Giá đến</label><input id="affMax" type="number" placeholder="300000" value="300000"></div>
        <div><label>Tổng link</label><input id="affTarget" type="number" min="1" max="100" placeholder="100" value="100"></div>
      </div>
      <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <label>SP/từ khóa</label>
          <input id="affPerKeyword" type="number" min="1" placeholder="10" value="34" style="width:100%;border:1px solid var(--bd);border-radius:10px;padding:8px 10px;font-size:14px">
        </div>
        <div>
          <label>Số lần lặp</label>
          <input id="affLoopCount" type="number" min="1" placeholder="1" value="5" style="width:100%;border:1px solid var(--bd);border-radius:10px;padding:8px 10px;font-size:14px">
        </div>
      </div>
      <div class="row-actions">
        <button id="affStart" class="btn btn-primary">Bắt đầu</button>
        <button id="affLay"   class="btn btn-ghost">Lấy link</button>
      </div>
      <div style="margin-top:8px">
        <button id="affManageKeys" class="btn btn-ghost" style="width:100%;border:1px solid var(--bd)">⚙️ Quản lý Keywords</button>
      </div>
      <div id="affStatus" class="status">Bấm Bắt đầu để tick sản phẩm. Sau đó bấm Lấy link để tải CSV.</div>
    </div>`;
    document.body.appendChild(panel);

    // Tạo modal quản lý keywords
    const keyModal = document.createElement('div');
    keyModal.id = 'keyModal';
    keyModal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">Quản lý Keywords</div>
        <button class="modal-close" id="closeKeyModal">×</button>
      </div>
      <div class="modal-body">
        <textarea id="newKeyInput" placeholder="Nhập keywords (mỗi dòng 1 keyword)&#10;Ví dụ:&#10;Dầu gội&#10;Sữa tắm&#10;Kem dưỡng da&#10;...&#10;&#10;Tự động lưu khi bạn nhập!"></textarea>
        <div class="hint">💾 Tự động lưu • 0 keywords</div>
      </div>
    </div>`;
    document.body.appendChild(keyModal);

    const el = {
        min: $('#affMin'), max: $('#affMax'), target: $('#affTarget'),
        perKeyword: $('#affPerKeyword'),
        loopCount: $('#affLoopCount'),
        start: $('#affStart'), btnLay: $('#affLay'),
        status: $('#affStatus'), collapse: $('#affCollapse'),
        body: panel.querySelector('.body'),
        manageKeys: $('#affManageKeys'),
        keyModal: keyModal,
        closeKeyModal: $('#closeKeyModal'),
        newKeyInput: $('#newKeyInput')
    };
    const setStatus = s => el.status.textContent = s;
    el.collapse.onclick = () => {
        const hide = el.body.style.display === 'none';
        el.body.style.display = hide ? '' : 'none';
        el.collapse.textContent = hide ? 'Thu gọn' : 'Mở';
    };

    /* ===== Quản lý Keywords Modal ===== */
    let saveTimeout = null;

    function updateHint() {
        const hint = $('.hint', el.keyModal);
        if (hint) {
            hint.textContent = `💾 Tự động lưu • ${KEYWORDS.length} keywords`;
        }
    }

    el.manageKeys.onclick = () => {
        el.keyModal.classList.add('show');
        el.newKeyInput.value = KEYWORDS.join('\n');
        updateHint();
        el.newKeyInput.focus();
    };

    el.closeKeyModal.onclick = () => {
        el.keyModal.classList.remove('show');
    };

    el.keyModal.onclick = (e) => {
        if (e.target === el.keyModal) {
            el.keyModal.classList.remove('show');
        }
    };

    // Auto-save khi người dùng nhập
    el.newKeyInput.oninput = () => {
        // Debounce: đợi 500ms sau khi người dùng ngừng gõ mới lưu
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            const text = el.newKeyInput.value.trim();
            // Tách theo dòng, loại bỏ dòng trống và khoảng trắng thừa
            const newKeywords = text.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            // Cập nhật KEYWORDS
            KEYWORDS = newKeywords;
            currentKeywordIndex = 0; // Reset về đầu
            saveKeywords(KEYWORDS);
            updateHint();
            console.log(`[AFF] Đã lưu ${KEYWORDS.length} keywords`);
        }, 500);
    };

    function getSearchInput() {
        return $('input.ant-input.ant-input-lg[placeholder*="Tìm kiếm"]') ||
            $('input[placeholder*="Tìm kiếm tất cả sản phẩm"]') ||
            $('input.ant-input-lg') ||
            $$('input[type="text"]').find(i => /tìm kiếm|search/i.test(i.placeholder || ''));
    }

    /* ===== Điền từ khóa tìm kiếm ===== */
    /* ===== Điền từ khóa tìm kiếm & Click Radio ===== */
    async function fillSearchKeyword(keyword, force = false) {
        const searchInput = getSearchInput();

        if (!searchInput) {
            console.log('[AFF] Không tìm thấy ô tìm kiếm');
            return false;
        }

        const currentValue = (searchInput.value || '').trim();
        if (currentValue && !force) {
            console.log('[AFF] Ô tìm kiếm đã có từ khóa:', currentValue);
            return true;
        }

        if (!keyword && KEYWORDS.length === 0) {
            setStatus('⚠ Chưa có keyword! Bấm "Quản lý Keywords" để thêm.');
            return false;
        }

        const key = keyword || KEYWORDS[currentKeywordIndex % KEYWORDS.length];
        console.log('[AFF] Điền từ khóa:', key);

        searchInput.focus();
        await sleep(150);

        const success = setInputValue(searchInput, key);
        if (!success) return false;

        console.log('[AFF] Đã điền từ khóa, nhấn Enter...');
        await sleep(300);

        // Nhấn Enter
        searchInput.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter', keyCode: 13 }));
        searchInput.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true, key: 'Enter', keyCode: 13, which: 13 }));
        searchInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter', keyCode: 13 }));

        // --- PHẦN MỚI: Đợi và Click Radio Button ---
        console.log('[AFF] Đang đợi để click Radio Button (value=2)...');
        await sleep(1000); // Đợi một chút để UI render sau khi Enter

        // Tìm radio button có value="2"
        const radioButton = $('input[type="radio"][value="2"]');
        if (radioButton) {
            // Click vào phần tử cha hoặc chính nó để kích hoạt Ant Design radio
            const wrapper = radioButton.closest('.ant-radio-button');
            if (wrapper) {
                wrapper.click();
                console.log('[AFF] Đã click Radio Button thành công');
            } else {
                radioButton.click();
            }
        } else {
            console.log('[AFF] Không tìm thấy Radio Button value="2"');
        }

        await sleep(800);
        return true;
    }

    /* ===== Xóa từ khóa tìm kiếm ===== */
    async function clearSearchKeyword() {
        const searchInput = getSearchInput();

        if (!searchInput) return;

        searchInput.focus();
        await sleep(100);

        // Sử dụng hàm helper để xóa giá trị
        setInputValue(searchInput, '');

        console.log('[AFF] Đã xóa từ khóa tìm kiếm');

        // Đợi xóa hoàn tất
        await sleep(500);
    }

    /* ===== Lọc theo giá (nếu có) ===== */
    async function setPriceFilter() {
        const minV = (el.min.value || '').trim(), maxV = (el.max.value || '').trim();
        if (!minV && !maxV) return;

        // mở popover "Giá" nếu có
        const priceBtn = $$('button,[role="button"],.ant-select-selector').find(b => /giá/i.test(T(b)));
        priceBtn?.click();
        await sleep(180);

        const inMin = $('input[placeholder*="Thấp"], input[placeholder*="Min"]') ||
            $$('input').find(i => /thấp|min|tối thiểu/i.test(i.placeholder || ''));
        const inMax = $('input[placeholder*="Cao"], input[placeholder*="Max"]') ||
            $$('input').find(i => /cao|max|tối đa/i.test(i.placeholder || ''));

        if (inMin && minV) { inMin.focus(); inMin.value = minV; inMin.dispatchEvent(new Event('input', { bubbles: true })); }
        if (inMax && maxV) { inMax.focus(); inMax.value = maxV; inMax.dispatchEvent(new Event('input', { bubbles: true })); }

        await sleep(130);
        const apply = $$('button,[role="button"]').find(b => /áp dụng|apply|ok/i.test(T(b)));
        apply?.click();
        await sleep(CFG.waitAfterFilter);
    }

    /* ===== Tick theo giá ===== */
    function cards() { return $$('.product-offer-item'); }
    function priceOf(card) { const n = card.querySelector('.ItemCard__price .price, .price'); return parsePrice(n ? n.textContent : ''); }
    function checkboxOf(card) { return card.querySelector('.AffiliateItemCard__gelinkSection input.ant-checkbox-input'); }
    function tickByPrice(minV, maxV, remaining) {
        let picked = 0;
        const list = cards();
        for (let i = 0; i < list.length && picked < remaining; i++) {
            const card = list[i], p = priceOf(card);
            if (Number.isNaN(p)) continue;
            if ((minV ? p >= minV : true) && (maxV ? p <= maxV : true)) {
                const cb = checkboxOf(card);
                if (cb && !cb.checked) { cb.click(); picked++; }
            }
        }
        return picked;
    }

    /* ===== Modal utils (Observer based) ===== */
    function visibleModal() {
        const wraps = $$('.ant-modal-wrap');
        for (let i = wraps.length - 1; i >= 0; i--) {
            const w = wraps[i];
            const hidden = w.getAttribute('aria-hidden') === 'true';
            const modal = w.querySelector('.ant-modal');
            if (!hidden && modal && modal.offsetParent !== null) return modal;
        }
        return null;
    }

    function waitForModal(timeout = CFG.modalAppearTimeout) {
        return new Promise(resolve => {
            const nowModal = visibleModal();
            if (nowModal) return resolve(nowModal);

            const t = setTimeout(() => {
                obs.disconnect();
                resolve(visibleModal());
            }, timeout);

            const obs = new MutationObserver(() => {
                const m = visibleModal();
                if (m) {
                    clearTimeout(t);
                    obs.disconnect();
                    requestAnimationFrame(() => requestAnimationFrame(() => resolve(m)));
                }
            });
            obs.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-hidden', 'style', 'class'] });
        });
    }

    async function openBatchAndWait() {
        for (let k = 0; k < CFG.openBatchRetry; k++) {
            const btn = $('#batch-bar .ant-btn-primary') ||
                $$('button').find(b => /lấy link hàng loạt/i.test(T(b)));
            if (!btn) { await sleep(200); continue; }

            btn.scrollIntoView({ block: 'center' }); await sleep(60);
            btn.click();
            const modal = await waitForModal();
            if (modal) return modal;
            await sleep(CFG.clickGap);
        }
        return null;
    }

    async function clickLayLinkAndWaitClose() {
        const t0 = Date.now();
        while (Date.now() - t0 < CFG.layLinkTimeout) {
            const m = visibleModal();
            if (!m) { return true; } // modal đóng → ok
            const btn = $$('button', m).find(b => {
                const s = T(b);
                return /lấy\s*link/i.test(s) && !/đóng|hủy|cancel/i.test(s);
            }) || m.querySelector('.ant-modal-footer .ant-btn-primary');

            if (btn) {
                btn.removeAttribute('disabled'); btn.style.pointerEvents = 'auto';
                btn.scrollIntoView({ block: 'center' }); await sleep(70);
                btn.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
                btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                btn.click();
            }
            await sleep(220);
        }
        return false;
    }

    /* ===== Tự động lấy link ===== */
    async function autoGetLinks() {
        try {
            // Bước 1: Bấm "Lấy link hàng loạt"
            setStatus('Đang bấm "Lấy link hàng loạt"...');
            const modal = await openBatchAndWait();
            if (!modal) {
                setStatus('Không mở được modal "Lấy link hàng loạt".');
                return;
            }

            // Bước 2: Bấm "Lấy link"
            setStatus('Đang bấm "Lấy link"...');
            await sleep(500);
            const layLinkBtn = $$('button span', modal).find(s => T(s) === 'Lấy link')?.closest('button') ||
                $$('span', modal).find(s => T(s) === 'Lấy link')?.closest('button');

            if (layLinkBtn) {
                layLinkBtn.click();
                console.log('[AFF] Đã bấm "Lấy link"');
            }

            // Bước 3: Đợi 2 giây
            setStatus('Đợi 2 giây...');
            await sleep(2000);

            // Bước 4: Bấm "Hủy" (hoặc "Huỷ")
            setStatus('Đang bấm "Hủy"...');
            await sleep(300);

            // Tìm nút Hủy với nhiều cách khác nhau
            const huyBtn =
                // Cách 1: Tìm button có span chứa text "Huỷ" hoặc "Hủy"
                $$('button').find(b => {
                    const span = b.querySelector('span');
                    const txt = span ? T(span) : '';
                    return /^(hủy|huỷ)$/i.test(txt);
                }) ||
                // Cách 2: Tìm button chứa text "Huỷ" hoặc "Hủy"
                $$('button').find(b => /^(hủy|huỷ)$/i.test(T(b))) ||
                // Cách 3: Tìm button.ant-btn có span text "Huỷ"
                $$('button.ant-btn').find(b => {
                    const spans = $$('span', b);
                    return spans.some(s => /^(hủy|huỷ)$/i.test(T(s)));
                });

            if (huyBtn) {
                console.log('[AFF] Tìm thấy nút Hủy, đang bấm...');
                huyBtn.click();
                console.log('[AFF] Đã bấm "Hủy"');
                await sleep(500);
            } else {
                console.log('[AFF] KHÔNG tìm thấy nút Hủy');
            }

            // Bước 5: Bấm "OK"
            setStatus('Đang bấm "OK"...');
            await sleep(300);
            const finalModal = visibleModal();
            if (finalModal) {
                const okBtn = $$('button span', finalModal).find(s => T(s) === 'OK')?.closest('button') ||
                    $$('span', finalModal).find(s => T(s) === 'OK')?.closest('button') ||
                    $$('button', finalModal).find(b => T(b) === 'OK');

                if (okBtn) {
                    okBtn.click();
                    console.log('[AFF] Đã bấm "OK"');
                }
            }

            await sleep(500);
            setStatus('✓ Hoàn tất tất cả! CSV sẽ tải xuống.');
        } catch (err) {
            console.error('[AFF] Lỗi khi tự động lấy link:', err);
            setStatus('⚠ Có lỗi khi tự động lấy link.');
        }
    }

    /* ===== Hành vi nút ===== */
    let RUNNING = false;

    // BẮT ĐẦU: lặp qua nhiều từ khóa, mỗi từ khóa lấy số SP định sẵn
    async function runSelectOnly() {
        if (RUNNING) return;
        RUNNING = true;
        el.start.disabled = true;
        el.btnLay.disabled = true;
        try {
            const minV = Number((el.min.value || '').trim()) || null;
            const maxV = Number((el.max.value || '').trim()) || null;
            const hardLimit = selectedLimit();
            let totalWant = Math.max(1, parseInt(el.target.value || '1', 10));
            const perKeyword = Math.max(1, parseInt(el.perKeyword.value || '10', 10));
            const loopTotal = Math.max(1, parseInt(el.loopCount.value || '1', 10));

            // Vòng lặp ngoài: lặp lại toàn bộ quá trình N lần
            for (let loopIndex = 1; loopIndex <= loopTotal; loopIndex++) {
                setStatus(`[Lần ${loopIndex}/${loopTotal}] Bắt đầu chọn sản phẩm...`);
                await sleep(500);

                let grandTotal = 0;
                let keywordRound = 0;

                while (grandTotal < totalWant) {
                    keywordRound++;
                    const remaining = totalWant - grandTotal;
                    const thisRoundTarget = Math.min(perKeyword, remaining);

                    if (KEYWORDS.length === 0) {
                        setStatus('⚠ Chưa có keyword! Bấm "Quản lý Keywords" để thêm.');
                        break;
                    }

                    const keyword = KEYWORDS[currentKeywordIndex % KEYWORDS.length];
                    setStatus(`[Vòng ${keywordRound}] Điền từ khóa…`);
                    await fillSearchKeyword(keyword);

                    // Đợi trang load kết quả tìm kiếm
                    setStatus(`[Vòng ${keywordRound}] Đang tải kết quả…`);
                    await sleep(1500);

                    await setPriceFilter();

                    // Tick sản phẩm cho từ khóa này - tìm qua TẤT CẢ các trang
                    let roundTotal = 0;
                    let pageNumber = 1;

                    while (roundTotal < thisRoundTarget) {
                        const remainingForKeyword = thisRoundTarget - roundTotal;
                        const selectedNow = selectedCount();
                        const remainingInBatch = hardLimit - selectedNow;

                        if (remainingInBatch <= 0) {
                            setStatus(`[Vòng ${keywordRound}] Đủ ${hardLimit} SP/batch, đang lấy link...`);
                            await autoGetLinks();

                            if (!nextPage()) {
                                console.log(`[AFF] Đã hết trang sau khi lấy link, dừng tại ${roundTotal}/${thisRoundTarget}`);
                                break;
                            }

                            pageNumber++;
                            await sleep(CFG.waitAfterNav);
                            await fillSearchKeyword(keyword);
                            continue;
                        }

                        const need = Math.min(remainingForKeyword, remainingInBatch);
                        setStatus(`[Vòng ${keywordRound}] Trang ${pageNumber} - Chọn ${roundTotal}/${thisRoundTarget}, tổng: ${grandTotal}/${totalWant}`);

                        const picked = tickByPrice(minV, maxV, need);
                        roundTotal += picked;
                        grandTotal += picked;

                        console.log(`[AFF] Trang ${pageNumber}: Tìm thấy ${picked} SP phù hợp, tổng từ khóa: ${roundTotal}/${thisRoundTarget}`);

                        // Nếu đã đủ số lượng cho từ khóa này, dừng
                        if (roundTotal >= thisRoundTarget) break;

                        // Thử chuyển sang trang tiếp theo
                        if (!nextPage()) {
                            console.log(`[AFF] Đã hết trang, chỉ tìm được ${roundTotal}/${thisRoundTarget} SP cho từ khóa này`);
                            break; // Hết trang rồi, không còn trang nào nữa
                        }

                        pageNumber++;
                        await sleep(CFG.waitAfterNav);
                        await fillSearchKeyword(keyword);
                    }

                    console.log(`[AFF] Vòng ${keywordRound}: đã lấy ${roundTotal}/${thisRoundTarget}, tổng: ${grandTotal}/${totalWant}`);

                    // Nếu còn SP đang được chọn, lấy link trước khi đổi từ khóa
                    if (selectedCount() > 0) {
                        setStatus(`[Vòng ${keywordRound}] Đang lấy link (phần còn lại)...`);
                        await autoGetLinks();
                    }

                    // Nếu đã đủ số lượng tổng, dừng
                    if (grandTotal >= totalWant) {
                        currentKeywordIndex++;
                        break;
                    }

                    // Xóa từ khóa và chuẩn bị cho vòng tiếp theo
                    setStatus(`[Vòng ${keywordRound}] Xóa từ khóa, chuẩn bị vòng mới…`);
                    await clearSearchKeyword();
                    await sleep(500);
                    currentKeywordIndex++;
                }

                if (grandTotal === 0) {
                    setStatus(`[Lần ${loopIndex}/${loopTotal}] Không có sp phù hợp trong khoảng giá.`);
                } else {
                    setStatus(`[Lần ${loopIndex}/${loopTotal}] ✓ Đã chọn ${grandTotal}/${totalWant} SP qua ${keywordRound} từ khóa.`);
                }

                // Nếu chưa phải lần cuối, đợi trước khi bắt đầu vòng tiếp theo
                if (loopIndex < loopTotal) {
                    setStatus(`[Lần ${loopIndex}/${loopTotal}] Hoàn tất. Chuẩn bị lần ${loopIndex + 1}...`);
                    await sleep(2000);
                } else {
                    setStatus(`✓✓✓ Hoàn tất TẤT CẢ ${loopTotal} lần lặp!`);
                }
            }
        } finally {
            RUNNING = false;
            el.start.disabled = false;
            el.btnLay.disabled = false;
        }
    }

    // LẤY LINK: chỉ mở modal + bấm “Lấy link” dựa trên selections hiện có
    async function runOpenAndLayLink() {
        if (RUNNING) return;
        const total = selectedCount();
        if (total <= 0) { setStatus('Chưa có sản phẩm nào được tích. Hãy bấm Bắt đầu trước.'); return; }

        el.btnLay.disabled = true;
        try {
            setStatus('Mở “Lấy link hàng loạt”…');
            const modal = await openBatchAndWait();
            if (!modal) { setStatus('Không mở được modal “Lấy link hàng loạt”.'); return; }

            setStatus('Đang bấm “Lấy link”…');
            const ok = await clickLayLinkAndWaitClose();
            setStatus(ok ? 'Xong. Shopee đang tải CSV — kiểm tra Downloads.' : 'Không bấm được “Lấy link”. Thử lại.');
        } finally {
            el.btnLay.disabled = false;
        }
    }

    /* ===== Bind ===== */
    el.start.onclick = runSelectOnly;
    el.btnLay.onclick = runOpenAndLayLink;
})();