angular.module('socialProPortalApp', [])
    .controller('socialProPortalController',['$scope',function($scope){
        var socialProPortal = this;
        socialProPortal.productLists = [
            {name: 'Content Cloud', status: false, targetUrl: ""},
            {name: 'Matrix分析师平台', status: false, targetUrl: "http://matrix.cn.miaozhen.com/analyst2/login.html"},
            {name: 'Truth', status: false, targetUrl: "http://truth.cn.miaozhen.com/login"},
            {name: '星盘', status: false, targetUrl: ""},
            {name: 'Tower', status: false, targetUrl: "https://tower.im/projects/56aa322a93b441d398f9e2741b21e7bb/"},
            {name: 'Lab', status: false, targetUrl: "http://lab.cn.miaozhen.com/"},
            {name: 'Singer', status: false, targetUrl: "http://singer.cn.miaozhen.com/"},
            {name: '秒针水表-内部', status: false, targetUrl: ""},
            {name: '秒针水表-外部', status: false, targetUrl: ""},
        ];
        $scope.seleProduct = function(product){
            window.open(product.targetUrl);
            //location.replace(product.targetUrl);
        };


    }]);
