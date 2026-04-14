$(document).ready(function() {

   /* FUNGSI 1: SCROLL REVEAL (LOGIKA ANIMASI) */
   function initScrollReveal() {
      const staggerDelay = 0.15; // Jeda antar elemen muncul

      const observer = new IntersectionObserver((entries) => {
         const incoming = entries.filter(entry => entry.isIntersecting);

         incoming.forEach((entry, index) => {
            const el = entry.target;
            // Memberi delay otomatis
            el.style.transitionDelay = `${index * staggerDelay}s`;
            // Aktifkan animasi
            $(el).addClass('is-visible');
            // Berhenti mengamati jika sudah muncul
            observer.unobserve(el);
         });
      }, {
         root: null,
         rootMargin: '0px 0px -10% 0px',
         threshold: 0.1
      });

      // Cari semua class .reveal dan amati
      $('.reveal').each(function() {
         observer.observe(this);
      });
   }

   /* FUNGSI 2: PENGATUR PRELOADER */
   function removePreloader() {
      if ($('#preloader').length) {
         $('#preloader').fadeOut(600, function() {
            $(this).remove(); 
            initScrollReveal(); // Jalankan animasi setelah loading hilang
         });
      }
   }if (document.readyState === 'complete') {
      removePreloader();
   } else {
      $(window).on('load', function() {
         removePreloader();
      });
   }
   
   //membuat header sticky scroll ke atas dan muncul kembali saat scroll top 120px
   const $header = $('.main-header');
   const $window = $(window);
   $(window).on('scroll', function() {
      if ($(window).scrollTop() > 200) {
         $('.main-header').addClass('is-sticky');
      } else {
         $('.main-header').removeClass('is-sticky');
      }
   });
   
   // Hamburger menu toggle & Sidebar logic
   $('.hamburger-menu').click(function() {
      var $sidebar = $('.sidebar-menu');
      var $hamburger = $(this);
      var $html = $('html');
      $('.sidebar-overlay').toggleClass('active');
   
      if (!$sidebar.hasClass('active')) {
         
         $hamburger.addClass('active');
         $html.addClass('no-scroll');
         $sidebar.addClass('active');
      
      // (Kode kloning Anda tetap di sini)
         if ($sidebar.find('.nav-link-item').length === 0) {
            $('.navigasi a').clone().addClass('nav-link-item').prependTo($sidebar);
            //$('.icon-sosialmedia a').clone().addClass('sosmed-link-item').appendTo('.wrapper-sosmed');
         }
   
            // Jalankan animasi masuk bertahap
            $sidebar.find('a, p').each(function(i) {
               $(this).css('animation-delay', (i * 0.1) + 's');
            });
         } else {
         // LOGIKA MENUTUP (Perbaikan)
         $hamburger.removeClass('active');
         $html.removeClass('no-scroll');
         setTimeout(function() {
            $sidebar.removeClass('active');
         }, 0); 
      }
   });
   //membuat sidebar close saat di pencet di luar header dan navbar. close saat di click do link menu.
   $(document).on('click', function(event) {
      $('.sidebar-menu a').on('click', function() {
         $('.sidebar-menu').removeClass('active');
         $('.sidebar-overlay').removeClass('active');
         $('.hamburger-menu').removeClass('active');
         $('html').removeClass('no-scroll');
      })
    // 1. Ambil target elemen yang diklik
    const target = $(event.target);
    // 2. Cek apakah klik BUKAN di dalam .header dan BUKAN di dalam .sidebar
    // .closest() akan mengecek apakah elemen yang diklik atau induknya adalah elemen tersebut
    if (!target.closest('.main-header').length && !target.closest('.sidebar-menu').length) {
    // 3.Jika menu sedang terbuka, tutup semuanya
    if ($(".sidebar-menu").hasClass("active")) {
        $(".sidebar-menu").removeClass("active");
        $(".hamburger-menu").removeClass("active");
        $('.sidebar-overlay').removeClass("active");
        $("html").removeClass("no-scroll");
         }
      }
   });
   // animasi on load halaman html
    $('.animate-on-load').each(function(index) {
        const element = $(this);
        setTimeout(() => {
            element.addClass('fade-in-up');
        }, 500 + (index * 150)); 
    });
   
});
