import axios from "axios";
import { useRouter } from "vue-router";
import { dateToString, ItemInserted, ItemOwned, ItemToBorrow, BorrowSuggestion } from "./utils";


async function make_request(url: string, data:any) {
  const router = useRouter();
  let response = await axios({
    method:"POST",
    baseURL:"http://127.0.0.1:5000",
    url:url,
    // headers:{"Access-Control-Allow-Origin":"*"},
    data:JSON.stringify({
      ...{
        'WEDORM-uid':window.localStorage.getItem('WEDORM-uid') ?? "ANDY"
      },
      ...data
    }),
    transformRequest: [function (data:any, _) {
      // Do whatever you want to transform the data
      console.log('request',data)
      return data;
    }],
    transformResponse: [function (data:any) {
      // Do whatever you want to transform the data
      console.log('response',JSON.parse(data))
      return JSON.parse(data);
    }],
  }).then((res)=>{
    // window.alert('success')
    console.log('response success')
    return (res.data)
  },(error)=>{
    console.log('make request error',error)
    if(error.response){
      console.log('response error',error.response)
      // window.alert(error.response)
      if(error.response.status === 401){
        console.error('login',error)
        window.alert('auth error '+error.response)
        window.localStorage.removeItem('WEDORM-uid')
      router.push('/')
      }
    }
    else if (error.request){
      console.log('request error',error.request)
      // window.alert(error.request)
    }
  })
  console.log(response)
  return response;
}


export async function insertItem(item: ItemInserted) {
  /* 
    return json.dumps({'code': 500, 'msg': "添加物品失败"})
    return json.dumps({'code': 500, 'msg': "添加拥有关系失败"})
    return json.dumps({'code': 200, 'msg': "添加成功，已有标签"})
    return json.dumps({'code': 500, 'msg': "新建标签失败"})
    return json.dumps({'code': 200, 'msg': "添加成功，新增标签"})
    */

  await  make_request("/api/insert-item", { item:JSON.stringify(item) }).then(
    (res)=>{window.alert(res );},
    (res)=>{window.alert(res );}
  );
  window.location.reload()
}

export async function virtueQuery() {
  /* 
    return json.dumps({'code': 200, 'virtue': result[1]})

*/
  let response = 0;
  await make_request("/api/virtue-query", {}).then((res)=>{response = res});
  return response
}
export async function virlogQuery() {
  /* 
    return json.dumps({'code': 200, 'virtue log': result}) */
  let response =[] as string[];
  await make_request("/api/virlog", {}).then((res)=>{response = res});
  return response
}
export async function itemsQuery(){
  /* 
    return json.dumps({'code': 200, 'My item': my_item, 'is borrowing': borrowing_item})
    */
    let response =[] as ItemOwned[];
    
  await make_request("/api/items", {}).then((res)=>{
    console.log('itemsQuery response',res)
    response = JSON.parse(res)});
    return response
  }
  export async function borrowListQuery() {
    
    let response =[] as ItemToBorrow[];
    await make_request("/api/borrow-list", {}).then((res)=>{
    console.log('borrowListQuery response',res)
    response = res
  
  });
  return response
}
export async function updateItem(item: ItemOwned) {
  /*     return {"code":200}
   */
  let response = false
  await  make_request("/api/update-item", item).then((res)=>{window.alert(res );response=true;});
  window.location.reload()
}
export async function searchItem(nm: string) {

  let response:any[] = [];
  await make_request("/api/search-item", { name: nm }).then((res)=>{response = res})
  return response
  
}
export async function borrowItem(item_id: number, deadline: Date) {
  /* return {"code":200} */
  
  let response = false
  await  make_request("/api/borrow-item", {
    iid: item_id,
    // modi:dateToString(modified),
    ddl: dateToString(deadline),
  }).then((res)=>{window.alert(res );response=true;});
  window.location.reload()
}
export async function returnItem(share_id: number, item_id: number) {
  /* 
    return json.dumps({'code': 200, 'msg': "自己借自己的东西并且成功归还"})
    return json.dumps({'code': 200, 'msg': "成功按时归还"})
    return json.dumps({'code': 200, 'msg': "借用超时，成功归还"})
    */
  let response = false
  await  make_request("/api/return-item", {
    sid: share_id,
    iid: item_id,
  }).then((res)=>{window.alert(res );response=true;});
  window.location.reload()

}
export async function deleteItem(item_id: number) {
  /* 
    return json.dumps({'code': 500, 'msg': "非物品拥有者，删除失败"})
    return json.dumps({'code': 500, 'msg': "物品正在借出，无法删除"})
    return json.dumps({'code': 200, 'msg': "物品已删除"})
    */
  let response = false
  await make_request("/api/delete-item", { iid: item_id }).then(
    (res)=>{window.alert(res);response=true;},
    (res)=>{window.alert(res);}
  )
  window.location.reload()

  // TODO: in caller, deleteItem().then(load data)
}
export async function deleteUser() {
  make_request("/api/delete-user", {});
  window.localStorage.removeItem('WEDORM-uid')
}

export async function loginFunc(name:string){
  let response=  '';
  // window.alert(name)
  await make_request("/login",{username:name}).then((res)=>{response = res;})
  console.log(response)
  if (response !== '')
  {
    console.log('login:',response)
    window.localStorage.setItem('WEDORM-uid' ,response)
    // window.alert('pause success')
  }
  else 
  {
    console.log('empty response')
    // window.alert('pause')
  }
  // const router = useRouter() 
  // router.push('/')
}