function getTodoItems() 
{
  for (var i = 0; i < localStorage.length; i++) 
  {
      var key = localStorage.key(i);
      if (key.substring(0, 4) == "todo") 
      {
         var item = localStorage.getItem(key);
         var todoItem = JSON.parse(item);
         todos.push(todoItem);
      }
  }
  addTodosToPage();
}

function saveTodoItem(todoItem) 
{
   var key = "todo" + todoItem.id;
   var item = JSON.stringify(todoItem);
   localStorage.setItem(key, item);
} 

function deleteItem(e) {
    var span = e.target;
    var id = span.parentElement.id;
    console.log("delete an item: " + id);
    
                //find and remove the item in local storage
    var key = "todo" + id;
    localStorage.removeItem(key);
    
               //find and remove the item in the array
    for(var i = 0; i < todos.length; i++){
      if(todos[i].id == id) {
       todos.splice(i, 1);
       break;                        //ending the loop from going through the rest of the todos, which is not needed now that we found the item
       }
      }
              //find and remove the item in the page 
     var li = e.target.parentElement;
     var ul = document.getElementById("todoList");
     ul.removeChild(li);
} 

function changeStatus(e){
   var z = e.target.getAttribute("class");            //z is which class the clicked item currently has 
   console.log(z);
     var span = e.target;
     var id = span.parentElement.id;
     var key = "todo" + id;
     var keyObjectJSON = localStorage.getItem(key);
     var newKeyObject = JSON.parse(keyObjectJSON);
    
     
     //find the value in the array
   for(var i = 0; i < todos.length; i++){
      if(todos[i].id == id) {
       arrayItemToChange = todos[i];                         //using this variable below 
       break;           
       }
    }
   
              //find and change the class which will change the box color and add or remove the check box
   if(z == "notDone"){
     console.log("change the status of " + id);
     span.setAttribute("class","done");                     //reassigning the attribute 
     span.innerHTML = "&nbsp;&#10004;&nbsp;";
     arrayItemToChange.done = true;                         //changing in the array
     saveTodoItem(arrayItemToChange);                       //sends the new done property to the function that write to local
    console.log(span);
    
      }
   else{                                                    //meaning if the class done was =="done"
     span.setAttribute("class","notDone");                  //reassigning the attribute
     span.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
     arrayItemToChange.done = false;                        //changing in the array
     saveTodoItem(arrayItemToChange);                       //sends the new done property to the function that write to local
    console.log(span);
    
   }
   console.log(arrayItemToChange);                          //series of testing
   console.log(arrayItemToChange.done);
   console.log(key);
}    