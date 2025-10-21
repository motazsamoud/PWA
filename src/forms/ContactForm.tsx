'use client'
import { handleContactFormAction } from '@/app/actions/sendContactEmail'
import BtnArrow from '@/svg/BtnArrow'
import React, { useActionState } from 'react'

export default function ContactForm() {

   const [state, formAction] = useActionState(handleContactFormAction, { success: false })

   return (
      <form action={formAction} id="contact-form">
         <div className="form-grp">
            <textarea name="message" placeholder="Comment" required></textarea>
         </div>
         <div className="row">
            <div className="col-md-4">
               <div className="form-grp">
                  <input name="user_name" type="text" placeholder="Name *" required />
               </div>
            </div>
            <div className="col-md-4">
               <div className="form-grp">
                  <input name="user_email" type="email" placeholder="E-mail *" required />
               </div>
            </div>
            <div className="col-md-4">
               <div className="form-grp">
                  <input type="url" placeholder="Website *" />
               </div>
            </div>
         </div>
         <button type="submit" className="btn btn-two arrow-btn">Submit Now <BtnArrow /></button>
         {state.success && <p className="text-success mt-2">✅ Message sent successfully!</p>}
         {state.error && <p className="text-danger mt-2">❌ Error: {state.error}</p>}
      </form>
   )
}
