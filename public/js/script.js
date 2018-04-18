
//----------------UIController ----------------

var socket = io();

// socket.on('connect',()=>{
//     console.log("New user Welcom");
// })
const UIController = (()=>{
    let DOMstrings ={
        formSubmit : '.form_submit',
        name :'.input_name',
        mobile :'.input_mobile',
        address :'.input_address',
        gender :'.input_gender',
        tableConatiner:'.table-conatiner',
        count:'.number',
        toast:'.error-toast',
        reset:'.resetAll',
        model:'.model',
        delete:'#delete',
        cancel:'#cancel',
        tableData:'.data-table',
        edit:'.ion-edit',
        editForm:'.form_edit'
    }
    // socket.on('newMessage',function(newVoluntary){
    //     console.log(newVoluntary);
    //     let html = `<tr><td>%Name%</td><td>%Mobile%</td><td><i id="vol-%id%" class="ion-trash-b" onclick="deleteUSer(this.id)">
    //                 </i></td><td><i id="vol-%id2%"  class="ion-edit" onclick="edit(this.id)"></i></td></tr>`;
    //         let newHtml = html.replace('%Name%',newVoluntary[0].name);
    //         newHtml = newHtml.replace('%Mobile%',newVoluntary[0].mobile);
    //         newHtml = newHtml.replace('%id%',newVoluntary[0]._id);
    //         newHtml = newHtml.replace('%id2%',newVoluntary[0]._id);
    //         document.querySelector(DOMstrings.tableConatiner).insertAdjacentHTML('afterend',newHtml);
    // })
    return{
        getDOMstrings:function(){return DOMstrings},
        fetchValues:()=>{
            return{
                name:document.querySelector(DOMstrings.name).value,
                mobile:document.querySelector(DOMstrings.mobile).value,
                address:document.querySelector(DOMstrings.address).value
                // gender:document.querySelector(DOMstrings.gender).checked
            }
        },
        addInTable:(newVoluntary)=>{
            console.log(newVoluntary);
            let html = `<tr><td>%Name%</td><td>%Mobile%</td><td><i id="vol-%id%" class="ion-trash-b" onclick="deleteUSer(this.id)">
                    </i></td><td><i id="vol-%id2%"  class="ion-edit" onclick="edit(this.id)"></i></td></tr>`;
            let newHtml = html.replace('%Name%',newVoluntary[0].name);
            newHtml = newHtml.replace('%Mobile%',newVoluntary[0].mobile);
            newHtml = newHtml.replace('%id%',newVoluntary[0]._id);
            newHtml = newHtml.replace('%id2%',newVoluntary[0]._id);
            document.querySelector(DOMstrings.tableConatiner).insertAdjacentHTML('afterend',newHtml);
        },
        changeCount:(length)=>{
            document.querySelector(DOMstrings.count).textContent= length;
        },
        clearFields:()=>{
            document.querySelector(DOMstrings.name).value ="";
            document.querySelector(DOMstrings.mobile).value ="";
            document.querySelector(DOMstrings.address).value ="";
            // document.querySelector(DOMstrings.gender).checked =false;
        },
        showAllUsers:(users)=>{
                users.forEach((user)=>{
                    let html = `<tr><td>%Name%</td><td>%Mobile%</td><td><i id="vol-%id%" class="ion-trash-b" onclick="deleteUSer(this.id)">
                    </i></td><td><i id="vol-%id2%" class="ion-edit" onclick="edit(this.id)"></i></td></tr>`;
                    let newHtml = html.replace('%Name%',user.name);
                    newHtml = newHtml.replace('%Mobile%',user.mobile);
                    newHtml = newHtml.replace('%id%',user._id);
                    newHtml = newHtml.replace('%id2%',user._id);
                    document.querySelector(DOMstrings.tableConatiner).insertAdjacentHTML('afterend',newHtml);
                });
        },
        removeAllUsers:()=>{
            document.querySelector(DOMstrings.tableData).innerHTML = "";
            let newHtml = `<thead> <tr class="table-conatiner"></tr> </thead>`;
            document.querySelector(DOMstrings.tableData).insertAdjacentHTML('beforeend',newHtml);

        },
        modelOpen:()=>{
            document.querySelector(DOMstrings.model).style.display = 'block';
        },
        closeModel:()=>{
            document.querySelector(DOMstrings.model).style.display = 'none';
        },
        UIshowError:(error)=>{
            var toast = document.querySelector(DOMstrings.toast);
                toast.style.display = "block";
                toast.textContent=error;
            setTimeout(function(){
                toast.style.display = "none";
            },3000)
        },
        editUser:(data)=>{
            console.log(data);
            
            document.querySelector(DOMstrings.name).value =data[0].name;
            document.querySelector(DOMstrings.formSubmit).style.display = 'none';
            document.querySelector(DOMstrings.mobile).value =data[0].mobile;
            document.querySelector(DOMstrings.address).value =data[0].address;
            document.querySelector(DOMstrings.editForm).style.display ="inline-block";
            document.querySelector(DOMstrings.editForm).id=data[0]._id;
        }
    };
})();


//----------------voluntaryController -----------
const voluntaryController = (()=>{
    let Voluntary = function(name,mobile,address) {
        
        this.name = name;
        this.mobile = mobile;
        this.address = address;
        // this.gender = gender;
    }
    var data=[];
    return {
        addVoluntary : (fetchValues)=>{
            if(fetchValues.name ===""){
                return;
            }
            let newVolunatry = new Voluntary(fetchValues.name,fetchValues.mobile,fetchValues.address);
            data.push(newVolunatry);
            return newVolunatry;
        },
        getData:(users)=>{
            data = users;
        },
        getLength: ()=>{
            return data.length
        }
        
    };
})();


//----------------DBController -----------------
const DBController =(()=>{
    return{
        getUsers:()=>{
          return  $.ajax({
                type :"GET",
                url :"/users",
                cache: false,
                })
                .done(function(data) {
                    users = data;
                    return data;
                })
                .fail(function(xhr) {
                    return xhr;
                });
        },
        deleteAll:()=>{
            return $.ajax({
                type:'GET',
                url:'deleteAll'
            })
            .done(function(data){
                return data;
            })
            .fail(function(data){
                console.log(data);
            })
        },
        deleteUser:(id)=>{
            var data ={
                _id:id
            }
            console.log(data);
            return $.ajax({
                type:'POST',
                url:'delete',
                contentType: 'application/json',
                cache: false,
                data:JSON.stringify(data)
            })
            .done(function(data){
                console.log(data);
                return data;
            })
        },
        findUser:(id)=>{
            var data ={
                _id:id
            }
          return  $.ajax({
                type:"POST",
                url:'findUser',
                contentType: 'application/json',
                cache: false,
                data:JSON.stringify(data)
            })
            .done(function(data){
                return data;
            })
        },
        updateUser:(data)=>{
             return  $.ajax({
                type:"POST",
                url:'updateUser',
                contentType: 'application/json',
                cache: false,
                data:JSON.stringify(data)
            })
            .done(function(data){
                return data;
            })
        }
    }
})();


//----------------appController-----------------
const appController = ((UICtrl,voluntaryCtrl,DBCtrl)=>{
    let DOMstrings = UICtrl.getDOMstrings();
     socket.on('newMessage',function(data){
          console.log(data);
            UICtrl.addInTable(data); 
            UICtrl.removeAllUsers();
            fetchUsers();
            UICtrl.clearFields(); 
    });
    socket.on('deleted',function(data){
        UICtrl.UIshowError(data);
        closeModel();
        fetchUsers();
        UICtrl.removeAllUsers();
    })
    socket.on('deletedUser',function(data){
            UICtrl.UIshowError(`${data.value.name} has removed`);
            UICtrl.removeAllUsers();
            fetchUsers();
    })
    socket.on('updatedUser',function(data){
        console.log(data);
        UICtrl.UIshowError("User Updated");
            document.querySelector(DOMstrings.formSubmit).style.display = 'inline-block';
            document.querySelector(DOMstrings.editForm).style.display ="none";
        UICtrl.removeAllUsers();
        fetchUsers();
        UICtrl.clearFields();
    })
    let ctrlAddVol =()=>{
        //fetch all values
        let fetchValues = UICtrl.fetchValues();
        // saved in db
        let newVoluntary = voluntaryCtrl.addVoluntary(fetchValues);
        if(!newVoluntary){
            UICtrl.UIshowError("Name can not be empty");
            return;
        }
        // emit submit user to server
        socket.emit('submitUSer',{
                fetchValues
        })  
    }
    let fetchUsers =()=>{
        var users;
       DBCtrl.getUsers().done(function(data){
           UICtrl.showAllUsers(data);
           voluntaryCtrl.getData(data);
           let length = voluntaryCtrl.getLength();
            UICtrl.changeCount(length);
       })
       .fail(function (data){
           console.log(data);
       });
    }
    let openModel =()=>{
        UICtrl.modelOpen();
    }
    let closeModel =()=>{
        UICtrl.closeModel();
    }
    let deleteAll =()=>{
        console.log("delete All");
        socket.emit('deleteAll',{"kg":'123'});
    
    }
    let updateUser =()=>{
        //fetch all values
        let fetchValues = UICtrl.fetchValues();
        // saved in db
        let updateVoluntary = voluntaryCtrl.addVoluntary(fetchValues);
        if(!updateVoluntary){
            UICtrl.UIshowError("Name can not be empty");
            return;
        }
        
        var id = document.querySelector(DOMstrings.editForm).id;
        fetchValues.id = id;
        socket.emit('updateUser',fetchValues);
    }
    let setAllEventListener =()=>{
        document.querySelector(DOMstrings.formSubmit).addEventListener('click',ctrlAddVol);
        document.querySelector(DOMstrings.reset).addEventListener('click',openModel);
        document.querySelector(DOMstrings.cancel).addEventListener('click',closeModel);
        document.querySelector(DOMstrings.delete).addEventListener('click',deleteAll);
        document.querySelector(DOMstrings.editForm).addEventListener('click',updateUser);
        
    }
    let deleteUser =(e)=>{
        //delete user from db
        var str = e.split("-");
        console.log(str[1]);
        socket.emit('deleteUser',str[1]);
        // DBCtrl.deleteUser(str[1]).done(function(data){
        //     UICtrl.UIshowError(`${data.value.name} has removed`);
        //     UICtrl.removeAllUsers();
        //     fetchUsers();

        // })
        // delete user from table
    }
    let edit =(e)=>{
        //delete user from db
        var str = e.split("-");
        console.log(str[1]);
        DBCtrl.findUser(str[1]).done(function(data){
            UICtrl.editUser(data);
            $('html, body').animate({ scrollTop: 0 }, 'fast');
        })
        // delete user from table
    }
    return{
        init:()=>{
                setAllEventListener();
                fetchUsers();
                
            },
            delete:(e)=>{
                deleteUser(e);
            },
            edit:(e)=>{
                edit(e);
            }
        }

})(UIController,voluntaryController,DBController);


//----------------appController-----------------
appController.init();


//----------------outside functions-----------------
let deleteUSer = (e)=>{
    appController.delete(e);
}
let edit = (e)=>{
    appController.edit(e);
}
