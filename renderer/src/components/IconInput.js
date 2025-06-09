'use client'

import { useRef, useState } from "react";

export default function IconInput ( props ) {

    const className = props.className ?? ""
    const { onFileChange } = props

    const [previewImg, setPreviewImg] = useState(props.src)

    const fileInputRef = useRef(null)
    const previewImgRef = useRef(null)

    const handleFileChange = () => {
        const file = fileInputRef.current.files[0]
        
        if(file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setPreviewImg(event.target.result)
                previewImgRef.current.style.padding = 0
            }

            reader.readAsDataURL(file)
            onFileChange(file)
        }
    }

    return (
        <div className={className}>
            <label htmlFor={props.id}>
                <img id={props.imageId} src={previewImg} 
                       alt={props.alt} title={props.title}
                       ref={previewImgRef} 
                       style={{ width: props.width, height: props.height}} />
            </label>
            <input id={props.id} ref={fileInputRef} type="file" accept="image/*"
                   onChange={handleFileChange}/>
        </div>
    )
}