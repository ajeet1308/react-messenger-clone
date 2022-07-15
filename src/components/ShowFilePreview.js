import React, { useState } from 'react'
import Cancel from './svg/Cancel'
import CancelPreviewButton from './svg/CancelPreviewButton.js'
import CancelPreview from './svg/CancelPreviewButton.js'
import NoPreview from './svg/NoPreview'

const ShowFilePreview = ({img,setImg}) => {
    console.log("img")
    console.log(img)
    const val = (img.size);
    const ans = val/1024;
  return (
    <>
        <div className="video-container-preview">
            <div style={{ background: "#03816b", height: "55px" }}>
                <CancelPreviewButton setImg={setImg} />
                <div
                    style={{
                    position: "absolute",
                    marginLeft: "80px",
                    marginTop: "-30px",
                    fontSize: "18px",
                    }}
                >
                    {img.name}
                </div>
            </div>
            <div className='preview'>
                <div><NoPreview/></div>
                <p style={{textAlign:"center",fontSize:"25px",fontWeight:"bold"}}>No Preview Available</p>
                <p style={{textAlign:"center",fontSize:"15px",fontWeight:"bold"}}>{ans+"  kB"+" - "+img.type}</p>
            </div>
        </div>
    </>
  )
}

export default ShowFilePreview