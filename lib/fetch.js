import http from './http'

function ajax (url,data,callback){
  my.request({
    url: http.roots + url,
    method: 'POST',
    header: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    data: data,
    dataType: 'json',
    // success:(res) => {
    //   console.log(res)
      
    // },
    fail:(res) => {
      
    },
    complete: (res) => {
      if(res && res.status == 200){
        callback(res.data)
      }else{
        callback(null)
      }
    }
  });
}

export default ajax