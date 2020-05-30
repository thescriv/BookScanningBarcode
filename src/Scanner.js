import React, { useEffect } from 'react'
import config from './config.json'
import Quagga from 'quagga'

const barcodeUnique = new Set()

const Scanner = (props) => {
  const { onDetected } = props

  useEffect(() => {
    Quagga.init(config, (err) => {
      if (err) {
        console.log(err, 'error msg')
      }
      Quagga.start()
      return () => {
        Quagga.stop()
      }
    })

    //detecting boxes on stream
    Quagga.onProcessed((result) => {})

    Quagga.onDetected(detected)
  }, [])

  const getMedian = (arr) => {
    arr.sort((a, b) => a - b)
    const half = Math.floor(arr.length / 2)
    if (arr.length % 2 === 1)
      // Odd length
      return arr[half]
    return (arr[half - 1] + arr[half]) / 2.0
  }

  const detected = (result) => {
    //console.log(result);

    const errors = result.codeResult.decodedCodes
      .filter(({ error }) => error !== undefined)
      .map(({ error }) => error)
    const median = getMedian(errors)
    if (
      !barcodeUnique.has(result) &&
      parseInt(result.codeResult.code) !== 0 &&
      median < 0.1
    ) {
      barcodeUnique.add(result)
      onDetected(result.codeResult.code)
    }
  }

  return (
    // If you do not specify a target,
    // QuaggaJS would look for an element that matches
    // the CSS selector #interactive.viewport
    <div id='interactive' className='viewport' />
  )
}

export default Scanner
