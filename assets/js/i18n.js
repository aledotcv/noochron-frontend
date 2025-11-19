(function(){
  var translations={
    es:{
      brand:"noochron",
      language:{label:"Idioma",es:"Español",en:"Inglés"},
      greeting:{hi:"Hola"},
      login:{
        title:"Inicia sesión en Noochron",
        usernameLabel:"Nombre de usuario",
        usernamePlaceholder:"Tu nombre de usuario",
        passwordLabel:"Contraseña",
        submit:"Iniciar sesión",
        forgot:"Olvidé la contraseña",
        noAccount:"¿No tienes una cuenta?",
        signup:"Regístrate"
      },
      register:{
        title:"Crea una cuenta en Noochron",
        usernameLabel:"¿Cuál será tu nombre de usuario?",
        passwordLabel:"Crea una contraseña",
        emailLabel:"¿Cuál es tu correo electrónico?",
        emailPlaceholder:"Tu correo electrónico",
        submit:"Regístrate",
        haveAccount:"¿Ya tienes una cuenta?",
        login:"Inicia sesión"
      },
      navbar:{
        placeholder:"🔎 Busca tus notas",
        byTitle:"Por título",
        byContent:"Por contenido",
        byTags:"Por etiquetas",
        clear:"Limpiar",
        search:"Buscar"
      },
      sort:{
        title:"Ordenar notas",
        newest:"Más recientes",
        oldest:"Más antiguas"
      },
      modal:{
        titlePlaceholder:"Título",
        contentLabel:"Contenido:",
        tagsLabel:"Etiquetas:",
        tagsPlaceholder:"Etiquetas",
        save:"Guardar",
        delete:"Eliminar",
        addReminder:"Añadir Recordatorio",
        confirmClose:"¿Deseas cerrar sin guardar los cambios?"
      }
    },
    en:{
      brand:"noochron",
      language:{label:"Language",es:"Spanish",en:"English"},
      greeting:{hi:"Hey"},
      login:{
        title:"Sign in on Noochron",
        usernameLabel:"Username",
        usernamePlaceholder:"Your username",
        passwordLabel:"Password",
        submit:"Sign in",
        forgot:"Forgot password",
        noAccount:"Don't have an account?",
        signup:"Sign up"
      },
      register:{
        title:"Create a Noochron account",
        usernameLabel:"What will be your username?",
        passwordLabel:"Create a password",
        emailLabel:"What is your email?",
        emailPlaceholder:"Your email",
        submit:"Sign up",
        haveAccount:"Already have an account?",
        login:"Log in"
      },
      navbar:{
        placeholder:"🔎 Search your notes",
        byTitle:"By title",
        byContent:"By content",
        byTags:"By tags",
        clear:"Clear",
        search:"Search"
      },
      sort:{
        title:"Sort notes",
        newest:"Newest",
        oldest:"Oldest"
      },
      modal:{
        titlePlaceholder:"Title",
        contentLabel:"Content:",
        tagsLabel:"Tags:",
        tagsPlaceholder:"Tags",
        save:"Save",
        delete:"Delete",
        addReminder:"Add reminder",
        confirmClose:"Do you want to close without saving changes?"
      }
    }
  };
  function getLang(){
    var l=localStorage.getItem('lang');
    if(l==='es'||l==='en') return l;
    var nav=(navigator.language||'es').toLowerCase();
    return nav.startsWith('en')?'en':'es';
  }
  function setLang(l){
    if(l!=='es'&&l!=='en') return;
    localStorage.setItem('lang',l);
  }
  function t(key){
    var lang=getLang();
    var obj=translations[lang];
    var parts=key.split('.');
    for(var i=0;i<parts.length;i++){
      if(obj && Object.prototype.hasOwnProperty.call(obj,parts[i])) obj=obj[parts[i]]; else {obj=null;break;}
    }
    return (obj==null?key:String(obj));
  }
  function applyTranslations(){
    var lang=getLang();
    var nodes=document.querySelectorAll('[data-i18n]');
    nodes.forEach(function(el){
      var key=el.getAttribute('data-i18n');
      el.textContent=t(key);
    });
    var placeholders=document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(function(el){
      var key=el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder',t(key));
    });
    var opts=document.querySelectorAll('#languageSelect option[data-i18n]');
    opts.forEach(function(opt){
      var key=opt.getAttribute('data-i18n');
      opt.textContent=t(key);
    });
    var label=document.querySelector('label[for="languageSelect"][data-i18n]');
    if(label){label.textContent=t(label.getAttribute('data-i18n'));}
    var sel=document.getElementById('languageSelect');
    if(sel){sel.value=lang; sel.setAttribute('aria-label',t('language.label'));}
  }
  function initLanguageSelector(){
    var sel=document.getElementById('languageSelect');
    if(!sel) return;
    sel.addEventListener('change',function(){
      var l=sel.value;
      setLang(l);
      applyTranslations();
    });
  }
  document.addEventListener('DOMContentLoaded',function(){
    applyTranslations();
    initLanguageSelector();
  });
  window.i18n={getLang:getLang,setLang:setLang,apply:applyTranslations,t:t};
})();