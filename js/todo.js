angular.module('todoApp', [])
    .controller('TodoListController',['$scope',function($scope){
        var todoList = this;
        todoList.todos = [
            {text:'learn AngularJS', done:true},
            {text:'build an AngularJS app', done:false}];

        todoList.emailList = [
            {"email":"745671625@qq.com","name":"liugy"},
            {"email":"lgyww@outlook.com","name":"liugy"}
        ]

        todoList.addTodo = function() {
            todoList.todos.push({text:todoList.todoText, done:false});
            todoList.todoText = '';
        };

        todoList.remaining = function() {
            var count = 0;
            angular.forEach(todoList.todos, function(todo) {
                count += todo.done ? 0 : 1;
            });
            return count;
        };

        todoList.archive = function() {
            var oldTodos = todoList.todos;
            todoList.todos = [];
            angular.forEach(oldTodos, function(todo) {
                if (!todo.done) todoList.todos.push(todo);
            });
        };
        $scope.testFlag = true;
        $scope.test_sele_list = [{"attr":"2018-05-09","id":5243,"val":6637},
            {"attr":"2018-05-10","id":5244,"val":5375},
            {"attr":"2018-05-11","id":5245,"val":5777},
            {"attr":"2018-05-12","id":5246,"val":5804},
            {"attr":"2018-05-13","id":5247,"val":5761},
            {"attr":"2018-05-14","id":5248,"val":5797},
            {"attr":"2018-05-15","id":5249,"val":3624}];
        $scope.testSeleChange = function(seleValName){
            console.log("选中的值：",seleValName);
        };
        $scope.seleDataEvent = function(seleVal){
            console.log("打印出按钮点击选中的值：",seleVal);
            $scope.testSeleName = seleVal;
        };
    }]);
