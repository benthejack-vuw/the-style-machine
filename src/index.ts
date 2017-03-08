//testing promises
var promise15 = new Promise(function(resolve,reject){
  resolve("HELLO PROMISE");
})

//testing async/await
let testES_7 = async() =>{
  let result = await promise15;
  console.log(result);
}


console.log("started");
testES_7();
