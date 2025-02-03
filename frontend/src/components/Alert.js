import React, {useContext} from 'react'
import AlertContext from '../contexts/alert/AlertContext'
function Alert() {
  const context = useContext(AlertContext);
  const {alert} = context;
  return (
    <>
      {
        alert.type &&  <div className={`alert alert-${alert.type}`} role="alert">
            {alert.message}
        </div>
      }
    </>
  )
}

export default Alert
