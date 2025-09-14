import { XCircle } from "phosphor-react"

export default function Modal ({callback, className, children}) {

    return (
        <div style={styles.overlay}>
            <div className={className ?? "modal w-[60%]"}>
                <button className="close-modal" onClick={callback}>
                    <XCircle size={38} />
                </button>
                {children}
            </div>
        </div>
    )
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 80, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
}