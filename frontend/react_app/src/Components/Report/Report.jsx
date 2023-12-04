import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import Cookies from 'js-cookie'
import './Report.css'

const Report = ()=> {
    const navigate = useNavigate();

    const url = "http://localhost:3001/records/report"

    const {id} = useParams();
    const [reason, setReason] = useState();
    const [description, setDescription] = useState();
    const initiatorId = Cookies.get("id")

    const handleSubmit = (e)=> {
        e.preventDefault();
        const isSolved = false;
        axios.post(url, {
            item_id: id, 
            initiator_id: initiatorId,
            report_reason: reason,
            report_description: description,
            is_solved: isSolved
        }).then(res => {
            console.log(res)
            if(res.status === 200){
                console.log(res)
                navigate('/')
                return alert("Report From Successfully Submitted")
            }
        }).catch(err => console.log(err));
    }

    return (
        <div className="report-form-container">
            <form className="report-form" onSubmit={handleSubmit}>
                <h3 className='rep-form-title'>Report this item</h3>
                <label className="label-report" htmlFor="reason">Reason</label>
                <input className='rep-input' value={reason} type="text" id="reason" name="reason" onChange={e => setReason(e.target.value)}/>
                <label className="label-report" htmlFor="description">Description</label>
                <textarea className='rep-input-desc' value={description} type="text" id="description" name="description" onChange={e => setDescription(e.target.value)}/>        
                <button className='rep-button' type='submit'>File Report</button>
            </form>
            <a className="form-swap-button" href='/'>Don't wish to file report? Go back here.</a>
        </div>
    )

}

export default Report;