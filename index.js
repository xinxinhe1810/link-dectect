const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // const url = 'http://192.168.25.147:5000/' 本地测试地址
  // const url = 'https://at.umtrack.com/5f8Pbi' // 302 重定向
  // const url = 'https://music.163.com/m/banner/special/zyhtl202004?market=zyhtl202004&target=app' // js 触发 download
  // const url = 'https://dsp-h5-test.izuiyou.com/dnf'

  // const url = 'https://apps.apple.com/cn/app/id1463935392' // deeplink ios

  const url = 'https://jq.qq.com/?wv=1027&k=BsLbp1Bt' // deeplink and

  // const url = 'https://linkst.m.jd.com/ul/ul.action' // universalLink

  // Android
  const ua = 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Mobile Safari/537.36"'

  // const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1'
  // IOS
  await page.setUserAgent(
    ua
  );

  let isDp = false

  const redirectUrls = []

  const isDeepLinkUrl = url => {
    return !(url.startsWith('http') || url.startsWith('data'))
  }

  // await page.setCacheEnabled(false)
  // page.on('request', async (request) => {
  //   const curUrl = request.url()

  //   // if (isDp) {
  //   //   request.abort()
  //   // }
  //   console.log('req', curUrl)

  //   if (request.isNavigationRequest() && isDeepLinkUrl(curUrl)) {
  //     console.log('isdp url ', request.redirectChain().length, curUrl)
  //     isDp = true
  //   }
  // })

  page.on('request', async request => {
    try {
      const curUrl = request.url()

      if (request.isNavigationRequest()) {
        redirectUrls.push({
          url: curUrl,
          ts: Date.now(),
        })
      }
    } catch (error) {
      log('ERR', error, 'CHECK_REDIRECT_URLS ERROR')
    }
  })

  // await page.tracing.start({path: 'trace.json'});

  await page.goto(url, {
    timeout: 30 * 1000,
    waitUntil: 'load'
  });
  // await page.tracing.stop()

  // await page.waitFor(3000);
  try {
    await page.waitForRequest(
      req => {
        console.log('req', req.url())
        if (req.isNavigationRequest()) {
          redirectUrls.push({
            url: req.url(),
            ts: Date.now(),
          })
        }

        if (req.isNavigationRequest() && isDeepLinkUrl(req.url())) {
          isDp = true
        }
        return isDeepLinkUrl(req.url())
      },
      {
        timeout: 5 * 1000,
      }
    )
  } catch (error) {
    console.log('ERR', error, 'PAGE_WAIT_NAVIGATION_ERROR')
  }

  await page.close();
  
  await browser.close()

  console.log('\n isDp', isDp, redirectUrls)
})();