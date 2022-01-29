import "./Modal.css";
import React from 'react'

function Modal({ closeModal }) {
    return (
        <div className="modalBackground">
            <div className="modalContainer">
                <div className="titleCloseBtn">
                    <button onClick={() => closeModal(false)}> X </button>
                </div>
                <div className="title">
                    <p>Are you sure you want to delete this image ?</p>
                </div>
                <div className="footer">
                    <button onClick={() => alert('ทำฟังก์ชันลบของหน้าบ้านเลย')}>Delete</button>
                    <button onClick={() => closeModal(false)} id="cancelBtn">Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default Modal