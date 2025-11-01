
import './ErrorPopup.css';

function ErrorPopup({text, isOpen}) {

  // if (!text) return null;
  
  return (
    <>
     <div className='error-popup'>
          <div>
            <p>
              {/* {text} */}
              Error
            </p>
          </div>
     </div>
    </>
  )
}

export default ErrorPopup