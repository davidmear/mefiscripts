!function(a,b){function c(a){return function(){return this[a]}}function d(a,b){var c=a.split("."),d=_;!(c[0]in d)&&d.execScript&&d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===b?d=d[e]?d[e]:d[e]={}:d[e]=b}function e(a){return a.call.apply(a.bind,arguments)}function f(a,b){if(!a)throw Error();if(2<arguments.length){var c=Array.prototype.slice.call(arguments,2);return function(){var d=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(d,c),a.apply(b,d)}}return function(){return a.apply(b,arguments)}}function g(){return g=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?e:f,g.apply(Z,arguments)}function h(a,b){this.G=a,this.v=b||a,this.z=this.v.document}function i(a,c,d){a=a.z.getElementsByTagName(c)[0],a||(a=b.documentElement),a&&a.lastChild&&a.insertBefore(d,a.lastChild)}function j(a,b,c){b=b||[],c=c||[];for(var d=a.className.split(/\s+/),e=0;e<b.length;e+=1){for(var f=$,g=0;g<d.length;g+=1)if(b[e]===d[g]){f=Y;break}f||d.push(b[e])}for(b=[],e=0;e<d.length;e+=1){for(f=$,g=0;g<c.length;g+=1)if(d[e]===c[g]){f=Y;break}f||b.push(d[e])}a.className=b.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}function k(a,b){for(var c=a.className.split(/\s+/),d=0,e=c.length;e>d;d++)if(c[d]==b)return Y;return $}function l(a){var b=a.v.location.protocol;return"about:"==b&&(b=a.G.location.protocol),"https:"==b?"https:":"http:"}function m(a,b){var c=a.createElement("link",{rel:"stylesheet",href:b}),d=$;c.onload=function(){d||(d=Y)},c.onerror=function(){d||(d=Y)},i(a,"head",c)}function n(b,c,d,e){var f=b.z.getElementsByTagName("head")[0];if(f){var g=b.createElement("script",{src:c}),h=$;return g.onload=g.onreadystatechange=function(){h||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(h=Y,d&&d(Z),g.onload=g.onreadystatechange=Z,"HEAD"==g.parentNode.tagName&&f.removeChild(g))},f.appendChild(g),a.setTimeout(function(){h||(h=Y,d&&d(Error("Script load timeout")))},e||5e3),g}return Z}function o(a,b,c){this.M=a,this.U=b,this.Aa=c}function p(a,b,c,d){this.d=a!=Z?a:Z,this.o=b!=Z?b:Z,this.aa=c!=Z?c:Z,this.f=d!=Z?d:Z}function q(a){a=bb.exec(a);var b=Z,c=Z,d=Z,e=Z;return a&&(a[1]!==Z&&a[1]&&(b=parseInt(a[1],10)),a[2]!==Z&&a[2]&&(c=parseInt(a[2],10)),a[3]!==Z&&a[3]&&(d=parseInt(a[3],10)),a[4]!==Z&&a[4]&&(e=/^[0-9]+$/.test(a[4])?parseInt(a[4],10):a[4])),new p(b,c,d,e)}function r(a,b,c,d,e,f,g,h,i,j,k){this.K=a,this.Ga=b,this.za=c,this.fa=d,this.Ea=e,this.ea=f,this.wa=g,this.Fa=h,this.va=i,this.da=j,this.j=k}function s(a,b){this.a=a,this.I=b}function t(a){var b=w(a.a,/(iPod|iPad|iPhone|Android|Windows Phone|BB\d{2}|BlackBerry)/,1);return""!=b?(/BB\d{2}/.test(b)&&(b="BlackBerry"),b):(a=w(a.a,/(Linux|Mac_PowerPC|Macintosh|Windows|CrOS)/,1),""!=a?("Mac_PowerPC"==a&&(a="Macintosh"),a):"Unknown")}function u(a){var b=w(a.a,/(OS X|Windows NT|Android) ([^;)]+)/,2);if(b||(b=w(a.a,/Windows Phone( OS)? ([^;)]+)/,2))||(b=w(a.a,/(iPhone )?OS ([\d_]+)/,2)))return b;if(b=w(a.a,/(?:Linux|CrOS) ([^;)]+)/,1))for(var b=b.split(/\s/),c=0;c<b.length;c+=1)if(/^[\d\._]+$/.test(b[c]))return b[c];return(a=w(a.a,/(BB\d{2}|BlackBerry).*?Version\/([^\s]*)/,2))?a:"Unknown"}function v(a){var b=t(a),c=u(a),d=q(c),e=w(a.a,/AppleWeb(?:K|k)it\/([\d\.\+]+)/,1),f=q(e),g="Unknown",h=new p,i="Unknown",j=$;return/OPR\/[\d.]+/.test(a.a)?g="Opera":-1!=a.a.indexOf("Chrome")||-1!=a.a.indexOf("CrMo")||-1!=a.a.indexOf("CriOS")?g="Chrome":/Silk\/\d/.test(a.a)?g="Silk":"BlackBerry"==b||"Android"==b?g="BuiltinBrowser":-1!=a.a.indexOf("PhantomJS")?g="PhantomJS":-1!=a.a.indexOf("Safari")?g="Safari":-1!=a.a.indexOf("AdobeAIR")&&(g="AdobeAIR"),"BuiltinBrowser"==g?i="Unknown":"Silk"==g?i=w(a.a,/Silk\/([\d\._]+)/,1):"Chrome"==g?i=w(a.a,/(Chrome|CrMo|CriOS)\/([\d\.]+)/,2):-1!=a.a.indexOf("Version/")?i=w(a.a,/Version\/([\d\.\w]+)/,1):"AdobeAIR"==g?i=w(a.a,/AdobeAIR\/([\d\.]+)/,1):"Opera"==g?i=w(a.a,/OPR\/([\d.]+)/,1):"PhantomJS"==g&&(i=w(a.a,/PhantomJS\/([\d.]+)/,1)),h=q(i),j="AdobeAIR"==g?2<h.d||2==h.d&&5<=h.o:"BlackBerry"==b?10<=d.d:"Android"==b?2<d.d||2==d.d&&1<d.o:526<=f.d||525<=f.d&&13<=f.o,new r(g,h,i,"AppleWebKit",f,e,b,d,c,x(a.I),new o(j,536>f.d||536==f.d&&11>f.o,"iPhone"==b||"iPad"==b||"iPod"==b||"Macintosh"==b))}function w(a,b,c){return(a=a.match(b))&&a[c]?a[c]:""}function x(a){return a.documentMode?a.documentMode:void 0}function y(a){this.ua=a||"-"}function z(a,b){this.K=a,this.V=4,this.L="n";var c=(b||"n4").match(/^([nio])([1-9])$/i);c&&(this.L=c[1],this.V=parseInt(c[2],10))}function A(a){return a.L+a.V}function B(a){var b=4,c="n",d=Z;return a&&((d=a.match(/(normal|oblique|italic)/i))&&d[1]&&(c=d[1].substr(0,1).toLowerCase()),(d=a.match(/([1-9]00|normal|bold)/i))&&d[1]&&(/bold/i.test(d[1])?b=7:/[1-9]00/.test(d[1])&&(b=parseInt(d[1].substr(0,1),10)))),c+b}function C(a,b,c){this.c=a,this.m=b,this.O=c,this.h="wf",this.g=new y("-")}function D(a){var b=k(a.m,a.g.f(a.h,"active")),c=[],d=[a.g.f(a.h,"loading")];b||c.push(a.g.f(a.h,"inactive")),j(a.m,c,d),E(a,"inactive")}function E(a,b,c){a.O[b]&&(c?a.O[b](c.getName(),A(c)):a.O[b]())}function F(){this.w={}}function G(a,b){this.c=a,this.C=b,this.s=this.c.createElement("span",{"aria-hidden":"true"},this.C)}function H(a,b){var c;c=[];for(var d=b.K.split(/,\s*/),e=0;e<d.length;e++){var f=d[e].replace(/['"]/g,"");c.push(-1==f.indexOf(" ")?f:"'"+f+"'")}c=c.join(","),d="normal",e=b.V+"00","o"===b.L?d="oblique":"i"===b.L&&(d="italic"),a.s.style.cssText="display:block;position:absolute;top:-999px;left:-999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:"+c+";"+("font-style:"+d+";font-weight:"+e+";")}function I(a){i(a.c,"body",a.s)}function J(a,b,c,d,e,f,g,h){this.W=a,this.sa=b,this.c=c,this.q=d,this.C=h||"BESbswy",this.j=e,this.F={},this.T=f||5e3,this.Z=g||Z,this.B=this.A=Z,a=new G(this.c,this.C),I(a);for(var i in db)db.hasOwnProperty(i)&&(H(a,new z(db[i],A(this.q))),this.F[db[i]]=a.s.offsetWidth);a.remove()}function K(a,b,c){for(var d in db)if(db.hasOwnProperty(d)&&b===a.F[db[d]]&&c===a.F[db[d]])return Y;return $}function L(a){var b=a.A.s.offsetWidth,c=a.B.s.offsetWidth;b===a.F.serif&&c===a.F["sans-serif"]||a.j.U&&K(a,b,c)?ab()-a.xa>=a.T?a.j.U&&K(a,b,c)&&(a.Z===Z||a.Z.hasOwnProperty(a.q.getName()))?M(a,a.W):M(a,a.sa):setTimeout(g(function(){L(this)},a),25):M(a,a.W)}function M(a,b){a.A.remove(),a.B.remove(),b(a.q)}function N(a,b,c,d){this.c=b,this.t=c,this.P=0,this.ba=this.Y=$,this.T=d,this.j=a.j}function O(a,b,c,d,e){if(0===b.length&&e)D(a.t);else for(a.P+=b.length,e&&(a.Y=e),e=0;e<b.length;e++){var f=b[e],h=c[f.getName()],i=a.t,k=f;j(i.m,[i.g.f(i.h,k.getName(),A(k).toString(),"loading")]),E(i,"fontloading",k),new J(g(a.ga,a),g(a.ha,a),a.c,f,a.j,a.T,d,h).start()}}function P(a){0==--a.P&&a.Y&&(a.ba?(a=a.t,j(a.m,[a.g.f(a.h,"active")],[a.g.f(a.h,"loading"),a.g.f(a.h,"inactive")]),E(a,"active")):D(a.t))}function Q(a){this.G=a,this.u=new F,this.ya=new s(a.navigator.userAgent,a.document),this.a=this.ya.parse(),this.Q=this.R=0}function R(a,b){this.c=a,this.e=b,this.k=[]}function S(a,b){this.c=a,this.e=b,this.k=[]}function T(a,b){this.c=a,this.e=b}function U(a,b,c){this.N=a?a:b+eb,this.p=[],this.S=[],this.ca=c||""}function V(a){this.p=a,this.$=[],this.J={}}function W(a,c){this.a=new s(navigator.userAgent,b).parse(),this.c=a,this.e=c}function X(a,b){this.c=a,this.e=b,this.k=[]}var Y=!0,Z=null,$=!1,_=this,ab=Date.now||function(){return+new Date};h.prototype.createElement=function(a,b,c){if(a=this.z.createElement(a),b)for(var d in b)b.hasOwnProperty(d)&&("style"==d?a.style.cssText=b[d]:a.setAttribute(d,b[d]));return c&&a.appendChild(this.z.createTextNode(c)),a},d("webfont.BrowserInfo",o),o.prototype.pa=c("M"),o.prototype.hasWebFontSupport=o.prototype.pa,o.prototype.qa=c("U"),o.prototype.hasWebKitFallbackBug=o.prototype.qa,o.prototype.ra=c("Aa"),o.prototype.hasWebKitMetricsBug=o.prototype.ra;var bb=/^([0-9]+)(?:[\._-]([0-9]+))?(?:[\._-]([0-9]+))?(?:[\._+-]?(.*))?$/;p.prototype.toString=function(){return[this.d,this.o||"",this.aa||"",this.f||""].join("")},d("webfont.UserAgent",r),r.prototype.getName=c("K"),r.prototype.getName=r.prototype.getName,r.prototype.oa=c("za"),r.prototype.getVersion=r.prototype.oa,r.prototype.ka=c("fa"),r.prototype.getEngine=r.prototype.ka,r.prototype.la=c("ea"),r.prototype.getEngineVersion=r.prototype.la,r.prototype.ma=c("wa"),r.prototype.getPlatform=r.prototype.ma,r.prototype.na=c("va"),r.prototype.getPlatformVersion=r.prototype.na,r.prototype.ja=c("da"),r.prototype.getDocumentMode=r.prototype.ja,r.prototype.ia=c("j"),r.prototype.getBrowserInfo=r.prototype.ia;var cb=new r("Unknown",new p,"Unknown","Unknown",new p,"Unknown","Unknown",new p,"Unknown",void 0,new o($,$,$));s.prototype.parse=function(){var a;if(-1!=this.a.indexOf("MSIE")||-1!=this.a.indexOf("Trident/")){a=t(this);var b=u(this),c=q(b),d=Z,e=Z,f=Z,g=Z,h=w(this.a,/Trident\/([\d\w\.]+)/,1),i=x(this.I),d=-1!=this.a.indexOf("MSIE")?w(this.a,/MSIE ([\d\w\.]+)/,1):w(this.a,/rv:([\d\w\.]+)/,1),e=q(d);""!=h?(f="Trident",g=q(h)):(f="Unknown",g=new p,h="Unknown"),a=new r("MSIE",e,d,f,g,h,a,c,b,i,new o("Windows"==a&&6<=e.d||"Windows Phone"==a&&8<=c.d,$,$))}else if(-1!=this.a.indexOf("Opera"))a:if(a="Unknown",b=w(this.a,/Presto\/([\d\w\.]+)/,1),c=q(b),d=u(this),e=q(d),f=x(this.I),c.d!==Z?a="Presto":(-1!=this.a.indexOf("Gecko")&&(a="Gecko"),b=w(this.a,/rv:([^\)]+)/,1),c=q(b)),-1!=this.a.indexOf("Opera Mini/"))g=w(this.a,/Opera Mini\/([\d\.]+)/,1),h=q(g),a=new r("OperaMini",h,g,a,c,b,t(this),e,d,f,new o($,$,$));else{if(-1!=this.a.indexOf("Version/")&&(g=w(this.a,/Version\/([\d\.]+)/,1),h=q(g),h.d!==Z)){a=new r("Opera",h,g,a,c,b,t(this),e,d,f,new o(10<=h.d,$,$));break a}g=w(this.a,/Opera[\/ ]([\d\.]+)/,1),h=q(g),a=h.d!==Z?new r("Opera",h,g,a,c,b,t(this),e,d,f,new o(10<=h.d,$,$)):new r("Opera",new p,"Unknown",a,c,b,t(this),e,d,f,new o($,$,$))}else/OPR\/[\d.]+/.test(this.a)?a=v(this):/AppleWeb(K|k)it/.test(this.a)?a=v(this):-1!=this.a.indexOf("Gecko")?(a="Unknown",b=new p,c="Unknown",d=u(this),e=q(d),f=$,-1!=this.a.indexOf("Firefox")?(a="Firefox",c=w(this.a,/Firefox\/([\d\w\.]+)/,1),b=q(c),f=3<=b.d&&5<=b.o):-1!=this.a.indexOf("Mozilla")&&(a="Mozilla"),g=w(this.a,/rv:([^\)]+)/,1),h=q(g),f||(f=1<h.d||1==h.d&&9<h.o||1==h.d&&9==h.o&&2<=h.aa||g.match(/1\.9\.1b[123]/)!=Z||g.match(/1\.9\.1\.[\d\.]+/)!=Z),a=new r(a,b,c,"Gecko",h,g,t(this),e,d,x(this.I),new o(f,$,$))):a=cb;return a},y.prototype.f=function(){for(var a=[],b=0;b<arguments.length;b++)a.push(arguments[b].replace(/[\W_]+/g,"").toLowerCase());return a.join(this.ua)},z.prototype.getName=c("K"),G.prototype.remove=function(){var a=this.s;a.parentNode&&a.parentNode.removeChild(a)};var db={Da:"serif",Ca:"sans-serif",Ba:"monospace"};J.prototype.start=function(){this.A=new G(this.c,this.C),I(this.A),this.B=new G(this.c,this.C),I(this.B),this.xa=ab(),H(this.A,new z(this.q.getName()+",serif",A(this.q))),H(this.B,new z(this.q.getName()+",sans-serif",A(this.q))),L(this)},N.prototype.ga=function(a){var b=this.t;j(b.m,[b.g.f(b.h,a.getName(),A(a).toString(),"active")],[b.g.f(b.h,a.getName(),A(a).toString(),"loading"),b.g.f(b.h,a.getName(),A(a).toString(),"inactive")]),E(b,"fontactive",a),this.ba=Y,P(this)},N.prototype.ha=function(a){var b=this.t,c=k(b.m,b.g.f(b.h,a.getName(),A(a).toString(),"active")),d=[],e=[b.g.f(b.h,a.getName(),A(a).toString(),"loading")];c||d.push(b.g.f(b.h,a.getName(),A(a).toString(),"inactive")),j(b.m,d,e),E(b,"fontinactive",a),P(this)},Q.prototype.load=function(a){var b=a.context||this.G;this.c=new h(this.G,b);var b=new C(this.c,b.document.documentElement,a),c=[],d=a.timeout;j(b.m,[b.g.f(b.h,"loading")]),E(b,"loading");var e,c=this.u,f=this.c,i=[];for(e in a)if(a.hasOwnProperty(e)){var k=c.w[e];k&&i.push(k(a[e],f))}for(c=i,this.Q=this.R=c.length,a=new N(this.a,this.c,b,d),e=0,d=c.length;d>e;e++)f=c[e],f.H(this.a,g(this.ta,this,f,b,a))},Q.prototype.ta=function(a,b,c,d){var e=this;d?a.load(function(a,b,d){var f=0==--e.R;setTimeout(function(){O(c,a,b||{},d||Z,f)},0)}):(a=0==--this.R,this.Q--,a&&0==this.Q&&D(b),O(c,[],{},Z,a))},R.prototype.D=function(a){return l(this.c)+(this.e.api||"//f.fontdeck.com/s/css/js/")+(this.c.v.location.hostname||this.c.G.location.hostname)+"/"+a+".js"},R.prototype.H=function(a,b){var c=this.e.id,d=this.c.v,e=this;c?(d.__webfontfontdeckmodule__||(d.__webfontfontdeckmodule__={}),d.__webfontfontdeckmodule__[c]=function(a,c){for(var d=0,f=c.fonts.length;f>d;++d){var g=c.fonts[d];e.k.push(new z(g.name,B("font-weight:"+g.weight+";font-style:"+g.style)))}b(a)},n(this.c,this.D(c),function(a){a&&b($)})):b($)},R.prototype.load=function(a){a(this.k)},S.prototype.D=function(a){var b=l(this.c);return(this.e.api||b+"//use.typekit.net")+"/"+a+".js"},S.prototype.H=function(a,b){var c=this.e.id,d=this.e,e=this.c.v,f=this;c?(e.__webfonttypekitmodule__||(e.__webfonttypekitmodule__={}),e.__webfonttypekitmodule__[c]=function(c){c(a,d,function(a,c,d){for(var e=0;e<c.length;e+=1){var g=d[c[e]];if(g)for(var h=0;h<g.length;h+=1)f.k.push(new z(c[e],g[h]));else f.k.push(new z(c[e]))}b(a)})},n(this.c,this.D(c),function(a){a&&b($)},2e3)):b($)},S.prototype.load=function(a){a(this.k)},T.prototype.load=function(a){var b,c,d=this.e.urls||[],e=this.e.families||[],f=this.e.testStrings||{};for(b=0,c=d.length;c>b;b++)m(this.c,d[b]);for(d=[],b=0,c=e.length;c>b;b++){var g=e[b].split(":");if(g[1])for(var h=g[1].split(","),i=0;i<h.length;i+=1)d.push(new z(g[0],h[i]));else d.push(new z(g[0]))}a(d,f)},T.prototype.H=function(a,b){return b(a.j.M)};var eb="//fonts.googleapis.com/css";U.prototype.f=function(){if(0==this.p.length)throw Error("No fonts to load!");if(-1!=this.N.indexOf("kit="))return this.N;for(var a=this.p.length,b=[],c=0;a>c;c++)b.push(this.p[c].replace(/ /g,"+"));return a=this.N+"?family="+b.join("%7C"),0<this.S.length&&(a+="&subset="+this.S.join(",")),0<this.ca.length&&(a+="&text="+encodeURIComponent(this.ca)),a};var fb={latin:"BESbswy",cyrillic:"&#1081;&#1103;&#1046;",greek:"&#945;&#946;&#931;",khmer:"&#x1780;&#x1781;&#x1782;",Hanuman:"&#x1780;&#x1781;&#x1782;"},gb={thin:"1",extralight:"2","extra-light":"2",ultralight:"2","ultra-light":"2",light:"3",regular:"4",book:"4",medium:"5","semi-bold":"6",semibold:"6","demi-bold":"6",demibold:"6",bold:"7","extra-bold":"8",extrabold:"8","ultra-bold":"8",ultrabold:"8",black:"9",heavy:"9",l:"3",r:"4",b:"7"},hb={i:"i",italic:"i",n:"n",normal:"n"},ib=RegExp("^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$");V.prototype.parse=function(){for(var a=this.p.length,b=0;a>b;b++){var c=this.p[b].split(":"),d=c[0].replace(/\+/g," "),e=["n4"];if(2<=c.length){var f,g=c[1];if(f=[],g)for(var g=g.split(","),h=g.length,i=0;h>i;i++){var j;if(j=g[i],j.match(/^[\w-]+$/)){j=ib.exec(j.toLowerCase());var k=void 0;if(j==Z)k="";else{if(k=void 0,k=j[1],k==Z||""==k)k="4";else var l=gb[k],k=l?l:isNaN(k)?"4":k.substr(0,1);k=[j[2]==Z||""==j[2]?"n":hb[j[2]],k].join("")}j=k}else j="";j&&f.push(j)}0<f.length&&(e=f),3==c.length&&(c=c[2],f=[],c=c?c.split(","):f,0<c.length&&(c=fb[c[0]])&&(this.J[d]=c))}for(this.J[d]||(c=fb[d])&&(this.J[d]=c),c=0;c<e.length;c+=1)this.$.push(new z(d,e[c]))}};var jb={Arimo:Y,Cousine:Y,Tinos:Y};W.prototype.H=function(a,b){b(a.j.M)},W.prototype.load=function(a){var b=this.c;if("MSIE"==this.a.getName()&&this.e.blocking!=Y){var c=g(this.X,this,a),d=function(){b.z.body?c():setTimeout(d,0)};d()}else this.X(a)},W.prototype.X=function(a){for(var b=this.c,c=new U(this.e.api,l(b),this.e.text),d=this.e.families,e=d.length,f=0;e>f;f++){var g=d[f].split(":");3==g.length&&c.S.push(g.pop());var h="";2==g.length&&""!=g[1]&&(h=":"),c.p.push(g.join(h))}d=new V(d),d.parse(),m(b,c.f()),a(d.$,d.J,jb)},X.prototype.H=function(a,b){var c=this,d=c.e.projectId,e=c.e.version;if(d){var f=c.c.v;n(this.c,c.D(d,e),function(e){if(e)b($);else{if(f["__mti_fntLst"+d]&&(e=f["__mti_fntLst"+d]()))for(var g=0;g<e.length;g++)c.k.push(new z(e[g].fontfamily));b(a.j.M)}}).id="__MonotypeAPIScript__"+d}else b($)},X.prototype.D=function(a,b){var c=l(this.c),d=(this.e.api||"fast.fonts.net/jsapi").replace(/^.*http(s?):(\/\/)?/,"");return c+"//"+d+"/"+a+".js"+(b?"?v="+b:"")},X.prototype.load=function(a){a(this.k)};var kb=new Q(_);kb.u.w.custom=function(a,b){return new T(b,a)},kb.u.w.fontdeck=function(a,b){return new R(b,a)},kb.u.w.monotype=function(a,b){return new X(b,a)},kb.u.w.typekit=function(a,b){return new S(b,a)},kb.u.w.google=function(a,b){return new W(b,a)},_.WebFont||(_.WebFont={},_.WebFont.load=g(kb.load,kb),_.WebFontConfig&&kb.load(_.WebFontConfig))}(this,document);