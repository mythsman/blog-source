var server = 'http://127.0.0.1:8080'

function setServer(url) {
  server = url
}

function queryComment(url) {
  return fetch(server + '/api/comment/queryComment?url=' + url, {
    method: 'GET'
  }).then(res => res.json())
}

function queryReply(rids) {
  return fetch(server + '/api/comment/queryReply', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: rids
  }).then(res => res.json())
}

function submitComment(comment) {
  return fetch(server + '/api/comment/add', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(comment)
  }).then(res => res.json())
}

module.exports = {
  setServer,
  queryComment,
  queryReply,
  submitComment
}
