import { Autocomplete, Pagination, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import ProgressForm from "./ProgressForm";
import ProgressItem from "./ProgressItem";

export default function Progress() {

    const [selected, setSelected] = useState(null)
    const [searchInput, setSearchInput] = useState('')
    const [history, setHistory] = useState([])

    const [patients, setPatients] = useState(null)
    const [loading, setLoading] = useState(false)

    const [formContent, setFormContent] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)

    const [sorting, setSorting] = useState({
        page: 1, 
        size: 2,
        totalPages: 0
    })

    async function fetchProgress(patientId, page, size) {
        const history = await window.progressAPI.findProgressByPatient(patientId, page, size)
        setHistory(history?.rows)
        setSorting((sort) => { 
            if(sort.totalPages === history.totalPages) return sort
            return { ...sort, totalPages: history.totalPages }
        })
    }

    async function updateOptions(search) {
        const result = await window.patientAPI.searchPatients(search)
        setPatients(result)
        setLoading(false)
    }

    useEffect(() => {
        if(!searchInput) {
            setPatients([])
            setLoading(false)
            return
        } else {
            setLoading(true)
        } 

        updateOptions(searchInput)
    }, [searchInput]) 

    useEffect(() => {
        if(selected)
            fetchProgress(selected.id, sorting.page, sorting.size)
    }, [sorting])

    async function handleChange(event, selectedOption) {
        setSelected(selectedOption)
        setLoading(false)
        if(selectedOption) {
            setSorting((sort) => ({ ...sort, page: 1 }))
        } else {
            setSorting({page: 1, size: 2, totalPages: 0})
            setHistory([])
        }
    }

    function downloadProgress(){
        console.log(sorting)
    }

    const refreshProgress = (patient) => {
        setSorting((sort) => ({ ...sort, page: 1 }))
        setPatients([patient])
        setSelected(patient)
        setSearchInput(patient.name)
    }

    const handleEditProgress = (progress) => {
        const content = {
            id: progress.id, 
            subject: progress.subject,
            professional: progress.professional,
            patient: progress.patient
        }

        setFormContent(content)
        setModalVisible(true)
    }

    function renderPatientHistory() {
        return history?.map((progress, index) => {
            return ( 
                <ProgressItem 
                    key={index}
                    progress={ { ...progress, patient: selected } }
                    handleEditProgress={handleEditProgress}
                />
            )
        })
    }

    function handlePageChange(event, value) {
        if(sorting.page !== value)
            setSorting((sort) => ({ ...sort, page: value }))
    }

    return (
        <div>
            { modalVisible && 
                <ProgressForm 
                    setModalVisible={setModalVisible}
                    defaultContent={formContent ?? { patient: selected }}
                    refreshProgress={refreshProgress}
                /> 
            }
            <div>
                <Autocomplete 
                    disablePortal
                    value={selected}
                    options={patients}
                    getOptionLabel={(option) => option ? option.name : option}
                    onInputChange={(event, input) => setSearchInput(input)}
                    onChange={handleChange}
                    loading={loading}
                    sx={{width: 300}}
                    noOptionsText={"Nenhum paciente encontrado"}
                    renderInput={(params) => <TextField {...params} label={"Pacientes"} />}
                />
                <button className="button" onClick={() => setModalVisible(true)}>+</button>
                <button className="button" onClick={downloadProgress}>PDF</button>
            </div>
            <div>
                {renderPatientHistory()}
            </div>
            {sorting.totalPages > 0 &&
                <nav aria-label="Pagination">
                    <Pagination 
                        count={sorting.totalPages} 
                        shape="rounded" 
                        page={sorting.page}
                        onChange={handlePageChange}
                    />
                </nav>
            }
        </div>
    )
}