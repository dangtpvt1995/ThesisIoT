$(document).ready(function () {
    //Active link
    var path = window.location.pathname.split("/").pop();
    if(path == ''){
      path='/';
    }
    $('nav.navCustom ul.custom>li>a[href="'+path+'"]').parent().addClass('active');
});  