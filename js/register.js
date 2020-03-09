/* script to register a pagename / url onto IPFS */
// ipms config Addresses.API

const lgw = 'http://127.0.0.1:8080'
const pgw = 'https://ipfs.blockringtm.ml';
const webui = 'http://127.0.0.1:5001';
if (typeof(lgw) == 'undefined') { const lgw = '{{site.data.ipfs.gateway}}' }
if (typeof(webui) == 'undefined') { const webui = '{{site.data.ipfs.webui}}' }


const api_url = webui + '/api/v0/'

function getPeerID(callback) {
  var url = api_url + 'config?&arg=Identity.PeerID&encoding=json'
  console.log(url);
  return fetchjson(url)
     .then( obj => {
        return Promise.resolve(obj.Value)
     })
     .catch(error)
}

function fetchjson(url) {
  return fetch(url, {mode:"cors"}).then(status).then( resp => resp.json() )
}
function status(resp) {
  if (resp.status >= 200 && resp.status < 300) {
    return Promise.resolve(resp)
  }
  return Promise.reject(new Error(resp.statusText))
}
function error(err) {
  console.log(err);
}

true;
