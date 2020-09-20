document.getElementById('clearItems').onclick = clearCompleted 
document.getElementById('clearBtn').onclick = clearAll 
const items = document.querySelectorAll(".items");


Array.from(items).forEach(function(element) {
      element.addEventListener('click', function(){
        const itemPlaced = this.childNodes[1].innerText
        fetch('/itemPlace', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'item': itemPlaced,
          })
        })
        .then(response => {
        
          
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

function clearCompleted(){
  const clickItems = []
  items.forEach(item => {
    if (item.style.color === "rgb(139, 195, 74)"){
      clickItems.push(item);
    }
  })
  console.log(clickItems)
  console.log(clickItems.length)
  fetch('/clearCompleted', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "completed": "#8bc34a", count: clickItems.length
    })
  }).then(function (response) {
    console.log(response)
    window.location.reload()
  })
};

function clearAll(){
fetch('/clearAll', {
  method: 'delete',
  headers: {
    'Content-Type': 'application/json'
  },

}).then(function (response) {
  console.log(response)
  window.location.reload()
})
};
