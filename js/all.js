  // API 來源
      // https://opendata.epa.gov.tw/Data/Contents/AQI/
      Vue.component('city',{
        props:['cityData'],
        template:'#cityShow',
        computed:{
          statusColor: function(){
            let status = this.cityData.Status;
            switch(status){
              case '良好' :
                return;
                break;
              case '普通' :
                return 'status-aqi2';
                break;
              case '對敏感族群不健康' :
                return 'status-aqi3';
                break;
              case '對所有族群不健康' :
                return 'status-aqi4';
                break;
              case '非常不健康' :
                return 'status-aqi5';
                break;
              case '危害' :
                return 'status-aqi6';
                break;
            }
          }
        },
        // computed:{
        //   statusColor:function(){
        //     let status = this.cityData.Status;
        //     if(status === '良好'){
        //       return;
        //     }else if(status === '普通'){
        //       return 'status-aqi2';
        //     }else if(status === '對敏感族群不健康'){
        //       return 'status-aqi3';
        //     }else if(status === '對所有族群不健康'){
        //       return 'status-aqi4';
        //     }else if(status === '非常不健康'){
        //       return 'status-aqi5';
        //     }else if(status === '危害'){
        //       return 'status-aqi6';
        //     }
        //   }
        // },
        methods:{
          addFollow: function(){
            this.$emit('following',this.cityData);
          }
        }
      })
      
      var app = new Vue({
        el: '#app',
        data: {
          data: [],
          location: [],
          stared: [],
          filter: 'default',
          localStorageData: [],
        },
        created: function() {
            const vm = this;
            const cors = 'https://cors-anywhere.herokuapp.com/';
            const api = 'http://opendata2.epa.gov.tw/AQI.json';
      
            
            $.get(cors + api).then(function( response ) {
              vm.data = response;
              // console.log(vm.data);
              let locationData = vm.data.map(function(item){
                return item.County
              });
              //利用indexOf找出陣列中出現該物件的第一個索引值的特性來做篩選
              vm.location = locationData.filter(function(item,index,array){
                return array.indexOf(item) === index
              });
              //創造階段時先對localStorage做一次瀏覽，從中篩選出與data裡符合一致的資料，並渲染到關注城市上
              let localStorageData = JSON.parse(localStorage.getItem('AQIstar'));
              localStorageData.forEach(function(item){
                vm.data.forEach(function(el){
                  if(item.SiteName === el.SiteName){
                    el.follow = true;
                    vm.stared.push(el);
                  }
                })
              })
            
            });
        },
        methods: {
          followingFilter: function(item){
            let vm = this;
            let starIndex = vm.stared.indexOf(item);  //若是不存在陣列裡的值 indexOf顯示出的索引值為-1
            if(starIndex >=0){
              item.follow = false;
              vm.stared.splice(starIndex,1);
            }else{
              item.follow = true;
              vm.stared.push(item);
            }
            localStorage.setItem('AQIstar',JSON.stringify(vm.stared)); //透過點擊星星觸發事件後，將透過if else篩選出的資料存進localStorage
          }
           
          },
          computed:{
            fliterCounty: function(){
              let vm = this;
              if(vm.filter === "default"){
                return vm.data;
              }else{
                return vm.data.filter(function(item){
                  return vm.filter === item.County;
                })
              }
            }
          },
      });