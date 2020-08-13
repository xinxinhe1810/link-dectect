const Axios = require('axios')

const detectUniversalLink = async (url) => {
  let isUniversalLink = false
  const regex = /(http(s)?:\/\/)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:[0-9]{1,5})?/gi
  const reqUrl = url.match(regex) || []

  const req = reqUrl[0] + '/apple-app-site-association'

  console.log(req)
  try {
    
    const res = await Axios.get(req)
    isUniversalLink = isJson(res.data)
  } catch (error) {
    // 
  }

  console.log(isUniversalLink)

  return isUniversalLink
}

const isJson = (str) => {
  try {
    JSON.parse(str)
  } catch (error) {
    return false
  }
  return true
}


detectUniversalLink('https://linst.m.jd.com/ul/ul.action')