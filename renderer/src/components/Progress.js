import { Autocomplete, Pagination, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import ProgressForm from "./ProgressForm";
import ProgressItem from "./ProgressItem";
import { FilePdf, ListPlus, NotePencil } from "phosphor-react";

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
            <div className="flex flex-row items-center justify-center my-4">
                <Autocomplete 
                    className="w-[18%] min-w-2xs ml-8 mx-4"
                    disablePortal
                    value={selected}
                    options={patients}
                    getOptionLabel={(option) => option ? option.name : option}
                    onInputChange={(event, input) => setSearchInput(input)}
                    onChange={handleChange}
                    loading={loading}
                    noOptionsText={"Nenhum paciente encontrado"}
                    renderInput={(params) => <TextField {...params} className="custom-textfield-input" label={"Pacientes"} />}
                />
                <button className="button-submit button-register" onClick={() => setModalVisible(true)}>
                    <NotePencil size={32} />
                </button>
                <button className="button-submit button-register" onClick={downloadProgress}>
                    <FilePdf size={32} />
                </button>
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