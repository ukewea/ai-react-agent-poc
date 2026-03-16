const { chromium } = require('/opt/node22/lib/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleErrors = [];
  const consoleWarnings = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
    if (msg.type() === 'warning') consoleWarnings.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(`[PageError] ${err.message}`));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // ── 1. Verify window.__presentation exists ──────────────────────────────
  const hasPresentation = await page.evaluate(() => typeof window.__presentation !== 'undefined');
  console.log('\n=== window.__presentation exists:', hasPresentation);
  if (!hasPresentation) {
    console.log('FATAL: window.__presentation not found. Aborting.');
    await browser.close();
    return;
  }

  // ── 2. listSlides() ─────────────────────────────────────────────────────
  const slides = await page.evaluate(() => window.__presentation.listSlides());
  console.log('\n=== listSlides() output:');
  console.log(JSON.stringify(slides, null, 2));

  const slideCount = slides.length;

  // ── 3. Per-slide inspection ──────────────────────────────────────────────
  const COMMON_TESTIDS = ['nav-prev', 'nav-next', 'notes-toggle', 'nav-slide-name', 'nav-counter'];

  // Derive expected content testid from slide id
  function contentTestId(slide) {
    // Try slide-content-{id} pattern first
    return `slide-content-${slide.id}`;
  }

  console.log('\n=== Per-slide checklist ===');

  for (let i = 0; i < slideCount; i++) {
    const slide = slides[i];
    console.log(`\n--- Slide ${i}: id="${slide.id}" name="${slide.name}" ---`);

    await page.evaluate((idx) => window.__presentation.goTo(idx), i);
    // Short wait for React to re-render
    await page.waitForTimeout(300);

    // Check data-testid="slide"
    const slideEl = page.locator('[data-testid="slide"]');
    const slideCount2 = await slideEl.count();
    const slideExists = slideCount2 > 0;

    let slideIdMatch = false;
    let slideIndexMatch = false;

    if (slideExists) {
      const dataSlideId = await slideEl.first().getAttribute('data-slide-id');
      const dataSlideIndex = await slideEl.first().getAttribute('data-slide-index');
      slideIdMatch = dataSlideId === slide.id;
      slideIndexMatch = parseInt(dataSlideIndex, 10) === i;
      console.log(`  [slide element]        ${slideExists ? 'PASS' : 'FAIL'} (found: ${slideCount2})`);
      console.log(`  [data-slide-id]        ${slideIdMatch ? 'PASS' : 'FAIL'} (expected: "${slide.id}", got: "${dataSlideId}")`);
      console.log(`  [data-slide-index]     ${slideIndexMatch ? 'PASS' : 'FAIL'} (expected: ${i}, got: "${dataSlideIndex}")`);
    } else {
      console.log(`  [slide element]        FAIL (not found)`);
    }

    // Check common nav testids
    for (const tid of COMMON_TESTIDS) {
      const el = page.locator(`[data-testid="${tid}"]`);
      const cnt = await el.count();
      console.log(`  [${tid}]${' '.repeat(Math.max(1, 28 - tid.length))}${cnt > 0 ? 'PASS' : 'FAIL'} (count: ${cnt})`);
    }

    // Check content-specific testid
    const ctid = contentTestId(slide);
    const cel = page.locator(`[data-testid="${ctid}"]`);
    const ccnt = await cel.count();
    if (ccnt === 0) {
      // Try to find any slide-content-* testid present
      const anyContent = await page.evaluate(() => {
        const els = document.querySelectorAll('[data-testid]');
        const found = [];
        for (const el of els) {
          const tid = el.getAttribute('data-testid');
          if (tid && tid.startsWith('slide-content')) found.push(tid);
        }
        return found;
      });
      console.log(`  [${ctid}]${' '.repeat(Math.max(1, 28 - ctid.length))}FAIL (not found)`);
      if (anyContent.length > 0) {
        console.log(`    -> Found alternative slide-content testids: ${anyContent.join(', ')}`);
      } else {
        console.log(`    -> No slide-content-* testids found on this slide`);
      }
    } else {
      console.log(`  [${ctid}]${' '.repeat(Math.max(1, 28 - ctid.length))}PASS (count: ${ccnt})`);
    }

    // Also dump all data-testid values present for reference
    const allTestIds = await page.evaluate(() => {
      const els = document.querySelectorAll('[data-testid]');
      return Array.from(els).map(el => el.getAttribute('data-testid'));
    });
    console.log(`  [all testids on page]  ${allTestIds.join(', ')}`);
  }

  // ── 4. Keyboard navigation: ArrowRight x3, expect index 3 ───────────────
  console.log('\n=== Keyboard navigation test ===');
  // Go to slide 0 first
  await page.evaluate(() => window.__presentation.goTo(0));
  await page.waitForTimeout(300);

  // Focus the page so keyboard events are received
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);

  const afterKeyNav = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="slide"]');
    if (!el) return { found: false };
    return {
      found: true,
      slideId: el.getAttribute('data-slide-id'),
      slideIndex: el.getAttribute('data-slide-index'),
    };
  });

  const navIndex = parseInt(afterKeyNav.slideIndex, 10);
  const keyNavPass = afterKeyNav.found && navIndex === 3;
  console.log(`  After 3x ArrowRight from slide 0:`);
  console.log(`  slide-id="${afterKeyNav.slideId}", slide-index=${afterKeyNav.slideIndex}`);
  console.log(`  Expected index 3 -> ${keyNavPass ? 'PASS' : 'FAIL'}`);

  // ── 5. Notes toggle ──────────────────────────────────────────────────────
  console.log('\n=== Notes toggle test ===');
  // Ensure notes panel is NOT open first (go to slide 0 fresh)
  await page.evaluate(() => window.__presentation.goTo(0));
  await page.waitForTimeout(300);

  const notesBeforeClick = await page.locator('[data-testid="notes-panel"]').count();
  console.log(`  notes-panel before click: ${notesBeforeClick} (${notesBeforeClick === 0 ? 'not visible - correct' : 'already visible'})`);

  const toggleBtn = page.locator('[data-testid="notes-toggle"]');
  if (await toggleBtn.count() > 0) {
    await toggleBtn.first().click();
    await page.waitForTimeout(400);
    const notesAfterClick = await page.locator('[data-testid="notes-panel"]').count();
    const notesPass = notesAfterClick > 0;
    console.log(`  notes-panel after click:  ${notesAfterClick}`);
    console.log(`  Notes toggle -> ${notesPass ? 'PASS' : 'FAIL'}`);
  } else {
    console.log('  notes-toggle button not found -> FAIL');
  }

  // ── 6. goToId('closing') ────────────────────────────────────────────────
  console.log('\n=== goToId("closing") test ===');
  await page.evaluate(() => window.__presentation.goToId('closing'));
  await page.waitForTimeout(400);

  const closingSlide = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="slide"]');
    if (!el) return { found: false };
    return {
      found: true,
      slideId: el.getAttribute('data-slide-id'),
      slideIndex: el.getAttribute('data-slide-index'),
    };
  });

  // Find expected index for 'closing'
  const closingExpected = slides.find(s => s.id === 'closing');
  const closingIdMatch = closingSlide.found && closingSlide.slideId === 'closing';
  console.log(`  Result: slide-id="${closingSlide.slideId}", index=${closingSlide.slideIndex}`);
  console.log(`  Expected slide id "closing" (index ${closingExpected ? closingExpected.index ?? slides.findIndex(s => s.id === 'closing') : '?'})`);
  console.log(`  goToId("closing") -> ${closingIdMatch ? 'PASS' : 'FAIL'}`);

  // ── 7. Console errors summary ────────────────────────────────────────────
  console.log('\n=== Console errors & warnings ===');
  if (consoleErrors.length === 0) {
    console.log('  No JS errors detected.');
  } else {
    console.log('  ERRORS:');
    consoleErrors.forEach(e => console.log('    ' + e));
  }
  if (consoleWarnings.length === 0) {
    console.log('  No warnings detected.');
  } else {
    console.log('  WARNINGS:');
    consoleWarnings.forEach(w => console.log('    ' + w));
  }

  await browser.close();
})();
