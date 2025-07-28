app.labels.errors.inputs.passwordMatch = {
    fr: 'Les mots de passe ne correspondent pas',
    en: 'Passwords do not match'
}

document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");

let viewportPaddingTop = 0;
if (document.querySelector('.headerFW '))
    viewportPaddingTop += parseInt(window.getComputedStyle(document.querySelector('.headerFW ')).height );
if (document.querySelector('.mod_breadcrumb '))
    viewportPaddingTop += parseInt(window.getComputedStyle(document.querySelector('.mod_breadcrumb ')).height );
viewportPaddingTop += 'px';
document.documentElement.style.setProperty('--viewport-padding-top',viewportPaddingTop );

$(function () {
  // INIT
    $(window).resize(function () {
        // $('body.home .heroFW').css('height',viewport.height - $('#header').outerHeight());

        if ($('.mod_faqpage .accordionFW').length) {
            resizeFAQ();
        }
        if ($('table.calendar').length) {
            toggleCalendarEventView();
        }
    });

    $('.mod_wem_locations_map').attr('id','mapWrapper');

    $('table.calendar').each(function (index,$calendar) {
        $calendar = $($calendar);
        // $calendar.find('tr').each(function(index,row){
        //     $(row).find('.event').each(function(index,event){
        //         if ($('.event[data-event='+event.getAttribute('data-event')+']').length>1) {
        //             $($('.event[data-event='+event.getAttribute('data-event')+']').slice(1)).addClass('hidden');
        //             // $($('.event[data-event='+event.getAttribute('data-event')+']').slice(0,-1)).addClass('hidden');
        //             $('.event[data-event='+event.getAttribute('data-event')+']').first().addClass('span-'+$('.event[data-event='+event.getAttribute('data-event')+']').length);
        //         }
        //     })
        // });
        $calendar.find('.event').not('.hidden').each(function (index,event) {
            setTimeout(function () {
                $(event).addClass('active');
            },100*index);
        });
        $calendar.prev('.loader').remove();
    });
    $('.calendar__event').each(function () {
        $(this).css('background-color',utils.stringToColor($(this).text()));
    });

    $('.password-checker').each(function(){
        var $checker = $(this);
        var $input   = $checker.find('input[type=password][name]');
        var $confirm  = $checker.find('input[type=password].confirm');
        var $helper  = $checker.find('.helper');
        $checker.find('input+button').on('click',function(){
            $(this).find('i[class*=fa]').toggleClass('fa-eye fa-eye-slash');
            $(this).prev('input').attr('type',($(this).prev('input').attr('type') == 'password' ? 'text':'password'));
        });
        $input.on('change keyup',function(){
            $helper.find('[pattern]').each(function(){
                $(this).removeClass('valid');
                var reg = new RegExp(this.getAttribute('pattern'));
                if ($input.val().search(reg) != -1)
                    $(this).addClass('valid');
            });
        });
        $checker.find('input').on('change keyup',function(){
            $confirm.get(0).setCustomValidity('');
            if ($input.val() !== $confirm.val())
                $confirm.get(0).setCustomValidity(app.labels.errors.inputs.passwordMatch[app.lang]);
        })
    })

    var setupLightbox = function(el){
        var item = $(el);
        item.attr('data-lightbox',item.attr('data-lightbox')!=""?item.attr('data-lightbox'):utils.uniqid());
        item.attr('data-modal',item.attr('data-lightbox'));
        if ($('a[data-lightbox='+item.attr('data-lightbox')+']').length > 1) {
            $('a[data-lightbox='+item.attr('data-lightbox')+']').each(function(i){
                $(this).attr('data-gallery',$(this).attr('data-lightbox'));
                $(this).attr('data-modal',$(this).attr('data-lightbox')+'__'+i);
            });
        } else {
            item.attr('data-modal',$(this).attr('data-lightbox'));
        }
    }
    $('a[data-lightbox]').each(function(){
        setupLightbox(this);
    })

    $('a[data-lightbox]').each(function(){
        app.ModalFW.createModalFromTrigger(this);
    })
    utils.addHtmlHook('a[data-lightbox]', function(item){
        $(item).each(function(){
            if(app.ModalFW.debug) app.log("Trigger added to dom for modal "+$(this).data('modal'));
            setupLightbox(this);
        })
        $(item).each(function(){
            app.ModalFW.createModalFromTrigger(this);
        })
    });

    // encapsulate iframe in 16:9 box
    $('.mod_article iframe').not('.custom').each(function(){
        if (!$(this).parent().hasClass('img-container')) 
            $(this).wrapAll('<div class="img-container r_16-9"></div>');
    });

    $('#smartgearDisclaimer .close').on('click',function(){
        $('#smartgearDisclaimer').fadeOut();
    })
});

var toggleCalendarEventView = function toggleCalendarEventView()
{
    $('table.calendar').find('.days.active').each(function (index,$day) {
        $day = $($day);
        var offseted = false;
        $day.find('.event').not('.hidden').unwrap('.reduced').each(function () {
            if ($(this).position().top <= 0) {
                offseted = true;
            }
        });
        if (offseted) {
            $day.find('.event').not('.hidden').wrapAll('<div class="reduced"></div>');
        }
    });
};

var resizeFAQ = function resizeFAQ()
{
    var $titles = $('.mod_faqpage .accordionFW__item .accordionFW__title').css('width','auto');
    var maxWidth = 0;
    $titles.each(function () {
        if (this.scrollWidth+10 > maxWidth) {
            maxWidth = this.scrollWidth+10;
        }
    });
    $titles.outerWidth(maxWidth);
}
