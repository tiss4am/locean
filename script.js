document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Formulaire réservation ----
  // Pas de backend branché : on affiche juste une confirmation visuelle.
  var resDate = document.getElementById('resDate');
  if (resDate) {
    resDate.min = new Date().toISOString().split('T')[0];
  }

  function wireForm(formId, noteId) {
    var form = document.getElementById(formId);
    var note = document.getElementById(noteId);
    if (!form || !note) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      note.hidden = false;
      form.reset();
    });
  }

  wireForm('reservationForm', 'reservationNote');

  // ---- Heure souhaitée (réservation) ----
  var timeRow = document.getElementById('timeRow');
  if (timeRow) {
    timeRow.querySelectorAll('.time-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        timeRow.querySelectorAll('.time-btn').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
      });
    });
  }

  // ---- Carousel avis clients (accueil) ----
  document.querySelectorAll('[data-carousel-arrows]').forEach(function (wrap) {
    var target = document.getElementById(wrap.getAttribute('data-carousel-arrows'));
    if (!target) return;
    wrap.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = parseInt(btn.getAttribute('data-dir'), 10) || 1;
        var card = target.querySelector(':scope > *');
        var amount = card ? card.getBoundingClientRect().width + 24 : 300;
        target.scrollBy({ left: dir * amount, behavior: 'smooth' });
      });
    });
  });

  // ---- Sélecteur "Nos spécialités" (accueil) ----
  var specialtyPhoto = document.getElementById('specialtyPhoto');
  var specThumbs = document.getElementById('specThumbs');
  if (specialtyPhoto && specThumbs) {
    var thumbs = Array.prototype.slice.call(specThumbs.querySelectorAll('.thumb'));

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        thumbs.forEach(function (t) { t.classList.remove('is-active'); });
        thumb.classList.add('is-active');
        specialtyPhoto.src = thumb.getAttribute('data-photo');
      });
    });

    function activateRelative(delta) {
      var idx = thumbs.findIndex(function (t) { return t.classList.contains('is-active'); });
      var next = (idx + delta + thumbs.length) % thumbs.length;
      thumbs[next].click();
    }

    var specPrev = document.getElementById('specPrev');
    var specNext = document.getElementById('specNext');
    if (specPrev) specPrev.addEventListener('click', function () { activateRelative(-1); });
    if (specNext) specNext.addEventListener('click', function () { activateRelative(1); });
  }

  // ---- Filtres de la carte (menu.html) ----
  var menuFilters = document.getElementById('menuFilters');
  var menuGrid = document.getElementById('menuGrid');
  if (menuFilters && menuGrid) {
    var menuCards = Array.prototype.slice.call(menuGrid.querySelectorAll('.menu-card'));
    menuFilters.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        menuFilters.querySelectorAll('button').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var filter = btn.getAttribute('data-filter');
        menuCards.forEach(function (card) {
          var show = filter === 'tout' || card.getAttribute('data-category') === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // ---- Fiche produit (menu.html) ----
  var productModal = document.getElementById('productModal');
  if (productModal) {
    var pmPhoto = document.getElementById('productModalPhoto');
    var pmName = document.getElementById('productModalName');
    var pmDesc = document.getElementById('productModalDesc');
    var pmPrice = document.getElementById('productModalPrice');
    var pmClose = document.getElementById('productModalClose');

    document.querySelectorAll('.menu-card__add').forEach(function (btn) {
      btn.addEventListener('click', function () {
        pmPhoto.src = btn.getAttribute('data-photo');
        pmPhoto.alt = btn.getAttribute('data-name') || '';
        pmName.textContent = btn.getAttribute('data-name');
        pmDesc.textContent = btn.getAttribute('data-desc');
        pmPrice.textContent = btn.getAttribute('data-price');
        productModal.classList.add('is-open');
        productModal.setAttribute('aria-hidden', 'false');
      });
    });

    function closeProductModal() {
      productModal.classList.remove('is-open');
      productModal.setAttribute('aria-hidden', 'true');
    }
    if (pmClose) pmClose.addEventListener('click', closeProductModal);
    productModal.addEventListener('click', function (e) {
      if (e.target === productModal) closeProductModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeProductModal();
    });
  }

  // ---- Lightbox galerie ----
  var lightbox = document.getElementById('lightbox');
  var galleryFigures = Array.prototype.slice.call(document.querySelectorAll('.gallery-grid figure'));

  if (lightbox && galleryFigures.length) {
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxClose = document.getElementById('lightboxClose');
    var lightboxPrev = document.getElementById('lightboxPrev');
    var lightboxNext = document.getElementById('lightboxNext');
    var currentIndex = 0;

    function showImage(index) {
      currentIndex = (index + galleryFigures.length) % galleryFigures.length;
      var figure = galleryFigures[currentIndex];
      var img = figure.querySelector('img');
      var caption = figure.querySelector('figcaption');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = caption ? caption.textContent : '';
    }

    function openLightbox(index) {
      showImage(index);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
    }

    galleryFigures.forEach(function (figure, index) {
      figure.addEventListener('click', function () { openLightbox(index); });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function () { showImage(currentIndex - 1); });
    lightboxNext.addEventListener('click', function () { showImage(currentIndex + 1); });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }
});
