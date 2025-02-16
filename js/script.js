'use strict';
 
window.addEventListener('DOMContentLoaded', () => {

    function scrollUp() {
        const offset = 100,
              scrollUp = document.querySelector('.scroll-up'),
              scrollUpSvgPath = document.querySelector('.scroll-up__path'),
              pathLength = scrollUpSvgPath.getTotalLength();
    
        scrollUpSvgPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
        scrollUpSvgPath.style.transition = 'stroke-dashoffset 20ms';
    
        const getTop = () => window.scrollY || document.documentElement.scrollTop;//считает количество пикселей от верха    
        
        //просчитывает заливку svg (по мере скролла заливается больший процент иконки)
        const updateDashOffset = () => {
            const height = document.documentElement.scrollHeight - window.innerHeight;//разница между высотой скролла и высотой окна
            const dashOffset = pathLength - (getTop() * pathLength / height);
            scrollUpSvgPath.style.strokeDashoffset = dashOffset;
        };
    
        //on scroll (отвечает за появление кнопки на странице)
        window.addEventListener('scroll', () => {
            updateDashOffset();
    
            if (getTop() > offset) {
                scrollUp.classList.add('scroll-up--active');
            } else {
                scrollUp.classList.remove('scroll-up--active');
            }        
        });
    
    
        //нажатие на кнопку и плавный скролл вверх
        scrollUp.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        });
    } 

    scrollUp();

    const modalTriggers = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal'),
          modalCloseBtn = document.querySelector('[data-close]');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';//запрещаем скрол страницы под модальным окном
        if (modalTimerId) {
            clearInterval(modalTimerId);//если пользователь уже открывал окно, оно не будет открываться по истечению интервала (убрать строку, если не используется открытие по таймеру)
        }
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modalTriggers.forEach(btnOpen => {
        btnOpen.addEventListener('click', openModal);
    });

    modalCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {//при клике на подложку модальное окно закроется
        if (e.target === modal) {
            closeModal();
        }        
    });

    document.addEventListener('keydown', (e) => {//закрытие при клике на Escape
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
        
    const modalTimerId = setTimeout(openModal, 9000); //открытие окна после 9 секунд

    //открытие модального окна при пролистывании страницы вниз до конца, сработает обработчик только один раз
    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);//удаляем обработчик события, если уже 1 раз при скролле до конца страницы окно открывалось
        }
    }

    //window.addEventListener('scroll', showModalByScroll);   

});