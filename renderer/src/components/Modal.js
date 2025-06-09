
export default function Modal ({callback, children}) {

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button style={styles.button} onClick={callback}>X</button>
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
        zIndex: 1000
    },
    modal: {
        background: 'white',
        padding: '2rem',
        minWidth: '300px',
        position: 'relative',
        borderRadius: '5px'
    },
    button: {
        position: 'absolute',
        top: '-15px',
        right: '-15px',
        background: '#247D7F',
        width: '30px',
        height: '30px',
        borderRadius: '100%',        
        cursor: 'pointer'
    }       
}