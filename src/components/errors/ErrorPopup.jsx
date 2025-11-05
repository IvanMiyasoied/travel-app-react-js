
import './ErrorPopup.css';

function ErrorPopup({text, }) {

  // if (!text) return null;
  
  return (
    <>
     <div className='fade-out'>
          <div className='error-popup'>
            <p className='error-content'>
              {/* {text} */}
              Error
            </p>
          </div>
     </div>
    </>
  )
}

export default ErrorPopup