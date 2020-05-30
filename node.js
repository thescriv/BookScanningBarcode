const express = require('express')
const puppeteer = require('puppeteer')

const app = express()

const stack = new Set()

app.listen('5000', () => {
  console.log('Listening...')
})

app.use('/b', (req, res, next) => {
  console.log('get a request')
  next()
})

app.get('/b/:id', async (req, res) => {
  const { id } = req.params

  if (!stack.has(id)) {
    stack.add(id)

    let ret

    try {
      ret = await validOrNot(id)
      console.log('get it')
    } catch (e) {
      console.log(e.message)
      console.log('error')
    }

    res.send(ret)
  } else {
    console.log('already proceed')
    res.send(null)
  }
})

async function validOrNot(result) {
  const browser = await puppeteer.launch()
  // Création d’un nouvel onglet
  const page = await browser.newPage()

  await page.setViewport({
    width: 1080,
    height: 720,
    deviceScaleFactor: 1,
  })

  // Navigation vers l'URL souhaitée
  await page.goto('https://www.gibert.com/sao')

  await page.waitFor('body')

  await page.screenshot({ path: './public/first_page.png' })

  await page.evaluate((result) => {
    document.getElementsByClassName('input-text')[1].value = result
  }, result)

  await page.screenshot({ path: `./public/fill_text.png` })

  await page.click('#add_sao')

  await page.screenshot({ path: `./public/press_button.png` })

  //action submit primary
  await page.screenshot({ path: `./public/result.png` })

  //grid_product
  //#product_list

  await browser.close()
}
