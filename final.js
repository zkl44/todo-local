function Todo(id, task, who, dueDate, myLocation) {
            this.id = id;
          this.task = task;
           this.who = who;
       this.dueDate = dueDate;
          this.done = false;
    this.myLocation = myLocation;
}
var map = null;                                                   // global var to hold the map, only need one map
var todos = new Array();
var searchCounter = 0;                                            //global counter to be used to erase li's later 
var currentGeoLoc = new Array();                                  //using this array to use variables from geoLoc file

function init() {
    var submitButton = document.getElementById("submit");
    submitButton.onclick = getFormData;
    var searchButton = document.getElementById("searchButton");
    searchButton.onclick = searchFor;
    getLocationNow()
    getTodoItems();
}

function addTodosToPage() {
    var ul = document.getElementById("todoList");
    var listFragment = document.createDocumentFragment();
    for (var i = 0; i < todos.length; i++) {
        var todoItem = todos[i];
        var li = createNewTodo(todoItem);
        listFragment.appendChild(li);
    }
    ul.appendChild(listFragment);
}
function addTodoToPage(todoItem) {
    var ul = document.getElementById("todoList");
    var li = createNewTodo(todoItem);
    ul.appendChild(li);
    checkForMap();
    
    document.forms[0].reset();
}

function createNewTodo(todoItem) {
    
    var now = new Date();
    var aDueDate = Date.parse(todoItem.dueDate);
    
    try
      {
        if(isNaN(aDueDate))
        {
          var daysRemain = false;
          throw new Error("Date format error. Please enter the date in one of the provided formats");
        }
        else
        {
          dueDate = new Date(aDueDate);
        }
      }
      catch (ex)
      {
        alert(ex.message);
      }
    
    var timeRemaining = dueDate - now;
    var daysRemaining = Math.ceil(timeRemaining / 1000 / 60 / 60/ 24);             //calculating time in days and rounding up
     if(daysRemaining == 1)
     {
       daysRemaining = daysRemaining + " day";
     }
     if(daysRemaining > 1)
     {
       daysRemaining = daysRemaining + " days";
     }
     if(daysRemaining == 0)
     {
       daysRemaining = daysRemaining + " days";
     }
     if(daysRemaining == -1)
     {
       daysRemaining = "OVERDUE BY " + Math.abs(daysRemaining) + " day";
     }
     if(daysRemaining < -1)
     {
       daysRemaining = "OVERDUE BY " + Math.abs(daysRemaining) + " days";
     }
     
    var li = document.createElement("li");
    li.setAttribute("id",todoItem.id);
    var spanTodo = document.createElement("span");
    
      //this will run if browser HAS GEOLOCATION
    if(todoItem.myLocation != false)
    {
      spanTodo.innerHTML = "(" + todoItem.myLocation + ")" + " ";
    }
      //this will run if browser does NOT support GEOLOCATION
    else
    {
      spanTodo.innerHTML = "";
    }
    
     //this is being added to the page regardless
    spanTodo.innerHTML +=
        todoItem.who + " needs to " + todoItem.task + " by " + todoItem.dueDate; //this adds to page even if date format was wrong
      
       // this is added to the page ONLY if the date format was entered correctly, this exception allows the user to use the programs even if they cannot read directions
      if(daysRemain != false)
      {
        spanTodo.innerHTML += "( " + daysRemaining + " )";  // this adds duedate status if date format was correctly inputted
      }

    var spanDone = document.createElement("span");
    if (!todoItem.done) {
        spanDone.setAttribute("class", "notDone");
        spanDone.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    else {
        spanDone.setAttribute("class", "done");
        spanDone.innerHTML = "&nbsp;&#10004;&nbsp;";
    }
    
    var spanDelete = document.createElement("span");
   
    spanDelete.setAttribute("class", "delete");
    spanDelete.innerHTML = "&nbsp;&#10007;&nbsp;";

    spanDelete.onclick = deleteItem;
    spanDone.onclick = changeStatus;
    li.appendChild(spanDone);
    li.appendChild(spanTodo);
    li.appendChild(spanDelete);
    
    return li;
}
             
function getFormData() {

    var task = document.getElementById("task").value;
    if (checkInputText(task, "Please enter a task")) return;

    var who = document.getElementById("who").value;
    if (checkInputText(who, "Please enter a person to do the task")) return;


    var date = document.getElementById("dueDate").value;
    if (checkInputText(date, "Please enter a due date")) return;
     
    var id = (new Date()).getTime();  //creates the unique id by using time
     
    if(currentGeoLoc.length != 0)  // as long as someone cannot fill each box and submit in 5 seconds this works
    {
      var latitudez = currentGeoLoc[0];  // getting the lat and long from the local that was added from geoLoc file
      var longitudez = currentGeoLoc[1];
      var myLocation = new Array();    //easier to put into a single array than 2 variables since these came form geoLoc file
      myLocation.push(latitudez);
      myLocation.push(longitudez);
    }
    else
    {
      myLocation = false;   //if the currentGeoLoc length is 0 that means the browser doesn't support it or some other error occured
    }
    
    var todoItem = new Todo(id, task, who, date, myLocation);
    
    todos.push(todoItem);
    addTodoToPage(todoItem);
    saveTodoItem(todoItem);
}

function checkInputText(value, msg) {
    if (value == null || value == "") {
        alert(msg);
        return true;
    }
    return false;
}

function searchFor() {
  if(searchCounter >= 1){    //if a li item was added, this counter was given a +1 to the global variable, activates the eraseOldLi()
     eraseOldLi();
     } 
  var counter = 0;
  var searchValue = document.getElementById("searchFor").value.toUpperCase().trim();  //used chaining to add the trim and upcase method here. 
  console.log(searchValue);
  if(searchValue == null || searchValue == ""){             //makes sure something is inputted
    alert("Please enter a PERSON or TASK to search for");
    }
    for(var i = 0; i < todos.length; i++) {
     var todoItem = todos[i];
     var re = new RegExp(searchValue, "ig");
     if(todoItem.who.match(re) || todoItem.task.match(re)){
       console.log("there is at least one match to your request!");
        var ul = document.getElementById("putHitsHere");
        var li = document.createElement("li")
        li.setAttribute("class","eraseMe");
        li.innerHTML = "Name: " + todoItem.who + "<br>" + "Task: " + todoItem.task;
        ul.appendChild(li);
        counter++;
        searchCounter = 1;          //this counter is used to determine if there is a li item that need to be removed  **line 187**
      }
      }
      if(counter == 0){             //used a counter because if I used "else" it would send a alert for the number of todoItems.length..annoying 
        alert("Sorry the item you requested does not exist, please try again");
      }
      document.forms[1].reset();    //resets the second form on the page only
      
}

function eraseOldLi() {
   document.getElementById("putHitsHere").innerHTML = ""; //this beats writing the code to find the parent and use remove child
 }                                                        //WHY EVEN MESS WITH REMOVECHILD IN INNERHTML
                   