import { doc, setDoc, updateDoc } from 'firebase/firestore'
import React from 'react'
export const doOffer = async (to,offer,db,from) =>{
    await setDoc(doc(db,'notifs',to),{
        type:'offer',
        from: from,
        offer: JSON.stringify(offer)
    })
}
export const doAnswer = async (to,answer,db,from) =>{
    await updateDoc(doc(db,'notifs',to),{
        type:'answer',
        from:from,
        answer:JSON.stringify(answer)
    })
}
export const doCandidate = async(to,candidate,db,from) =>{
    await updateDoc(doc(db,'notifs',to),{
        type:'candidate',
        from:from,
        answer:JSON.stringify(candidate)
    })
}