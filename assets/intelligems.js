  // Intelligems Quantity Event Listeners
  function initialLoad() {
    const addButton = document.querySelector('button.quantity-selector__button.increase');
    const removeButton = document.querySelector('button.quantity-selector__button.decrease');
    
    function igCallback(){
      setTimeout(() => {
        const quantityField = document.querySelector("quantity-settings > quantity-selector > input")
      
        if (quantityField && window.igData && window.igData.price && window.igData.price.updateQuantity){
          igData.price.updateQuantity(quantityField.value)
        }
      }, 200)
    }

    if (addButton){
      addButton.addEventListener("click", function(event){
        igCallback()
      })
    }

    if (removeButton){
      removeButton.addEventListener("click", function(event){
        igCallback()
      })
    }

    const quickAddInterval = setInterval(() => {
        const buyButtons = document.querySelectorAll('.product-form__buy-buttons');
        if (buyButtons.length > 1){
          if (window.igData){
            window.igData.resetDom()
          }
        }
    }, 200)
  }

  if (document.readyState === "complete") {
    initialLoad();
  } else {
    window.addEventListener("load", initialLoad);
  }
