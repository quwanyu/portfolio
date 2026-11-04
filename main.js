(function () {
  document.documentElement.classList.add('js');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  var items = document.querySelectorAll('.reveal');
  var revealNow = function (node) { node.classList.add('in'); };
  // 首屏元素直接显示，避免观察器回调延迟导致内容不可见
  Array.prototype.forEach.call(items, function (node) {
    if (node.getBoundingClientRect().top < window.innerHeight) revealNow(node);
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealNow(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    Array.prototype.forEach.call(items, function (node) {
      if (!node.classList.contains('in')) io.observe(node);
    });
  } else {
    Array.prototype.forEach.call(items, revealNow);
  }

  var form = document.getElementById('ctaForm');
  var note = document.getElementById('formNote');
  if (form && note) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      note.textContent = '示例表单未接入任何服务，请替换为真实链接或使用第三方表单服务。';
      form.reset();
    });
  }

  // 轮播图
  var carousel = document.getElementById('carousel');
  if (carousel) {
    var track = document.getElementById('carouselTrack');
    var slides = track.children;
    var total = slides.length;
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');
    var dotsWrap = document.getElementById('carouselDots');
    var current = 0;
    var autoTimer = null;
    var AUTO_INTERVAL = 4000;
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 生成指示点
    for (var i = 0; i < total; i++) {
      (function (idx) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', '第 ' + (idx + 1) + ' 张');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', function () { goTo(idx); restartAuto(); });
        dotsWrap.appendChild(dot);
      })(i);
    }
    var dots = dotsWrap.children;

    function update() {
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      for (var i = 0; i < total; i++) {
        dots[i].classList.toggle('active', i === current);
      }
    }
    function goTo(idx) {
      current = (idx + total) % total;
      update();
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    prevBtn.addEventListener('click', function () { prev(); restartAuto(); });
    nextBtn.addEventListener('click', function () { next(); restartAuto(); });

    // 自动播放
    function startAuto() {
      if (prefersReduced) return;
      stopAuto();
      autoTimer = setInterval(next, AUTO_INTERVAL);
    }
    function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
    function restartAuto() { stopAuto(); startAuto(); }

    // 鼠标悬停暂停
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    // 触摸滑动
    var startX = 0, deltaX = 0, dragging = false;
    track.addEventListener('touchstart', function (e) {
      dragging = true; startX = e.touches[0].clientX; deltaX = 0;
      stopAuto();
    }, { passive: true });
    track.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });
    track.addEventListener('touchend', function () {
      if (!dragging) return;
      dragging = false;
      if (Math.abs(deltaX) > 45) { deltaX < 0 ? next() : prev(); }
      startAuto();
    });

    // 键盘左右
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { prev(); restartAuto(); }
      if (e.key === 'ArrowRight') { next(); restartAuto(); }
    });

    startAuto();
  }
})();
