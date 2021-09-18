const Modal = {
  open(){
    this.registerEventCloseOnFocusOut()
    const modalOverlay = document.querySelector(".modal-overlay");
    modalOverlay.classList.toggle("active")
  },
  close() {
    const modalOverlay = document.querySelector(".modal-overlay");
    modalOverlay.classList.toggle("active")
  },
  registerEventCloseOnFocusOut(){
    const modalOverlay = document.querySelector(".modal-overlay")
    modalOverlay.addEventListener("mouseup", (event)=>{
      const modal = document.querySelector(".modal")

      if(!modal.contains(event.target)){
        this.close()
      } 
    })
   
  }
}
