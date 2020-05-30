import React, { useState } from 'react'
import Scanner from './Scanner'

import * as superagent from 'superagent'

import Button from '@material-ui/core/Button'

let barcode = new Set()

function App() {
  const [camera, setCamera] = useState(true)
  const [result, setResult] = useState(null)

  const onDetected = async (result) => {
    if (!barcode.has(result)) {
      barcode.add(result)
      console.log(result)
      setResult(result)

      const validOrNot = await superagent.get(
        `http://localhost:5000/b/${result}`
      )
      console.log(validOrNot)
    }
  }

  return (
    <div className='mx-auto text-center' style={{ display: 'grid' }}>
      <div className='container' style={{ padding: '10px' }}>
        <div
          id='Camera'
          style={{ width: '55%', float: 'left', position: 'absolute' }}
        >
          {camera && <Scanner onDetected={onDetected} />}
        </div>
        <div
          id='container'
          style={{ width: '55%', float: 'right', position: 'relative' }}
        >
          <img src='result.png'></img>
        </div>
      </div>
      <Button
        variant='contained'
        color='primary'
        onClick={() => setCamera(!camera)}
        style={{ width: '50px', heigth: '50px', 'margin-left': '300px' }}
      >
        {camera ? 'Stop' : 'Start'}
      </Button>
      <h2
        className='text-black-50 mx-auto mt-2 mb-5'
        style={{ textAlign: 'center' }}
      >
        {result ? result : 'Scanning...'}
      </h2>
    </div>
  )
}

export default App
