define(['AppCreater', 'jquery', 'UrlMappings', 'moment' ,'services/commonUIServices'],function(app,$,UrlMappings, moment){
    app
        .controller('dataAnalysisCtrl', ['$scope','doRequest','commonUI',function ($scope,doRequest,commonUI) {
            $scope.appraise_type = 9;
            $scope.element_level = 1;
            $scope.element_type = 11;
            $scope.orderWay = 0;
            $scope.orderSign = 5;
            $scope.hotRemarkTotal = 1000;
            $scope.translater = {
                Total_Buzz: $.i18n.prop("string_Total_Buzz"),
                Buzz_Trend: $.i18n.prop("string_Buzz_Trend"),
                Hourly_Distribution: $.i18n.prop("string_Hourly_Distribution"),
                Posting_Time: $.i18n.prop("string_Posting_Time"),
                Media_Type: $.i18n.prop("string_Media_Type"),
                Sentiment: $.i18n.prop("string_Sentiment"),
                Word_of_Mouth: $.i18n.prop("string_Word_of_Mouth"),
                Tweet_Detail: $.i18n.prop("string_Tweet_Detail"),
                Distribute: $.i18n.prop("string_Distribute"),
                Sex: $.i18n.prop("string_Sex"),
                Auth: $.i18n.prop("string_Auth"),
                Word_Cloud: $.i18n.prop("string_Word_Cloud"),
                Top_Posts: $.i18n.prop("string_Top_Posts"),
                Content: $.i18n.prop("string_Content"),
                Engagement: $.i18n.prop("string_Engagement"),
                Exposure_Count: $.i18n.prop("string_Exposure_Count"),
                Reputation_Ranking: $.i18n.prop("string_Reputation_Ranking"),
                Topic_Drivers: $.i18n.prop("string_Topic_Drivers"),
                Brand_Health: $.i18n.prop("string_Brand_Health"),
                Brand_Mentions: $.i18n.prop("string_Brand_Mentions"),
                Buzz_Volume: $.i18n.prop("string_Buzz_Volume"),
                Exposure: $.i18n.prop("string_Exposure"),
                Conversations: $.i18n.prop("string_Conversations"),
                Key_Drivers: $.i18n.prop("string_Key_Drivers"),
                Sub_Drivers: $.i18n.prop("string_Sub_Drivers"),
            };
            $scope.$on('initDataAnalysis', function(e) {
                $scope.initDataAnalysis();
            });
            var columns = [
                {
                    "field": "text",
                    "title": $.i18n.prop("string_Content"),
                    "align": "left",
                    "formatter": function(value,row,index){
                        if(value!=undefined) {
                            return '<span class = "hot_comment_span" title = "' + value + '">' + value.substring(0,20) + '...</span>'
                        }else {
                            return '';
                        }

                    }
                },{
                    "field": "activeCount",
                    "title": $.i18n.prop("string_Engagement"),
                    "align": "right",
                    "sortable": true,
                    "formatter": function(value){
                        return commonUI.number_formatter(value,"#,###")
                    }
                },{
                    "field": "exposureCount",
                    "title": $.i18n.prop("string_Exposure_Count"),
                    "align": "right",
                    "sortable": true,
                    "formatter": function(value){
                        return commonUI.number_formatter(value,"#,###")
                    }
                }
            ];
            $scope.initDataAnalysis = function(){
                commonUI.resetCharts();
                initTrendChart();
                initHourlyChart();
                if($scope.appraiseShow == true){
                    initAppraiseSorting();
                    initUserAppraise();
                }
                if($scope.elementShow == true){
                    initElementDiscusision();
                }
                initWordCouldChart();
                initHotCommentTable();
                initEmotionChart();
                initMediaChart();
                if($scope.tweetDetailFlag == true) {
                    initSexChart();
                    initAuthChart();
                    initMapChart();
                }
                setTimeout(function(){
                    commonUI.setContentHeight();
                },500);
            };
            $scope.downloadTrendChart = function(){
                var download_query = {
                    "accessToken": $scope.access_token,
                    "chartId": 1,
                    "campaignId": $scope.alertId,
                    "beginTime": Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                    "endTime": Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000,
                    "excelType":"BuzzTrend",
                };
                addFilterParams(download_query);
                doRequest.doDownload(UrlMappings.exportExcel,download_query);
            };
            $scope.downloadHourlyChart = function(){
                var download_query = {
                    "accessToken": $scope.access_token,
                    "chartId": 7,
                    "campaignId": $scope.alertId,
                    "beginTime": Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                    "endTime": Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000,
                    "excelType":"PostTimeAllocation"
                };
                addFilterParams(download_query);
                doRequest.doDownload(UrlMappings.exportExcel,download_query);
            };
            $scope.downloadAppraiseSorting = function(){
                var download_query = {
                    "accessToken": $scope.access_token,
                    "chartId": $scope.appraise_type,
                    "campaignId": $scope.alertId,
                    "beginTime": Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                    "endTime": Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000,
                    "excelType":"PostSOV"
                };
                addFilterParams(download_query);
                doRequest.doDownload(UrlMappings.exportExcel,download_query);
            };
            $scope.downloadElementDiscusision = function(){
                var chartId = 11;
                if($scope.element_level == 1 && $scope.element_type == 11){
                    chartId = 11;
                }else if($scope.element_level == 1 && $scope.element_type == 12){
                    chartId = 13;
                }else if($scope.element_level == 1 && $scope.element_type == 13){
                    chartId = 23;
                }else if($scope.element_level == 2 && $scope.element_type == 11){
                    chartId = 16;
                }else if($scope.element_level == 2 && $scope.element_type == 12){
                    chartId = 17;
                }else if($scope.element_level == 2 && $scope.element_type == 13){
                    chartId = 24;
                }
                var download_query = {
                    "accessToken": $scope.access_token,
                    "chartId": chartId,
                    "campaignId": $scope.alertId,
                    "beginTime": Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                    "endTime": Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000,
                    "excelType":"AspectAllocation"
                };
                addFilterParams(download_query);
                doRequest.doDownload(UrlMappings.exportExcel,download_query);
            };
            $scope.downloadUserAppraise = function(){
                var download_query = {
                    "accessToken": $scope.access_token,
                    "chartId": 12,
                    "campaignId": $scope.alertId,
                    "beginTime": Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                    "endTime": Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000,
                    "excelType":"HealthMatrix"
                };
                addFilterParams(download_query);
                doRequest.doDownload(UrlMappings.exportExcel,download_query);
            };
            $scope.downloadWordCloudChart = function(){
                var download_query = {
                    "accessToken": $scope.access_token,
                    "industryAlertId": $scope.alertId,
                    "excelType":"KeywordsCloud",
                    "beginTime": $scope.startDayId,
                    "endTime": $scope.endDayId
                };
                addFilterParams(download_query);
                doRequest.doDownload(UrlMappings.exportExcel,download_query);
            };
            $scope.downloadSexChart = function () {
                var download_query = {
                    "accessToken": $scope.access_token,
                    "chartId": 27,
                    "industryAlertId": $scope.alertId,
                    "beginTime": $scope.startDayId,
                    "endTime": $scope.endDayId,
                    "excelType": "GenderAllocation"
                };
                addFilterParams(download_query);
                doRequest.doDownload(UrlMappings.exportExcel, download_query);
            };
            $scope.downloadAuthChart = function () {
                var download_query = {
                    "accessToken": $scope.access_token,
                    "chartId": 28,
                    "industryAlertId": $scope.alertId,
                    "beginTime": $scope.startDayId,
                    "endTime": $scope.endDayId,
                    "excelType": "VerTypeAllocation"
                };
                addFilterParams(download_query);
                doRequest.doDownload(UrlMappings.exportExcel, download_query);
            };
            $scope.downloadDistrChart = function(){
                var download_query = {
                    "accessToken": $scope.access_token,
                    "chartId": 29,
                    "industryAlertId": $scope.alertId,
                    "beginTime": $scope.startDayId,
                    "endTime": $scope.endDayId,
                    "excelType": "ProvinceCodeAllocation"
                };
                addFilterParams(download_query);
                doRequest.doDownload(UrlMappings.exportExcel, download_query);
            };
            $scope.downloadHotComment = function(){
                console.log('dataAnalysisCtrl中的downloadHotComment');
                var download_query = {
                    "accessToken": $scope.access_token,
                    "campaignId": $scope.alertId,
                    "beginTime": Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                    "endTime": Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000,
                    "excelType":"HotTweet",
                    "orderSign":$scope.orderSign, //曝光数取值为5，互动数取值为4
                    "orderWay" : $scope.orderWay,
                    "total" : $scope.hotRemarkTotal   //下载总数
                };
                addFilterParams(download_query);
                doRequest.doDownload(UrlMappings.exportExcel,download_query);
            };
            $scope.downloadMediaChart = function(){
                console.log('dataAnalysisCtrl中的downloadMediaChart');
                var download_query = {
                    "accessToken": $scope.access_token,
                    "chartId": 20,
                    "industryAlertId": $scope.alertId,
                    "beginTime": $scope.startDayId,
                    "endTime": $scope.endDayId,
                    "excelType":"MediaAllocation"
                };
                addFilterParams(download_query);
                doRequest.doDownload(UrlMappings.exportExcel,download_query);
            };
            $scope.downloadEmotionChart = function(){
                var download_query = {
                    "accessToken": $scope.access_token,
                    "chartId": 21,
                    "industryAlertId": $scope.alertId,
                    "beginTime": $scope.startDayId,
                    "endTime": $scope.endDayId,
                    "excelType":"TonalityAllocation"
                };
                addFilterParams(download_query);
                console.log("下载的参数33333333333333：",download_query);
                doRequest.doDownload(UrlMappings.exportExcel,download_query);
            };
            $scope.downloadDataAnalysisTable = function(){
                //http://112.74.33.242:2010/dataapi/exportExcel.exportExcel?accessToken=${accessToken}&excelType=campaignall&
                //ptTreeId=393&dtTreeId=394&campaignId=263&orderSign=4&orderWay=0&beginTime=1476374400&endTime=1476979199&postchartId=9&aspectId=11
                var download_query = {
                    "accessToken": $scope.access_token,
                    "campaignId": $scope.alertId,
                    "beginTime": Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                    "endTime": Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000,
                    "excelType":"campaignall",
                    "ptTreeId":$scope.dttreeId,
                    "dtTreeId":$scope.pttreeId,
                    "orderSign":$scope.orderSign, //曝光数取值为5，互动数取值为4
                    "orderWay" : $scope.orderWay
                };
                addFilterParams(download_query);
                doRequest.doDownload(UrlMappings.exportExcel,download_query);
            };
            $scope.$on('downloadDataAnalysisTable', function(e) {
                $scope.downloadDataAnalysisTable();
            });
            $scope.addToDashboard = function(){
                //http://112.74.33.242:2010/dataapi/service/mzAPI/V1/addReportWidget?createUserId=6&functionModel.id=263&reportCenter.id=0&reportCenter.name=test11&
                //reportCenter.dpId=294&widgetInfo.id=5&accessToken=4199a5f6b182fdc914c1ee49cafbb995
                var add_params = {
                    "accessToken": $scope.access_token,
                    "createUserId": $scope.userId, //#创建者id#
                    "functionModel.id": $scope.alertId, //#监测主题id#
                    "widgetInfo.id": $scope.widgetId,//widgetId
                };
                if($scope.optionsRadios == 'addToExist'){
                    add_params["reportCenter.id"] = $scope.dashboardSelected;
                }else{
                    add_params["reportCenter.clientId"] = $scope.clientId;
                    add_params["reportCenter.id"] = 0;
                    add_params["reportCenter.dpId"] = $scope.panelId;
                    add_params["reportCenter.name"] = $scope.dashboardName;
                    //add_params["reportCenter.createTime"] = moment().format('YYYY/MM/DD HH:mm:ss');
                }
                extraObj = {}
                addFilterParams(extraObj);
                add_params.params = JSON.stringify(extraObj);
                var i = 0;
                var url = UrlMappings.addReportWidget;
                for(a in add_params){
                    if(i++ > 0){
                        url += "&";
                    }else{
                        url += "?";
                    }
                    url += (a + "=" + add_params[a]);
                }
                doRequest.doPost(url,add_params,function(model){
                    if(model && model["WSBoolean"] && model["WSBoolean"]["success"] == true){
                        window.initMenus();
                        alert("仪表板创建成功！");
                        $('#addDashboardModal').modal('hide');
                    }else{
                        alert("仪表板创建失败！");
                    }
                });
            };
            $scope.widgetId = 0;
            $scope.launchDashboardModal = function(widgetId){
                $scope.widgetId = widgetId;
                $('#addDashboardModal').modal('show');
            };
            var dashboard_query = {
                'accessToken': $scope.access_token,
                'id':$scope.panelId
            };
            $scope.optionsRadios = "addToExist";
            $scope.dashboardList = [];
            doRequest.doGet(UrlMappings.showReportCenters,dashboard_query,function(model){
                if(model != null && model['WsSuiteResult'] != null && model['WsSuiteResult']['success'] == true){
                    if(model['WsSuiteResult']['reportCenters'] != null){
                        var dashboards = model['WsSuiteResult']['reportCenters'];
                        if(Array.isArray(dashboards)){
                            for(t in dashboards){
                                if(dashboards[t]['deleteFlag'] == 0){
                                    $scope.dashboardList.push({
                                        "id": dashboards[t]['id'],
                                        "name": dashboards[t]['name']
                                    });
                                }
                            }
                        }else{
                            if(dashboards['deleteFlag'] == 0){
                                $scope.dashboardList.push({
                                    "id": dashboards['id'],
                                    "name": dashboards['name']
                                });
                            }
                        }
                    }
                }
            });
            //添加请求各种图表的请求参数
            var addFilterParams = function(obj){
                if($scope.filter_conditions.keyWords != null && $scope.filter_conditions.keyWords.length > 0){
                    obj.keyWords = "("+$scope.filter_conditions.keyWords.join('AND')+")";
                }
                if($scope.filter_conditions.localHourId != null && $scope.filter_conditions.localHourId.length > 0){
                    obj.localHourId = $scope.filter_conditions.localHourId.join(',');
                }
                if($scope.filter_conditions.ptCatIds != null && $scope.filter_conditions.ptCatIds.length > 0){
                    obj.ptCatIds = $scope.brand_dic[$scope.filter_conditions.ptCatIds[0]];
                }else if($scope.filter_conditions.ptCatIds_sort != null && $scope.filter_conditions.ptCatIds_sort.length > 0){
                    obj.ptCatIds = $scope.brand_sort_dic[$scope.filter_conditions.ptCatIds_sort[0]];
                }
                if($scope.filter_conditions.dtCatIds != null && $scope.filter_conditions.dtCatIds.length > 0){
                    obj.dtCatIds = $scope.elements_dic[$scope.filter_conditions.dtCatIds[0]];
                }
                //$scope.filter_conditions.sentiments是数组，在点击某一项的时候赋值；
                //$scope.sentiments_dic是对象，在请求数据的时候赋值；
                if($scope.filter_conditions.sentiments != null && $scope.filter_conditions.sentiments.length > 0){
                    obj.sentiments = $scope.sentiments_dic[$scope.filter_conditions.sentiments[0]];
                }else if($scope.filter_conditions_hidden.sentiments != null && $scope.filter_conditions_hidden.sentiments.length > 0){
                    obj.sentiments = $scope.filter_conditions_hidden.sentiments.join(',');
                }
                if($scope.filter_conditions.medias != null && $scope.filter_conditions.medias.length > 0){
                    obj.medias = $scope.medias_dic[$scope.filter_conditions.medias[0]];
                }
                if($scope.filter_conditions_hidden.userId != null && $scope.filter_conditions_hidden.userId.length > 0){
                    obj.userIds = $scope.filter_conditions_hidden.userId[0];
                }
                if($scope.filter_conditions.sexTypes != null && $scope.filter_conditions.sexTypes.length >0) {
                    obj.gender = $scope.sex_dic[$scope.filter_conditions.sexTypes[0]];  //等号右边实则在为获取对象的值
                    //obj.gender = $scope.filter_conditions.sexTypes[0];
                    obj.medias = 1;   //因为后台只有在medias!=null的情况下才会进行sex与auth的筛选
                }
                if($scope.filter_conditions.authTypes != null && $scope.filter_conditions.authTypes.length >0) {
                    obj.verTypes = $scope.auth_dic[$scope.filter_conditions.authTypes[0]];
                    //obj.verTypes = $scope.filter_conditions.authTypes[0];
                    obj.medias = 1;   //因为后台只有在medias!=null的情况下才会进行sex与auth的筛选
                }
                if($scope.filter_conditions.distributes != null && $scope.filter_conditions.distributes.length >0) {
                    // obj.distributes = $scope.distribute_dic[$scope.filter_conditions.distributes[0]];
                    obj.distributes = $scope.filter_conditions.distributes[0];
                }
                if($scope.filter_conditions.selectedDate != null && $scope.filter_conditions.selectedDate.length > 0){
                    obj.beginTime = Date.parse($scope.filter_conditions.selectedDate[0] + ' 00:00:00')/1000;
                    obj.endTime = Date.parse($scope.filter_conditions.selectedDate[0] + ' 23:59:59')/1000;
                }
            };
            //热门帖子
            var initHotCommentTable = function(){
                var get_hotComment_query = {
                    "accessToken": $scope.access_token,
                    "alertId": $scope.alertId,
                    "beginTime": Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                    "endTime": Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000,
                    "searchType": 2,
                    "sourceTypes":"dm",
                    "orderSign":$scope.orderSign, //曝光数取值为5，互动数取值为4
                    "orderWay" : $scope.orderWay,
                    "pagesize":5,
                    "offset":0
                };
                addFilterParams(get_hotComment_query);
                var queryParams = function(params) {
                    if(params.order == "desc"){
                        get_hotComment_query.orderWay = 0;
                        $scope.orderWay = 0;
                    }else{
                        get_hotComment_query.orderWay = 1;
                        $scope.orderWay = 1;
                    }
                    if(params.sort == "activeCount"){
                        get_hotComment_query.orderSign = 4;
                        $scope.orderSign = 4;
                    }else if(params.sort == "exposureCount"){
                        get_hotComment_query.orderSign = 5;
                        $scope.orderSign = 5;
                    }
                    if(params.offset !== undefined){
                        get_hotComment_query.offset = params.offset;
                    }
                    return get_hotComment_query;
                };
                var ajax = function(params) {
                    doRequest.doGet(params.url,params.data,function(model){
                        if(model != null && model['WsSuiteResult'] != null && model['WsSuiteResult']['success'] == false){
                            console.log('热门帖子加载失败：' + model['WsSuiteResult']['errorMsg']);
                        }
                        var datas = [];
                        if(model != null && model['WsSuiteResult'] != null &&
                            model['WsSuiteResult']['tweets'] != null){
                            datas = model['WsSuiteResult']['tweets'];
                        }
                        var table_data = [];
                        if(Array.isArray(datas)){
                            for(d in datas){
                                table_data.push({
                                    text: datas[d].text,
                                    exposureCount: datas[d].exposureCount,
                                    activeCount: datas[d].activeCount,
                                    url: datas[d].url
                                });
                            }
                        }else {
                            table_data.push({
                                text: datas.text,
                                exposureCount: datas.exposureCount,
                                activeCount: datas.activeCount,
                                url: datas.url
                            });
                        }
                        var t_data = {
                            "total": model['WsSuiteResult']['totalCount'],
                            "rows": table_data
                        };
                        commonUI.loadDatagridData('hot-comment-table',t_data);
                    });
                };
                var onClickRow = function(row, $element, field){
                    if(row.url != undefined){
                        window.open(row.url);
                    }
                };
                setTimeout(function(){
                    commonUI.multiPageDatagrid('hot-comment-table',columns,UrlMappings.showESTweets,queryParams,ajax,onClickRow);
                },500);
            };
            // 字符云
            var initWordCouldChart = function(){
                var createRandomItemStyle = function() {
                    return {
                        normal: {
                            color: 'rgb(' + [
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160)
                            ].join(',') + ')'
                        }
                    };
                };
                commonUI.showLoadingChart('wordCloud_chart');
                //http://112.74.33.242:2010/dataapi/service/mzAPI/V1/showESDataChart?accessToken=${accessToken}alertId=278&beginTime=1475510400&chartId=20&endTime=1476115199&endDayId=4667&searchType=2&starDayId=4661&sourceTypes=dp
                var get_wordCouldchart_query =
                    {
                        "accessToken": $scope.access_token,
                        "alertId": $scope.alertId,
                        "searchType": 2,
                        "searchTypes":"dm",
                        "beginTime":Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                        "endTime":Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000
                    };

                addFilterParams(get_wordCouldchart_query);
                doRequest.doGet(UrlMappings.showESHotKeyWords,get_wordCouldchart_query,function(model){
                    var datas = [];
                    if(model != null && model['WSTweetQueryResult'] != null && model['WSTweetQueryResult']['success'] == false){
                        console.log('字符云加载失败：' + model['WSTweetQueryResult']['errorMsg']);
                    }else if(model != null && model['WSTweetQueryResult'] != null &&
                        model['WSTweetQueryResult']['hotKeys'] != null){
                        datas = model['WSTweetQueryResult']['hotKeys'];
                    }
                    var serie_data = [];
                    var ind = 99;
                    for(d in datas){
                        if(ind >= 0){
                            serie_data.push({
                                name: datas[d].term,
                                value: datas[d].tfDocFreq * 100 + ind--,
                                itemStyle: createRandomItemStyle()
                            });
                        }
                    }
                    var series = [{
                        name: '内容词云',
                        type: 'wordCloud',
                        size: ['100%', '100%'],
                        textRotation : [45, -45],
                        textPadding: 2,
                        data: serie_data
                    }];
                    var click_function = function(ev){
                        if($scope.filter_conditions.keyWords == undefined){
                            $scope.filter_conditions.keyWords = [];
                            $scope.filter_conditions.keyWords.push(ev.name);
                            showFilter();
                            $scope.$apply();
                            commonUI.initTags("tag_keyWords",function(tagName){
                                var posi = $.inArray(tagName,$scope.filter_conditions.keyWords);
                                if(posi >= 0){
                                    $scope.filter_conditions.keyWords.splice($.inArray(tagName,$scope.filter_conditions.keyWords),1);
                                    //commonUI.removeTag("tag_keyWords",tagName);
                                    if($scope.filter_conditions.keyWords.length == 0){
                                        delete $scope.filter_conditions.keyWords;
                                        if(Object.keys($scope.filter_conditions).length == 0){
                                            $('.condition_filter_container').hide();
                                        }
                                    }else{
                                        commonUI.removeTag("tag_keyWords",tagName);
                                    }
                                    $scope.$apply();
                                    $scope.reloadPage();
                                }else{
                                    return;
                                }

                            });
                        }else{
                            if($scope.filter_conditions.keyWords.indexOf(ev.name) < 0){
                                $scope.filter_conditions.keyWords.push(ev.name);
                                $scope.$apply();
                                commonUI.addTag('tag_keyWords',ev.name);
                            }
                        }
                        $scope.initPage();
                    };
                    commonUI.wordCloudChart('wordCloud_chart', series, click_function);
                });
            };
            //品牌口碑图
            var initUserAppraise = function(){
                //http://112.74.33.242:2010/dataapi/service/mzAPI/V1/showESDataChart?accessToken=${accessToken}alertId=278&beginTime=1475510400&chartId=20&endTime=1476115199&endDayId=4667&searchType=2&starDayId=4661&sourceTypes=dp
                var get_userAppraise_query =
                    {
                        "accessToken": $scope.access_token,
                        "alertId": $scope.alertId,
                        "chartId": 12,
                        "searchType": 2,
                        "searchTypes":"dm",
                        "beginTime":Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                        "endTime":Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000
                    };
                commonUI.showLoadingChart('user_appraise_chart');
                addFilterParams(get_userAppraise_query);
                doRequest.doGet(UrlMappings.showESDataChart,get_userAppraise_query,function(model){
                    var datas = [];
                    if(model != null && model['WSAnaysisData'] != null && model['WSAnaysisData']['success'] == false){
                        console.log('品牌口碑图加载失败：' + model['WSAnaysisData']['errorMsg']);
                    }else if(model != null && model['WSAnaysisData'] != null &&
                        model['WSAnaysisData']['success'] == true && model['WSAnaysisData']['datas'] != null){
                        datas = model['WSAnaysisData']['datas'];
                    }
                    var legend = [$.i18n.prop("string_Brand_Mentions")], serie_data = [];
                    var val_sum = 0, val1_sum = 0, val2_sum = 0, val_count = 0;
                    if(Array.isArray(datas)){
                        for(d in datas){
                            serie_data.push({name:datas[d].attr,value:[
                                    datas[d].val,
                                    datas[d].val1,
                                    datas[d].val2
                                    //parseInt(Math.sqrt(datas[d].val2).toFixed(0))
                                ],
                                itemStyle: {
                                    normal : {
                                        color:commonUI.getRandomColor()
                                    }
                                }});

                            val_sum += parseInt(datas[d].val);
                            val1_sum += parseInt(datas[d].val1);
                            val2_sum += parseInt(datas[d].val2);
                            //val2_sum += parseInt(Math.sqrt(datas[d].val2).toFixed(0));
                            $scope.brand_dic[datas[d].attr] = datas[d].id;
                            val_count++;
                        }
                    }else{
                        serie_data.push({name:datas.attr,value:[
                                datas.val,
                                datas.val1,
                                datas.val2
                                //parseInt(Math.sqrt(datas[d].val2).toFixed(0))
                            ],
                            itemStyle: {
                                normal : {
                                    color:commonUI.getRandomColor()
                                }
                            }});
                        val_sum = parseInt(datas.val);
                        val1_sum = parseInt(datas.val1);
                        val2_sum = parseInt(datas.val2);
                        //val2_sum = parseInt(Math.sqrt(datas.val2).toFixed(0));
                        $scope.brand_dic[datas.attr] = datas.id;
                        val_count++;
                    }
                    var val_ave = Math.round(val_sum / val_count);
                    var val1_ave = Math.round(val1_sum / val_count);
                    var val2_ave = Math.round(val2_sum / val_count);
                    var series = [
                        {
                            name:$.i18n.prop("string_Brand_Mentions"),
                            type:'scatter',
                            symbolSize: function (value){
                                var radio = 1;
                                if(val2_ave > 100000){
                                    radio = Math.round(value[2] / 10000);
                                }else if(val2_ave > 10000){
                                    radio = Math.round(value[2] / 1000);
                                }else if(val2_ave > 1000){
                                    radio = Math.round(value[2] / 100);
                                }else if(val2_ave > 100){
                                    radio = Math.round(value[2] / 10);
                                }else{
                                    radio = Math.round(value[2] / 1);
                                }
                                if(radio > 1){
                                    return Math.sqrt(radio);
                                    //return radio;
                                }else{
                                    return 1;
                                }
                            },
                            itemStyle: {
                                normal : {
                                    label : {
                                        show: true,
                                        formatter : '{b}'
                                    }
                                }
                            },
                            data: serie_data,
                            markLine : {
                                clickable: false,
                                symbol: ['none','none'],
                                itemStyle: {
                                    normal : {
                                        lineStyle : {
                                            color: '#FF0000',
                                            type: 'solid'
                                        },
                                        label : {
                                            show: false
                                        }
                                    }
                                },
                                data : [
                                    {type : 'average', name: '平均值'},
                                    {type : 'average', name: '平均值', valueIndex:0}
                                ]
                            }
                        }
                    ];
                    var click_function = function(ev){
                        var ptCatId = ev.name;
                        if($scope.filter_conditions.ptCatIds == undefined){
                            $scope.filter_conditions.ptCatIds = [];
                            $scope.filter_conditions.ptCatIds.push(ptCatId);
                            showFilter();
                            $scope.$apply();
                            commonUI.initTags("tag_ptCatIds",function(tagName){
                                if($.inArray(tagName,$scope.filter_conditions.ptCatIds) >= 0){
                                    //$scope.filter_conditions.ptCatIds.splice($.inArray(tagName,$scope.filter_conditions.ptCatIds),1);
                                    //commonUI.removeTag("tag_ptCatIds",tagName);
                                    delete $scope.filter_conditions.ptCatIds;
                                    delete $scope.filter_conditions_hidden.sentiments;
                                    if(Object.keys($scope.filter_conditions).length == 0){
                                        $('.condition_filter_container').hide();
                                    }
                                    $scope.$apply();
                                    $scope.reloadPage();
                                }
                            });
                        }else{
                            if($scope.filter_conditions.ptCatIds.indexOf(ptCatId) < 0){
                                $scope.filter_conditions.ptCatIds.push(ptCatId);
                                $scope.$apply();
                                commonUI.addTag('tag_ptCatIds',ptCatId);
                            }
                        }
                        $scope.filter_conditions_hidden.sentiments = [-1,1];
                        $scope.initPage();
                    }
                    commonUI.scatterChart('user_appraise_chart',legend,series,click_function);
                });
            };
            //口碑排名
            var initAppraiseSorting = function(appraise_type){
                //http://112.74.33.242:2010/dataapi/service/mzAPI/V1/showESDataChart?accessToken=${accessToken}&alertId=278&beginTime=1475510400&chartId=9&endTime=1476115199&endDayId=4667&searchType=2&starDayId=4661&sourceTypes=dm
                if(appraise_type != undefined){
                    $scope.appraise_type = appraise_type;
                }
                var get_appraiseSorting_query = {
                    "accessToken": $scope.access_token,
                    "alertId": $scope.alertId,
                    "beginTime": Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                    "chartId": $scope.appraise_type,
                    "endTime": Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000,
                    "searchType": 2,
                    "searchTypes":"dm"
                };
                commonUI.showLoadingChart('appraise_sorting_chart');
                addFilterParams(get_appraiseSorting_query);
                doRequest.doGet(UrlMappings.showESDataChart,get_appraiseSorting_query,function(model){
                    var datas = [];
                    if(model != null && model['WSAnaysisData'] != null && model['WSAnaysisData']['success'] == false){
                        console.log('口碑排名图加载失败：' + model['WSAnaysisData']['errorMsg']);
                    }else if(model != null && model['WSAnaysisData'] != null &&
                        model['WSAnaysisData']['success'] == true && model['WSAnaysisData']['datas'] != null){
                        datas = model['WSAnaysisData']['datas'];
                    }
                    var legend = []; // = ['数据一','数据二'];
                    var axis_data = [], serie_data = [], serie_data1 = [];
                    if(Array.isArray(datas)){
                        for(d = datas.length - 1; d >= 0; d--){
                            axis_data.push(datas[d].attr);
                            serie_data.push(datas[d].val);
                            serie_data1.push(datas[d].val1);
                            $scope.brand_sort_dic[datas[d].attr] = datas[d].id;
                        }
                    }else{
                        axis_data.push(datas.attr);
                        serie_data.push(datas.val);
                        serie_data1.push(datas.val1);
                        $scope.brand_sort_dic[datas.attr] = datas.id;
                    }

                    var series = [
                        {
                            name:'口碑排名',
                            type:'bar',
                            data:serie_data
                        }/*,
                    {
                        name:'数据二',
                        type:'bar',
                        data:serie_data1
                    }*/
                    ];
                    xAxis = [
                        {
                            type : 'value'
                        }
                    ];
                    yAxis = [
                        {
                            type : 'category',
                            data : axis_data
                        }
                    ];
                    var click_function = function(ev){
                        var ptCatId = ev.name;
                        if($scope.filter_conditions.ptCatIds_sort == undefined){
                            $scope.filter_conditions.ptCatIds_sort = [];
                            $scope.filter_conditions.ptCatIds_sort.push(ptCatId);
                            showFilter();
                            $scope.$apply();
                            commonUI.initTags("tag_ptCatIds_sort",function(tagName){
                                if($.inArray(tagName,$scope.filter_conditions.ptCatIds_sort) >= 0){
                                    //$scope.filter_conditions.ptCatIds.splice($.inArray(tagName,$scope.filter_conditions.ptCatIds),1);
                                    //commonUI.removeTag("tag_ptCatIds",tagName);
                                    delete $scope.filter_conditions.ptCatIds_sort;
                                    if(Object.keys($scope.filter_conditions).length == 0){
                                        $('.condition_filter_container').hide();
                                    }
                                    $scope.$apply();
                                    $scope.reloadPage();
                                }
                            });
                        }else{
                            if($scope.filter_conditions.ptCatIds_sort.indexOf(ptCatId) < 0){
                                $scope.filter_conditions.ptCatIds_sort.push(ptCatId);
                                $scope.$apply();
                                commonUI.addTag('tag_ptCatIds_sort',ptCatId);
                            }
                        }
                        $scope.initPage();
                    };
                    commonUI.barChart('appraise_sorting_chart',series,legend,xAxis,yAxis,click_function);
                });
            };
            $scope.initAppraiseSorting = initAppraiseSorting;
            //讨论要素图
            var initElementDiscusision = function(type,value){
                //http://112.74.33.242:2010/dataapi/service/mzAPI/V1/showESDataChart?accessToken=${accessToken}alertId=278&beginTime=1475510400&chartId=20&endTime=1476115199&endDayId=4667&searchType=2&starDayId=4661&sourceTypes=dp
                //一级讨论且讨论量取值为11，一级讨论且曝光数取值为13，一级讨论且对话数取值为23，
                //二级讨论且讨论数取值为16，二级讨论且曝光数取值为17，二级讨论且对话数取值为24，
                var chartId = 11;
                if(type == 'et'){
                    $scope.element_type = value;
                }else if(type == 'el'){
                    $scope.element_level = value;
                }

                if($scope.element_level == 1 && $scope.element_type == 11){
                    chartId = 11;
                }else if($scope.element_level == 1 && $scope.element_type == 12){
                    chartId = 13;
                }else if($scope.element_level == 1 && $scope.element_type == 13){
                    chartId = 23;
                }else if($scope.element_level == 2 && $scope.element_type == 11){
                    chartId = 16;
                }else if($scope.element_level == 2 && $scope.element_type == 12){
                    chartId = 17;
                }else if($scope.element_level == 2 && $scope.element_type == 13){
                    chartId = 24;
                }
                var get_elementDiscusision_query =
                    {
                        "accessToken": $scope.access_token,
                        "alertId": $scope.alertId,
                        "chartId": chartId,
                        "searchType": 2,
                        "searchTypes":"dm",
                        "beginTime":Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                        "endTime":Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000
                    };
                commonUI.showLoadingChart('element_discussion_chart');
                addFilterParams(get_elementDiscusision_query);
                doRequest.doGet(UrlMappings.showESDataChart,get_elementDiscusision_query,function(model){
                    var datas = [];
                    if(model != null && model['WSAnaysisData'] != null && model['WSAnaysisData']['success'] == false){
                        console.log('要素讨论图加载失败：' + model['WSAnaysisData']['errorMsg']);
                    }else if(model != null && model['WSAnaysisData'] != null &&
                        model['WSAnaysisData']['success'] == true && model['WSAnaysisData']['datas'] != null){
                        datas = model['WSAnaysisData']['datas'];
                    }
                    var legend = [], serie_data = [];
                    if(Array.isArray(datas)){
                        for(d in datas){
                            legend.push(datas[d].attr);
                            serie_data.push({value:datas[d].val, name:datas[d].attr});
                            $scope.elements_dic[datas[d].attr] = datas[d].id;
                        }
                    }else{
                        legend.push(datas.attr);
                        serie_data.push({value:datas.val, name:datas.attr});
                        $scope.elements_dic[datas.attr] = datas.id;
                    }
                    var series = [
                        {
                            name:'要素讨论',
                            type:'pie',
                            radius : ['50%', '70%'],
                            itemStyle : {
                                normal : {
                                    label : {
                                        show : false
                                    },
                                    labelLine : {
                                        show : false
                                    }
                                },
                                emphasis : {
                                    label : {
                                        show : true,
                                        position : 'center',
                                        textStyle : {
                                            fontSize : '30',
                                            fontWeight : 'bold'
                                        }
                                    }
                                }
                            },
                            data:serie_data
                        }
                    ];
                    var click_function = function(ev){
                        var dtCatId = ev.name;
                        if($scope.filter_conditions.dtCatIds == undefined){
                            $scope.filter_conditions.dtCatIds = [];
                            $scope.filter_conditions.dtCatIds.push(dtCatId);
                            showFilter();
                            $scope.$apply();
                            commonUI.initTags("tag_dtCatIds",function(tagName){
                                if($.inArray(tagName,$scope.filter_conditions.dtCatIds) >= 0){
                                    //$scope.filter_conditions.dtCatIds.splice($.inArray(tagName,$scope.filter_conditions.dtCatIds),1);
                                    //commonUI.removeTag("tag_dtCatIds",tagName);
                                    delete $scope.filter_conditions.dtCatIds;
                                    if(Object.keys($scope.filter_conditions).length == 0){
                                        $('.condition_filter_container').hide();
                                    }
                                    $scope.$apply();
                                    $scope.reloadPage();
                                }
                            });
                        }else{
                            if($scope.filter_conditions.dtCatIds.indexOf(dtCatId) < 0){
                                $scope.filter_conditions.dtCatIds.push(dtCatId);
                                $scope.$apply();
                                commonUI.addTag('tag_dtCatIds',dtCatId);
                            }
                        }
                        $scope.initPage();
                    };
                    commonUI.pieChart('element_discussion_chart',legend,series,click_function);

                });
            };
            $scope.initElementDiscusision = initElementDiscusision;
            //整体声量趋势图
            var initTrendChart = function(){
                //http://112.74.33.242:2010/dataapi/service/mzAPI/V1/showESDataChart?accessToken=${accessToken}&alertId=278&beginTime=1475510400&chartId=1&endTime=1476115199&endDayId=4667&searchType=2&starDayId=4661&sourceTypes=dp
                var get_trendchart_query = {
                    "accessToken": $scope.access_token,
                    "alertId": $scope.alertId,
                    "beginTime": Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                    "chartId": 1,
                    "endTime": Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000,
                    "searchType": 2,
                    "searchTypes":"dm"
                };
                commonUI.showLoadingChart('trend_chart');
                addFilterParams(get_trendchart_query);
                doRequest.doGet(UrlMappings.showESDataChart,get_trendchart_query,function(model){
                    var datas = [];
                    if(model != null && model['WSAnaysisData'] != null && model['WSAnaysisData']['success'] == false){
                        console.log('整体声量趋势图加载失败：' + model['WSAnaysisData']['errorMsg']);
                    }else if(model != null && model['WSAnaysisData'] != null &&
                        model['WSAnaysisData']['success'] == true && model['WSAnaysisData']['datas'] != null){
                        datas = model['WSAnaysisData']['datas'];
                    }
                    var legend = [$.i18n.prop("string_Buzz_Trend")], axis = [], serie_data = [];
                    if(Array.isArray(datas)){
                        for(d in datas){
                            axis.push(datas[d].attr);
                            serie_data.push(datas[d].val);
                        }
                    }else{
                        axis.push(datas.attr);
                        serie_data.push(datas.val);
                    }

                    var series = [
                        {
                            name:$.i18n.prop("string_Buzz_Trend"),
                            type:'line',
                            data:serie_data,
                            showAllSymbol:true,
                            itemStyle: {
                                normal: {
                                    color:"#63B8FF"
                                }
                            }
                        }
                    ];
                    var click_function = function(ev){
                        if($scope.filter_conditions.selectedDate == undefined){
                            $scope.filter_conditions.selectedDate = [];
                            $scope.filter_conditions.selectedDate[0] = ev.name;
                            showFilter();
                            $scope.$apply();
                            commonUI.initTags("tag_selectedDate",function(tagName){
                                if($.inArray(tagName,$scope.filter_conditions.selectedDate) >= 0){
                                    //$scope.filter_conditions.selectedDate.splice($.inArray(tagName,$scope.filter_conditions.selectedDate),1);
                                    //commonUI.removeTag("tag_selectedDate",tagName);
                                    delete $scope.filter_conditions.selectedDate;
                                    if(Object.keys($scope.filter_conditions).length == 0){
                                        $('.condition_filter_container').hide();
                                    }
                                    $scope.$apply();
                                    $scope.reloadPage();
                                }
                            });
                        }else{
                            if($scope.filter_conditions.selectedDate.indexOf(ev.name) < 0){
                                $scope.filter_conditions.selectedDate[0] = ev.name;
                                $scope.$apply();
                                commonUI.importTags('tag_selectedDate',ev.name.toString());
                            }
                        }
                        $scope.initPage();
                    };
                    commonUI.lineChart('trend_chart',legend,axis,series,click_function);
                });
            };
            //每小时分布图
            var initHourlyChart = function(){
                //http://112.74.33.242:2010/dataapi/service/mzAPI/V1/showESDataChart?accessToken=${accessToken}&alertId=278&beginTime=1475510400&chartId=1&endTime=1476115199&endDayId=4667&searchType=2&starDayId=4661&sourceTypes=dp
                var get_hourlychart_query = {
                    "accessToken": $scope.access_token,
                    "alertId": $scope.alertId,
                    "beginTime": Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                    "chartId": 7,
                    "endTime": Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000,
                    "searchType": 2,
                    "searchTypes":"dm"
                };
                commonUI.showLoadingChart('hourly_chart');
                addFilterParams(get_hourlychart_query);
                doRequest.doGet(UrlMappings.showESDataChart,get_hourlychart_query,function(model){
                    var datas = [];
                    if(model != null && model['WSAnaysisData'] != null && model['WSAnaysisData']['success'] == false){
                        console.log('每小时分布图加载失败：' + model['WSAnaysisData']['errorMsg']);
                    }else if(model != null && model['WSAnaysisData'] != null &&
                        model['WSAnaysisData']['success'] == true && model['WSAnaysisData']['datas'] != null){
                        datas = model['WSAnaysisData']['datas'];
                    }
                    var legend = [$.i18n.prop("string_Posting_Time")], axis = [], serie_data = [];
                    for(d in datas){
                        axis.push(datas[d].attr);
                        serie_data.push(datas[d].val);
                    }
                    var series = [
                        {
                            name:$.i18n.prop("string_Posting_Time"),
                            type:'line',
                            data:serie_data,
                            itemStyle: {
                                normal: {
                                    color:"#63B8FF"
                                }
                            }
                        }
                    ];
                    var click_function = function(ev){
                        if($scope.filter_conditions.localHourId == undefined){
                            $scope.filter_conditions.localHourId = [];
                            $scope.filter_conditions.localHourId[0] = ev.name + "";
                            showFilter();
                            $scope.$apply();
                            commonUI.initTags("tag_localHourId",function(tagName){
                                if($.inArray(tagName,$scope.filter_conditions.localHourId) >= 0){
                                    //$scope.filter_conditions.localHourId.splice($.inArray(tagName,$scope.filter_conditions.localHourId),1);
                                    //commonUI.removeTag("tag_localHourId",tagName);
                                    delete $scope.filter_conditions.localHourId;
                                    if(Object.keys($scope.filter_conditions).length == 0){
                                        $('.condition_filter_container').hide();
                                    }
                                    setTimeout(function(){
                                        $scope.$apply();
                                        $scope.reloadPage();
                                    },200);
                                }
                            });
                        }else{
                            if($scope.filter_conditions.localHourId.indexOf(ev.name) < 0){
                                $scope.filter_conditions.localHourId[0] = ev.name;
                                $scope.$apply();
                                commonUI.importTags('tag_localHourId',ev.name.toString());
                            }
                        }
                        $scope.initPage();
                    };
                    commonUI.lineChart('hourly_chart',legend,axis,series,click_function);
                });
            };
            //媒体类型图
            var initMediaChart = function(){
                //http://112.74.33.242:2010/dataapi/service/mzAPI/V1/showESDataChart?accessToken=${accessToken}alertId=278&beginTime=1475510400&chartId=20&endTime=1476115199&endDayId=4667&searchType=2&starDayId=4661&sourceTypes=dp
                var get_mediachart_query =
                    {
                        "accessToken": $scope.access_token,
                        "alertId": $scope.alertId,
                        "chartId": 20,
                        "searchType": 2,
                        "searchTypes":"dm",
                        "beginTime":Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                        "endTime":Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000,
                    };
                commonUI.showLoadingChart('media_chart');
                addFilterParams(get_mediachart_query);
                doRequest.doGet(UrlMappings.showESDataChart,get_mediachart_query,function(model){
                    var datas = [];
                    if(model != null && model['WSAnaysisData'] != null && model['WSAnaysisData']['success'] == false){
                        console.log('媒体类型图加载失败：' + model['WSAnaysisData']['errorMsg']);
                    }else if(model != null && model['WSAnaysisData'] != null &&
                        model['WSAnaysisData']['success'] == true && model['WSAnaysisData']['datas'] != null){
                        datas = model['WSAnaysisData']['datas'];
                    }
                    var legend = [], serie_data = [];
                    if(Array.isArray(datas)){
                        for(d in datas){
                            legend.push(datas[d].attr);
                            serie_data.push({value:datas[d].val, name:datas[d].attr});
                            $scope.medias_dic[datas[d].attr] = datas[d].id;
                        }
                    }else{
                        legend.push(datas.attr);
                        serie_data.push({value:datas.val, name:datas.attr});
                        $scope.medias_dic[datas.attr] = datas.id;
                    }
                    var series = [
                        {
                            name:'媒体类型',
                            type:'pie',
                            radius : ['50%', '70%'],
                            itemStyle : {
                                normal : {
                                    label : {
                                        show : false
                                    },
                                    labelLine : {
                                        show : false
                                    }
                                },
                                emphasis : {
                                    label : {
                                        show : true,
                                        position : 'center',
                                        textStyle : {
                                            fontSize : '30',
                                            fontWeight : 'bold'
                                        }
                                    }
                                }
                            },
                            data:serie_data
                        }
                    ];
                    var click_function = function(ev){
                        var media = ev.name;
                        if($scope.filter_conditions.medias == undefined){
                            $scope.filter_conditions.medias = [];
                            $scope.filter_conditions.medias[0] = media;
                            showFilter();
                            $scope.$apply();
                            commonUI.initTags("tag_medias",function(tagName){
                                if($.inArray(tagName,$scope.filter_conditions.medias) >= 0){
                                    //$scope.filter_conditions.medias.splice($.inArray(tagName,$scope.filter_conditions.medias),1);
                                    //commonUI.removeTag("tag_medias",tagName);
                                    delete $scope.filter_conditions.medias;
                                    if(Object.keys($scope.filter_conditions).length == 0){
                                        $('.condition_filter_container').hide();
                                    }
                                    $scope.$apply();
                                    $scope.reloadPage();
                                }
                            });
                        }else{
                            if($scope.filter_conditions.medias.indexOf(media) < 0){
                                $scope.filter_conditions.medias[0] = media;
                                $scope.$apply();
                                commonUI.importTags('tag_medias',media);
                            }
                        }
                        $scope.initPage();
                    };
                    commonUI.pieChart('media_chart',legend,series,click_function);
                });
            };
            // 地域分布图
            var initMapChart = function () {
                //http://112.74.33.242:2010/dataapi/service/mzAPI/V1/showESDataChart?accessToken=${accessToken}alertId=278&beginTime=1475510400&chartId=20&endTime=1476115199&endDayId=4667&searchType=2&starDayId=4661&sourceTypes=dp
                var get_distributechart_query =
                    {
                        "accessToken": $scope.access_token,
                        "alertId": $scope.alertId,
                        "chartId": 29,
                        "searchType": 2,
                        "searchTypes": "dp",
                        "beginTime":Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                        "endTime":Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000,
                    };
                //commonUI.showLoadingChart('distribute_chart');
                addFilterParams(get_distributechart_query);
                doRequest.doGet(UrlMappings.showESDataChart, get_distributechart_query, function (model) {
                    var datas = [];
                    if (model != null && model['WSAnaysisData'] != null && model['WSAnaysisData']['success'] == false) {
                        console.log('地域分布视图加载失败：' + model['WSAnaysisData']['errorMsg']);
                    } else if (model != null && model['WSAnaysisData'] != null &&
                        model['WSAnaysisData']['success'] == true && model['WSAnaysisData']['datas'] != null) {
                        datas = model['WSAnaysisData']['datas'];

                    }
                    var afterDatas = [];
                    var maxValue = 0;
                    if (Array.isArray(datas)) {
                        datas.forEach(function(item){
                            if(item.val >= maxValue && item.attr!='未知' && item.attr!="海外" && item.attr!="其他") {
                                maxValue = item.val;
                            }
                            afterDatas.push({'name':item.attr,'value':item.val});
                        });
                    }else {
                        if(datas.attr!="未知" && datas.attr!="海外" && datas.attr!="其他") {
                            maxValue = datas.val;
                        }
                        afterDatas.push({'name':datas.attr,'value':datas.val});
                    }

                    var click_function = function(ev){
                        var distributes = ev.name
                        if($scope.filter_conditions.distributes == undefined){
                            $scope.filter_conditions.distributes = [];
                            $scope.filter_conditions.distributes[0] = distributes;
                            showFilter();
                            $scope.$apply();
                            commonUI.initTags("tag_distributes",function(tagName){
                                if($.inArray(tagName,$scope.filter_conditions.distributes) >= 0){
                                    //$scope.filter_conditions.sentiments.splice($.inArray(tagName,$scope.filter_conditions.sentiments),1);
                                    //commonUI.removeTag("tag_sentiments",tagName);
                                    delete $scope.filter_conditions.distributes;
                                    if(Object.keys($scope.filter_conditions).length == 0){
                                        $('.condition_filter_container').hide();
                                    }
                                    //回调里面的监测模型不一定执行，所以需要手动去操作
                                    $scope.$apply();
                                    $scope.reloadPage();
                                }
                            });
                        }else{
                            if($scope.filter_conditions.distributes.indexOf(distributes) < 0){
                                $scope.filter_conditions.distributes[0] = distributes;
                                $scope.$apply();
                                commonUI.importTags('tag_distributes',distributes);
                            }
                        }
                        $scope.initPage();
                    };
                    commonUI.mapChart('distribute_chart',afterDatas,maxValue,click_function);
                });
            };
            // 性别分布图
            var initSexChart = function () {
                //http://112.74.33.242:2010/dataapi/service/mzAPI/V1/showESDataChart?accessToken=${accessToken}alertId=278&beginTime=1475510400&chartId=27&endTime=1476115199&endDayId=4667&searchType=2&starDayId=4661&sourceTypes=dp
                var get_sexchart_query =
                    {
                        "accessToken": $scope.access_token,
                        "alertId": $scope.alertId,
                        "chartId": 27,
                        "searchType": 2,
                        "searchTypes": "dp",
                        "beginTime":Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                        "endTime":Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000,
                    };
                //commonUI.showLoadingChart('sex_chart');
                addFilterParams(get_sexchart_query);
                doRequest.doGet(UrlMappings.showESDataChart, get_sexchart_query, function (model) {
                    var datas = [];
                    if (model != null && model['WSAnaysisData'] != null && model['WSAnaysisData']['success'] == false) {
                        console.log('性别环图加载失败：' + model['WSAnaysisData']['errorMsg']);
                    } else if (model != null && model['WSAnaysisData'] != null &&
                        model['WSAnaysisData']['success'] == true && model['WSAnaysisData']['datas'] != null) {
                        datas = model['WSAnaysisData']['datas'];
                        // commonUI.hideLoadingChart('sex_chart');
                    }
                    var legend = [], serie_data = [];
                    if (Array.isArray(datas)) {
                        for (d in datas) {
                            legend.push(datas[d].attr);
                            serie_data.push({value: datas[d].val, name: datas[d].attr, id: datas[d].id});
                            $scope.sex_dic[datas[d].attr] = datas[d].id;
                        }
                    } else {
                        legend.push(datas.attr);
                        serie_data.push({value: datas.val, name: datas.attr,id: datas.id});
                        $scope.sex_dic[datas.attr] = datas.id;
                    }
                    var series = [
                        {
                            name: '性别',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: true,
                                        position: 'center',
                                        textStyle: {
                                            fontSize: '30',
                                            fontWeight: 'bold'
                                        }
                                    }
                                }
                            },
                            data: serie_data
                        }
                    ];
                    var click_function = function(ev){
                        var sexName = ev.name;
                        if($scope.filter_conditions.sexTypes == undefined){
                            $scope.filter_conditions.sexTypes = [];
                            $scope.filter_conditions.sexTypes[0] = sexName;
                            showFilter();
                            $scope.$apply();
                            commonUI.initTags("tag_sexTypes",function(tagName){
                                if($.inArray(tagName,$scope.filter_conditions.sexTypes) >= 0){
                                    //$scope.filter_conditions.sentiments.splice($.inArray(tagName,$scope.filter_conditions.sentiments),1);
                                    //commonUI.removeTag("tag_sentiments",tagName);
                                    delete $scope.filter_conditions.sexTypes;
                                    if(Object.keys($scope.filter_conditions).length == 0){
                                        $('.condition_filter_container').hide();
                                    }
                                    //回调里面的监测模型不一定执行，所以需要手动去操作
                                    $scope.$apply();
                                    $scope.reloadPage();
                                }
                            });
                        }else{
                            if($scope.filter_conditions.sexTypes.indexOf(sexName) < 0){
                                $scope.filter_conditions.sexTypes[0] = sexName;
                                $scope.$apply();
                                commonUI.importTags('tag_sexTypes',sexName);
                            }
                        }
                        $scope.initPage();
                    };
                    commonUI.pieChart('sex_chart', legend, series,click_function);
                });
            };
            //认证分布图
            var initAuthChart = function () {
                //http://112.74.33.242:2010/dataapi/service/mzAPI/V1/showESDataChart?accessToken=${accessToken}alertId=278&beginTime=1475510400&chartId=28&endTime=1476115199&endDayId=4667&searchType=2&starDayId=4661&sourceTypes=dp
                var get_authchart_query =
                    {
                        "accessToken": $scope.access_token,
                        "alertId": $scope.alertId,
                        "chartId": 28,
                        "searchType": 2,
                        "searchTypes": "dp",
                        "beginTime":Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                        "endTime":Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000,
                    };
                //commonUI.showLoadingChart('auth_chart');
                addFilterParams(get_authchart_query);
                doRequest.doGet(UrlMappings.showESDataChart, get_authchart_query, function (model) {
                    var datas = [];
                    if (model != null && model['WSAnaysisData'] != null && model['WSAnaysisData']['success'] == false) {
                        console.log('认证环图加载失败：' + model['WSAnaysisData']['errorMsg']);
                    } else if (model != null && model['WSAnaysisData'] != null &&
                        model['WSAnaysisData']['success'] == true && model['WSAnaysisData']['datas'] != null) {
                        datas = model['WSAnaysisData']['datas'];
                    }
                    var legend = [], serie_data = [];
                    if (Array.isArray(datas)) {
                        for (d in datas) {
                            legend.push(datas[d].attr);
                            serie_data.push({value: datas[d].val, name: datas[d].attr});
                            $scope.auth_dic[datas[d].attr] = datas[d].id;
                        }
                    } else {
                        legend.push(datas.attr);
                        serie_data.push({value: datas.val, name: datas.attr});
                        $scope.auth_dic[datas.attr] = datas.id;
                    }
                    var series = [
                        {
                            name: '认证',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: true,
                                        position: 'center',
                                        textStyle: {
                                            fontSize: '30',
                                            fontWeight: 'bold'
                                        }
                                    }
                                }
                            },
                            data: serie_data
                        }
                    ];
                    var click_function = function(ev){
                        var authName = ev.name;
                        if($scope.filter_conditions.authTypes == undefined){
                            $scope.filter_conditions.authTypes = [];
                            $scope.filter_conditions.authTypes[0] = authName;
                            showFilter();
                            $scope.$apply();
                            commonUI.initTags("tag_authTypes",function(tagName){
                                console.log('点击地域分布图表后传递的参数数据：',ev);
                                if($.inArray(tagName,$scope.filter_conditions.authTypes) >= 0){
                                    //$scope.filter_conditions.sentiments.splice($.inArray(tagName,$scope.filter_conditions.sentiments),1);
                                    //commonUI.removeTag("tag_sentiments",tagName);
                                    delete $scope.filter_conditions.authTypes;
                                    if(Object.keys($scope.filter_conditions).length == 0){
                                        $('.condition_filter_container').hide();
                                    }
                                    //回调里面的监测模型不一定执行，所以需要手动去操作
                                    $scope.$apply();
                                    $scope.reloadPage();
                                }
                            });
                        }else{
                            if($scope.filter_conditions.authTypes.indexOf(authName) < 0){
                                $scope.filter_conditions.authTypes[0] = authName;
                                $scope.$apply();
                                commonUI.importTags('tag_authTypes',authName);
                            }
                        }
                        $scope.initPage();
                    };
                    commonUI.pieChart('auth_chart', legend, series, click_function);
                });
            };
            //控制已查询条件区域的高度
            var showFilter = function(){
                $('.condition_filter_container').show();
                if(Object.keys($scope.filter_conditions).length <= 2){
                    $('.filter_dashboard').height('125px');
                }else if(Object.keys($scope.filter_conditions).length <= 4){
                    $('.filter_dashboard').height('150px');
                }else if(Object.keys($scope.filter_conditions).length <= 6){
                    $('.filter_dashboard').height('175px');
                }else if(Object.keys($scope.filter_conditions).length <= 8){
                    $('.filter_dashboard').height('200px');
                }
            };
            // 情感饼图
            var initEmotionChart = function(){
                //http://112.74.33.242:2010/dataapi/service/mzAPI/V1/showESDataChart?accessToken=${accessToken}alertId=278&beginTime=1475510400&chartId=20&endTime=1476115199&endDayId=4667&searchType=2&starDayId=4661&sourceTypes=dp
                var get_emotionchart_query =
                    {
                        "accessToken": $scope.access_token,
                        "alertId": $scope.alertId,
                        "chartId": 21,
                        "searchType": 2,
                        "searchTypes":"dm",
                        "beginTime":Date.parse(new Date($scope.startMoment.format('YYYY/MM/DD 00:00:00')))/1000,
                        "endTime":Date.parse(new Date($scope.endMoment.format('YYYY/MM/DD 23:59:59')))/1000,
                    };
                commonUI.showLoadingChart('emotion_chart');
                addFilterParams(get_emotionchart_query);
                doRequest.doGet(UrlMappings.showESDataChart,get_emotionchart_query,function(model){
                    var datas = [];
                    if(model != null && model['WSAnaysisData'] != null && model['WSAnaysisData']['success'] == false){
                        console.log('情感饼图加载失败：' + model['WSAnaysisData']['errorMsg']);
                    }else if(model != null && model['WSAnaysisData'] != null &&
                        model['WSAnaysisData']['success'] == true && model['WSAnaysisData']['datas'] != null){
                        datas = model['WSAnaysisData']['datas'];
                    }
                    var legend = [], serie_data = [];
                    if(Array.isArray(datas)){
                        for(d in datas){
                            legend.push(datas[d].attr);
                            serie_data.push({value:datas[d].val, name:datas[d].attr});
                            $scope.sentiments_dic[datas[d].attr] = datas[d].id;
                        }
                    }else{
                        legend.push(datas.attr);
                        serie_data.push({value:datas.val, name:datas.attr});
                        $scope.sentiments_dic[datas.attr] = datas.id;
                    }
                    var series = [
                        {
                            name:'情感',
                            type:'pie',
                            radius : ['50%', '70%'],
                            itemStyle : {
                                normal : {
                                    label : {
                                        show : false
                                    },
                                    labelLine : {
                                        show : false
                                    }
                                },
                                emphasis : {
                                    label : {
                                        show : true,
                                        position : 'center',
                                        textStyle : {
                                            fontSize : '30',
                                            fontWeight : 'bold'
                                        }
                                    }
                                }
                            },
                            data:serie_data
                        }
                    ];
                    var click_function = function(ev){
                        var sentiment = ev.name;
                        if($scope.filter_conditions.sentiments == undefined){
                            $scope.filter_conditions.sentiments = [];
                            $scope.filter_conditions.sentiments[0] = sentiment;
                            showFilter();
                            $scope.$apply();
                            commonUI.initTags("tag_sentiments",function(tagName){
                                if($.inArray(tagName,$scope.filter_conditions.sentiments) >= 0){
                                    //$scope.filter_conditions.sentiments.splice($.inArray(tagName,$scope.filter_conditions.sentiments),1);
                                    //commonUI.removeTag("tag_sentiments",tagName);
                                    delete $scope.filter_conditions.sentiments;
                                    if(Object.keys($scope.filter_conditions).length == 0){
                                        $('.condition_filter_container').hide();
                                    }
                                    //回调里面的监测模型不一定执行，所以需要手动去操作
                                    $scope.$apply();
                                    $scope.reloadPage();
                                }
                            });
                        }else{
                            if($scope.filter_conditions.sentiments.indexOf(sentiment) < 0){
                                $scope.filter_conditions.sentiments[0] = sentiment;
                                $scope.$apply();
                                commonUI.importTags('tag_sentiments',sentiment);
                            }
                        }
                        $scope.initPage();
                    };
                    commonUI.pieChart('emotion_chart',legend,series,click_function);
                });
            };
        }]);
});
