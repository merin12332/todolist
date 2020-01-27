var todosBak = [];
jQuery(document).ready(function() {
    getTodos();

    jQuery("#addTask").click(function() { //addTask button is available by default whenever the document is ready--static html tags
        onAddTaskClick()
    })
    jQuery(document).on('click', '.edit', function() { //edit button is created dynamically
        onClickEdit(this);
        // console.log("Clicked on edit icon!");

    })
    jQuery(document).on('click', '.delete', function(event) {
        event.preventDefault();
        event.stopPropagation();
        // onClickDelete();
        console.log("Clicked on delete icon!");
        // var id = jQuery(this).closest('tr').find('td:eq(0)').text(); // old code, where s.no is marked with id
        var id = jQuery(this).closest('tr').attr('data-id'); // new code, where s.no is marked with index
        var task = jQuery(this).closest('tr').find('td:eq(1)').text();
        var verify = confirm("Are you sure you want to delete the task? " + task);
        if (verify) {
            jQuery.ajax({
                url: 'http://localhost:3000/todos/' + id,
                method: 'DELETE',
                success: function(response) {
                    console.log(response);
                    // resetForm();
                    // getTodos();
                },
                error: function(err) {

                }
            })
        }

    })

});

function onClickEdit(element) {
    // var id = jQuery(element).closest('tr').find('td:eq(0)').text(); // old code, where s.no is marked with id
    var id = jQuery(element).closest('tr').attr('data-id'); // new code, where s.no is marked with index
    var task = jQuery(element).closest('tr').find('td:eq(1)').text();
    jQuery("#enterTask").val(_.trim(task));
    jQuery("#enterTask").closest('.input-field').find('label').addClass('active');
    jQuery("#taskId").val(id);
    console.log(id);
}

function getTodos() {
    jQuery.ajax({
        url: 'http://localhost:3000/todos',
        success: function(response) {
            renderTodos(response);

        },
        error: function(err) {

        }

    })
}

function renderTodos(todos) {
    console.log("Todos", todos)
    todosBak = todos;
    html$ = ''; //empty string
    // for (var i = 0; i < todos.length; i++) {
    //     html$ +='<tr>';
    //     html$ +='<td>'+todos[i].id+'</td>';
    //     html$ +='<td>'+todos[i].text+'</td>';
    //     html$ +='<td></td>';
    //     html$ +='</tr>';
    // }
    // todos.forEach(function (x, index) {
    //     html$ += '<tr class="forEdit">';
    //     html$ += '<td>' + (index+1) + '</td>';
    //     html$ += '<td class="taskName">' + x.text + '</td>';
    //     html$ += '<td>  <button class="btn-floating btn-small waves-effect waves-light yellow edit"><i class="material-icons">edit</i></button>  <button class="btn-floating btn-small waves-effect waves-light red delete"><i class="material-icons">clear</i></button></td>';
    //     html$ += '</tr>';
    // })
    // jQuery('#todoTable tbody').html(html$)
    // console.log("HTML$", html$)


    //Lodash
    const template = _.template(jQuery("#todoRowTemplate").html());
    const compiled = template({ todos: todos });
    jQuery("#todoTable tbody").html(compiled);
}

function onAddTaskClick() {
    var task = jQuery("#enterTask").val();
    console.log("The task is ", task)
    if (!validTask(task)) {
        return;
    }
    console.log("Save the task")
    saveTask(task);
    return;
    //input validation

    // else {
    //     jQuery.getJSON({
    //         url: 'http://localhost:3000/todos',
    //         data: '',
    //         success: function (response) {
    //             console.log("success", response);
    //             for (var i = 0; i < response.length; i++) {
    //                 tr = $('<tr/>');
    //                 // tr.append("<td>" + response[i].id + "</td>");
    //                 tr.append("<td>" + response[i].text + "</td>");
    //                 // tr.append("<td>" + response[i].completed + "</td>");
    //                 $('.populate').append(tr)
    //             }
    //             //    jQuery(".populate .txt").text(response.text);
    //             // jQuery(".weatherInfo").find(".lat").text(response.coord.lat);
    //         }
    //     })
    // }
}

function validTask(task) {
    if (!task) {
        jQuery(".no-text").text("*This field is mandatory!");
        return; //returns false by default
    }
    if (task.length < 2) {
        jQuery(".no-text").text("*Should have atleast 2 characters.");
        return;
    }
    if (task.length > 6) {
        jQuery(".no-text").text("*Cannot exceed 6 characters.");
        return;
    }
    return true;
}

function saveTask(task) {
    if (jQuery("#taskId").val()) {
        //update the task
        jQuery.ajax({
            url: 'http://localhost:3000/todos/' + _.trim(jQuery('#taskId').val()),
            method: 'PUT',
            data: {

                text: task,
                completed: false
            },
            success: function(response) {
                // resetForm();
                // getTodos();
            },
            error: function(err) {
                console.log(err);
            }
        })
        return;
    }
    jQuery.ajax({
        url: 'http://localhost:3000/todos',
        method: 'POST',
        data: {
            id: (todosBak.length + 1),
            text: task,
            completed: false
        },
        success: function(response) {
            resetForm();
            getTodos();
        },
        error: function(err) {

        }
    })
}

function resetForm() {
    jQuery("#enterTask").val(''); //fetches val
    jQuery("#taskId").val('');
    jQuery(".no-text").text('');
}