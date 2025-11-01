import './Loading.css'

function Loading({message = "Loading..."}) {
  return (
    <div className='loading-overlay'>
      <div className='spinner'></div>
      <p>{message}</p>
    </div>
  )
}

export default Loading