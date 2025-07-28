import { XCircle } from "phosphor-react"

export default function Modal ({callback, children}) {

    return (
        <div style={styles.overlay}>
            <div className="modal w-[75%]">
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
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
}