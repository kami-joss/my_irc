import React, {useLocation, useParams, useState, useEffect} from 'react'

export default function Accueil () {

    const [userName, setUsername] = useState('')
    const [channel, setChannel] = useState('')
    const [warning, setWarning] = useState()


    function handleSubmit (e) {
        e.preventDefault()
        setWarning(null)
        if ((userName || channel) === '') {
            setWarning('fill in all the fields')
            return;
        }
        window.location.href = `/${channel}/${userName}`
    }
    
    return (
       <div className="container d-flex justify-content-center bg-dark">
           <div className="d-flex flex-column justify-content-center align-items-center">
               {warning ? <p>{warning}</p> : null}
               <form> 
                    <input 
                        type="text" 
                        name="userName" 
                        placeholder="User Name" 
                        className="form-control"
                        aria-label="Default" 
                        aria-describedby="inputGroup-sizing-default"
                        onChange={(e => setUsername(e.target.value))}>
                        </input>
                    <input 
                        type="text" 
                        name="channelName" 
                        placeholder="Channel" 
                        className="form-control my-2" 
                        aria-label="Default" 
                        aria-describedby="inputGroup-sizing-default"
                        onChange={(e => setChannel(e.target.value))}>
                    </input>
                    <button type="button" className="btn btn-primary" onClick={(e => handleSubmit(e))} > Connexion</button>        
                </form>   
            </div>
       </div> 
    )
}