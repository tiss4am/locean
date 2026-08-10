document.addEventListener('DOMContentLoaded', function () {
  var heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.playsInline = true;

    var tryPlay = function () {
      var playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(function () {
          var resumeOnInteraction = function () {
            heroVideo.play();
            document.removeEventListener('click', resumeOnInteraction);
            document.removeEventListener('touchstart', resumeOnInteraction);
          };
          document.addEventListener('click', resumeOnInteraction, { once: true });
          document.addEventListener('touchstart', resumeOnInteraction, { once: true });
        });
      }
    };

    if (heroVideo.readyState >= 2) {
      tryPlay();
    } else {
      heroVideo.addEventListener('loadeddata', tryPlay, { once: true });
    }
  }

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

  // ---- Formulaires réservation / contact ----
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
  wireForm('contactForm', 'contactNote');

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
