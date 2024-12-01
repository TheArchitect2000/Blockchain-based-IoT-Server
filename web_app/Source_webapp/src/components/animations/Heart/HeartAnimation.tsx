import './style.css'

const LiveAnimation = ({ className }: { className?: string }) => {
    return (
        <div className={`livenow ${className}`}>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

export default LiveAnimation
