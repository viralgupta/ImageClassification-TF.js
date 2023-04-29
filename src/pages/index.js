import { Inter } from 'next/font/google'
import * as mobilenet from "@tensorflow-models/mobilenet"
import { useEffect, useRef, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [ismodelloading, setIsmodelloading] = useState(false)
  const [model, setModel] = useState(null)
  const [imgurl, setImgurl] = useState(null)
  const [mresults, setMresults] = useState(null)
  const [guessing, setguessing] = useState(false)
  const [timetaken, settimetaken] = useState(0)
  const imgref = useRef()
  const imgurlref = useRef()
  const loadModel = async () => {
    setIsmodelloading(true)
    try {
      const model = await mobilenet.load()
      setModel(model)
      setIsmodelloading(false)
    } catch (error) {
      console.log(error)
      console.log('error loading model')
      setIsmodelloading(false)
    }
  }
  const uploadimage = async (e) => {
    const { files } = e.target
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0])
      setImgurl(url)
      setMresults(null)
      setguessing(true)
    }
  }
  const uploadurl = async () => {
    if (imgurlref.current.value.length > 0) {
      console.log('running')
      setImgurl(imgurlref.current.value)
      setMresults(null)
      imgurlref.current.value = ''
    }
  }
  const identify = async () => {
    let start = Date.now()
    setguessing(true)
    const results = await model.classify(imgref.current)
    setguessing(false)
    let tt = Date.now() - start
    settimetaken(tt)
    setMresults(results)
  }
  useEffect(() => {
    loadModel()
  }, [])

  if (ismodelloading) {
    return <h2 className='text-center text-2xl'>Model Loading...</h2>
  }


  return (<>
    <div className='container m-auto w-4/5 h-[100vh]'>
      <div className=' mx-auto p-2 py-8 text-2xl flex flex-row justify-center items-center'>TensorFlow Image Classification Model Usage <img src="https://www.vectorlogo.zone/logos/tensorflow/tensorflow-icon.svg" alt="https://www.vectorlogo.zone/logos/tensorflow/tensorflow-icon.svg" className='w-10' /></div>

      <div className='inputholder flex space-x-3 justify-center'>
        <div className='p-1 m-0 border-2'>
        <input type="file" accept='image/*' capture="camera" className='uploadinput p-1 rounded-sm hover:cursor-pointer' onChange={uploadimage} />
        </div>
        <div className="flex space-x-2 border-2 items-center p-2">
          <input type="url" className='uploadinput h-8 rounded-sm bg-gray-900' ref={imgurlref} /><button className=' rounded-md  bg-gray-700 disabled:text-gray-300 text-lg px-1' onClick={uploadurl}>Upload Image Url</button>
        </div>
      </div>
      <div className="mainWrapper flex-col">
        <div className="mainContent flex items-center">
          <div className="imageHolder">
            {imgurl && <img src={imgurl} alt="Upload Preview" crossOrigin='anonymous' ref={imgref} className='m-5 mt-10 rounded-md h-96' />}
          </div>
          <div>
            {mresults ? <div className='space-y-3'>
              <div className="first bg-blue-600 text-xl p-2 rounded-md">
                <div className='font-bold text-3xl'>Best Guess: {(mresults[0].className).toUpperCase()}</div>
                <div className=''>Confidence: {(mresults[0].probability * 100)} &#37;</div>
              </div>
              <div className="first bg-blue-600 text-xl p-2 rounded-md">
                <div className=''>Second best guess: {(mresults[1].className).toUpperCase()}</div>
                <div className=''>Confidence: {(mresults[1].probability * 100)} &#37;</div>
              </div>
              <div className="first bg-blue-600 text-xl p-2 rounded-md">
                <div className=''>Third best guess: {(mresults[2].className).toUpperCase()}</div>
                <div className=''>Confidence: {(mresults[2].probability * 100)} &#37;</div>
              </div>
              <div className="first bg-blue-200 text-xl p-2 rounded-md">
                <div className='text-black'>Time Taken: <span className='font-bold'>{timetaken}ms</span></div>
              </div>
            </div>: guessing && <div className='text-3xl'>Identifying...</div>}
          </div>
        </div>
        {imgurl && <button className='p-3 bg-green-300 rounded-md text-black h-min ml-5' onClick={identify}>Identify Image</button>}
      </div>
    </div>
  </>
  )
}
