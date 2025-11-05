
import './ErrorPopup.css';

function ErrorPopup({text, isOpen}) {

  // if (!text) return null;
  
  return (
    <>
     {/* <div className={isOpen ? '' :  'fade-out'}> */}
     {/* <div className={isOpen ? 'fade-in' : 'fade-out'}> */}
          <div className={'error-popup ' + (isOpen ? '' :  'fade-out')}>
            <p className='error-content'>
              {text}
            </p>
          </div>
     {/* </div> */}
    </>
  )
}

export default ErrorPopup