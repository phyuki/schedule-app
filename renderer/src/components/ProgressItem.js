import dayjs from "dayjs";

export default function ProgressItem({ progress, handleEditProgress }) {

    const { title, professional, createdAt, subject } = progress
    const timestamp = dayjs(createdAt).format('DD/MM/YYYY HH:mm')

    return (
        <div className="progress-item">
            <h3>{`${title}ª evolução`}</h3>
            <p>{professional.name}</p>
            <p>{timestamp}</p>
            <p>{subject}</p>
            <button className="button" onClick={() => handleEditProgress(progress)}>Editar</button>
        </div>
    )
}