/*!
 * 운명나침반 PDF 내보내기 (pdf-export.js)
 * 책 DOM(.pdf-page) → 실제 PDF 바이너리
 * - html2canvas로 페이지를 이미지로 렌더링 → jsPDF(A4)로 조립
 * - 한글 폰트 임베딩 없이도 모바일 사파리·크롬·PC에서 동일하게 열리는 방식
 */
(function (global) {
  'use strict';

  var A4_W = 210, A4_H = 297;

  function libsReady() {
    return typeof global.html2canvas === 'function' && global.jspdf && global.jspdf.jsPDF;
  }

  function waitFonts() {
    if (document.fonts && document.fonts.ready) {
      return document.fonts.ready.then(function () { return true; });
    }
    return Promise.resolve(true);
  }

  function nextFrame() {
    return new Promise(function (resolve) {
      requestAnimationFrame(function () { setTimeout(resolve, 0); });
    });
  }

  /**
   * @param {HTMLElement} bookRoot .pdf-book 루트
   * @param {Object} opts { onProgress(done, total) }
   * @returns {Promise<{blob:Blob, pages:number}>}
   */
  async function toPdf(bookRoot, opts) {
    opts = opts || {};
    if (!libsReady()) throw new Error('PDF_ENGINE_MISSING');

    await waitFonts();
    var pages = Array.prototype.slice.call(bookRoot.querySelectorAll('.pdf-page'));
    if (!pages.length) throw new Error('PDF_NO_PAGES');

    var jsPDFCtor = global.jspdf.jsPDF;
    var doc = new jsPDFCtor({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    var scale = opts.scale || 1.5;

    for (var i = 0; i < pages.length; i++) {
      var page = pages[i];
      var canvas = await global.html2canvas(page, {
        scale: scale,
        backgroundColor: '#fffdf8',
        useCORS: true,
        logging: false,
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
        scrollX: 0,
        scrollY: 0
      });
      var data = canvas.toDataURL('image/jpeg', 0.86);
      if (i > 0) doc.addPage();
      doc.addImage(data, 'JPEG', 0, 0, A4_W, A4_H, undefined, 'FAST');
      if (opts.onProgress) opts.onProgress(i + 1, pages.length);
      await nextFrame();
    }

    var blob = doc.output('blob');
    return { blob: blob, pages: pages.length };
  }

  function saveBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      if (a.parentNode) a.parentNode.removeChild(a);
    }, 800);
    // iOS는 자동 다운로드가 막히는 경우가 있어 URL을 잠시 살려둔다.
    setTimeout(function () { URL.revokeObjectURL(url); }, 120000);
    return url;
  }

  global.PdfExport = {
    toPdf: toPdf,
    saveBlob: saveBlob,
    libsReady: libsReady
  };
})(window);
