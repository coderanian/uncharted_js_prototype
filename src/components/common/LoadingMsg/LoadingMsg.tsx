import spinner from "./spinner/loading-if.gif";
import './style.css'
function LoadingMsg(){
    return (
        <div className={'loading-container'}>
            <img src={spinner} className={'loading-spinner'} alt={"Loading"}/>
            <p className={'loading-msg'}>Loading...</p>
        </div>
    )
}

export default LoadingMsg;