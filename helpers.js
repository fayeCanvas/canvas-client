let backendHost;
let clientRootUrl;

const hostname = process.env.NODE_ENV
const project = process.env.GOOGLE_CLOUD_PROJECT
console.log('hn', hostname)
if (hostname === 'development' || hostname === 'test' || hostname == undefined) {
  backendHost = 'http://localhost:5050'
  clientRootUrl = 'http://localhost:8080'
} else {
  backendHost = 'https://canvas-psych-server.uc.r.appspot.com'
  clientRootUrl = 'https://canvaspad.org'
}

exports.API_ROOT = `${backendHost}`
exports.CLIENT_ROOT = `${clientRootUrl}`
