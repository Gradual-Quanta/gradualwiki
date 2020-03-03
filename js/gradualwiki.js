/*
// this script loog for a div of class md
// and replace its content with the render markdown
// obtained from a gradualpad.
//
// The pad name is derived from data-gradualid
//
// and then replace all the [[wikilinks]]
// with a "onclick" resolver to access the url from
// the [[blockRing]] index.
//
//
// when page is loaded it post itself under its own pagename
// indexes are merged w/i the neigborhood (i.e. trusted friend level 1)
// 
// indexes are sharded according to a truncate hash,
// to optimize access speed and size
*/

var resolver = 1; // improve later with a query parameter
var branding = 'frama' 
const url = window.location.href
if (url.match(/\.gq/)) { branding = 'gradual' } 
else if (url.match(/holo/i)) { branding = 'holo' }
else if (url.match(/blockring/)) { branding = 'brings' } 
else if (url.match(/oogle/)) { branding = 'yoogle' } 
else if (url.match(/\.ml/)) { branding = 'myc' } 
else if (url.match(/cloud/)) { branding = 'cloud' } 
else if (url.match(/ipfs/)) { branding = 'ipfs' } 
else if (url.match(/ipms/)) { branding = 'ipms' } 
else if (url.match(/127/)) { branding = 'local' } 

var html = document.getElementsByTagName('html')[0];
html.innerHTML = html.innerHTML.replace(/{{gradual}}/g,branding);
var body = document.getElementsByTagName('body')[0];
//body.style.background-image.url = 'brands/'+branding+'bg.jpg';

var hash
if(window.location.hash) {
  hash = window.location.hash.substring(1); // Puts hash in variable, and removes the # character
  hash = hash.replace('%20','-');
  if (hash == 'edit') {
    document.getElementById('panel').style.display='block';
  } else {
    //document.getElementById('panel').dataset.framaid=hash;
    html.innerHTML = html.innerHTML.replace(/{{pageName}}/g,hash);
  }
}
// inject *.js javascript
// showdown.js ...
var mdscript = document.createElement('script');
    mdscript.setAttribute('type','text/javascript');
    mdscript.src = 'https://cdn.jsdelivr.net/npm/showdown@latest/dist/showdown.min.js';
   document.getElementsByTagName("head")[0].appendChild(mdscript);
   console.log('showdown.js injected')


p = document.getElementById('panel')
var gradualid = p.dataset.gradualid
console.log('gradualid: '+gradualid);
p.innerHTML = p.innerHTML.replace(/{{gradualid}}/g,gradualid)

var pageName
var PageName
var pageNameUE
var elems = document.getElementsByClassName('md');
get_wiki()

window.onhashchange = function() {
  hash = window.location.hash.substring(1); // Puts hash in variable, and removes the # character
  console.log('hash: '+hash)
  get_wiki();
}


function get_wiki() { // first element get the pageName
  pageName = (hash) ? hash : (p.dataset.gradualid) ? p.dataset.gradualid : branding+'Wiki'
  PageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  pageNameUE = pageName.charAt(0).toLowerCase() + pageName.slice(1);
  pageNameUE = pageNameUE.replace(/%20/,'-');
  console.log('PageName: '+PageName)
  let url = 'https://mensuel.framapad.org/p/'+pageNameUE+'/export/txt';
  let e = elems[0]
  get_md(e,url,render(e))
}

// console.log('elems',elems)
for (let i=1; i<elems.length; i++) {
  let e = elems[i]
  let gradualid = branding+'Wiki' 
  if (e.dataset.gradualid) {
    gradualid = e.dataset.gradualid
  }
  let url = 'https://mensuel.framapad.org/p/'+gradualid+'/export/txt';
  get_md(e,url,render(e))
}



function render(e) {
 //console.log('rendering',e)
 // return a callback function for update e w/ md content
 const callBack = md => {
   md = md.replace(/{{gradual}}/g,branding);
   md = md.replace(/{{PageName}}/g,PageName);
   md = md.replace(/{{pageName}}/g,pageName);
   md = md.replace(/{{pageNameUE}}/g,pageNameUE);
   md = md.replace(/{{gradualid}}/g,e.getAttribute('data-gradualid'));
   md = md.replace(/Don't modify anything.*?!/g,"<!-- Don't modify -->");
   md = md.replace(/\\\n/g,'<br>');
   md = md.replace(/%loc%/g,document.location);
   md = md.replace(/%hostname%/g,document.location.hostname);
   md = md.replace(/%origin%/g,document.location.origin);
   md = md.replace(/(?<!'){{DUCK}}/g,'https://duckduckgo.com/?q');
   md = md.replace(/(?<!'){{QWANT}}/g,'https://qwant.com/?q');
   md = md.replace(/(?<!'){{LILO}}/g,'https://search.lilo.org/results.php?openvialilo=true&q');
   md = md.replace(/(?<!'){{START}}/g,'https://www.startpage.com/do/search?query');
   md = md.replace(/(?<!'){{chart}}/g,'https://chart.apis.google.com/chart?cht=qr&chs=240x240&chl');
   var htm = markdownify(e,md);
   
 }
 return callBack
}

function get_md(elem,url,callBack) {
  fetch(url, { mode: 'cors' })
  .then( resp => {
      if (resp.status >= 200 && resp.status < 300) {
        return resp.text()
      } else if (resp.status == 404) {
	// prepare a fake response
	return md = "## Create new pad for {{PageName}}\n The "+branding+"pad link is: [{{pageName}}]\n\nyou can [edit] this [page](#{{pageName}}): [here](https://mensual.framapad.org/p/{{pageName}}?lang=en)\n"
      } else { 
	return Promise.reject(new Error(resp.statusText))
      }
    }
  )
  .then( md => callBack(md) )
  .catch(logError)
}

function wikilinks(e,buf) {
  console.log('looking for wikilinks')
  var gradualid = e.getAttribute('data-gradualid');
  console.log('gradualid: '+gradualid);
  console.log('pageNameUE: '+pageNameUE);
  if (resolver) {
  // external links
  var rex = RegExp(/\[\[([^\]]*?)\]\](?!')/,'g'); // [[graduallinks]]
  buf = buf.replace(rex,"<a target=_new href=\"https://lite.qwant.com/?q=%23"+branding+"Links+%2B%22$1%22\">$1</a>");
  // local referenced links
  rex = RegExp(/\[([^\]]*?)\]\[(.*?)](?!')/,'g'); // [text][wikilink]
  buf = buf.replace(rex,'<a target="$1" href="#$2">$1</a>');
  //buf = buf.replace(rex,'<a target="$1" href="https://mensuel.framapad.org/p/$2?lang=en">$1</a>');

  // reserved wikilinks :
  rex = RegExp(/\[source\](?![('\[\]])/,'g'); // [source]
  buf = buf.replace(rex,'<a target=_blank href="https://mensuel.framapad.org/p/'+pageNameUE+'/export/txt">source</a>');
  rex = RegExp(/\[edit\](?![('\[\]])/,'g'); // [edit]
  buf = buf.replace(rex,'<a target=_blank href="https://mensuel.framapad.org/p/'+pageNameUE+'?lang=en">edit</a>');
  rex = RegExp(/\[pageName\](?![('\[\]])/,'g'); // [{{pageName}}]
  buf = buf.replace(rex,"<a href=\"https://qwant.com/?q=%26g++%22pageName%22\">pageName</a>");

  rex = RegExp(/(?<!['"])#(\w+)(?!['"])/,'g'); // #hashtag
  buf = buf.replace(rex,"<a target=\"$1\" href=\"https://qwant.com/?q=%26g+%23$1\">#$1</a>");
  rex = RegExp(/(?<!['\[\]])\[([^\]=]*?)\](?![('\[\]])/,'g'); // [localpage]
  buf = buf.replace(rex,"<a href=\"#$1\">$1</a>");
  //buf = buf.replace(rex,"<a href=\"https://mensuel.framapad.org/p/$1\">$1</a>");
  }
  e.innerHTML = buf;
}
function markdownify(e,md) {
   var buf;
   console.log('markdownify');
   if ( typeof(showdown) == 'undefined' ) {
      buf = "/!\\ showdown not loaded";
      console.log(buf)
      mdscript.onload = function () {
         console.log('showdown finally loaded')
	 var converter = new showdown.Converter();
	 buf = converter.makeHtml(md);
         wikilinks(e,buf); // delayed rendering ...
      }
   } else {
         console.log('showdown already loaded')
         var converter = new showdown.Converter();
         buf = converter.makeHtml(md);
         // update wikilinks ...
         console.log('e: immediate rendering');
         wikilinks(e,buf);
   }
}

function validate(resp) {
  if (resp.status >= 200 && resp.status < 300) {
    return Promise.resolve(resp)
  } else if (resp.status == 404) {
    // prepare a fake response
    const md = "gradualpad: [[{{gradualid}}]"
    console.log(resp)
    return Promise.resolve(md)
  } else { 
    return Promise.reject(new Error(resp.statusText))
  }
}
function logError(e) {
  console.log(e)
}

