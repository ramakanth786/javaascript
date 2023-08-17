
const loadingD=[{"name":"Crusty Garlic Focacci with Melted Chees","price":"105.00" ,"category":"Pizza" },{"name":"French Fries",   "price":"105.00", "category":"Snacks" },{"name":"Home Country Fries with Herbs & Chilli Flakes ","price":"105.00" ,"category":"Home Fries" },{ "name":"French Fries with Cheese & Jalapenos ","price":"135.00","category":"Snacks"}, {"name":"Chiken Biryani",  "price":"200.00","category":"Rice and Biryani"}, {"name":"Mutton Biryani",  "price":"250.00","category":"Rice and Biryani"},{ "name":"Egg Noodels","price":"60.00","category":"fast food"},{"name":"Veg Noodels","price":"50.00","category":"fast food"},{"name":"Apricot Delight","price":"110.00","category":"deserts"},{"name":"Tiramisu","price":"120.00","category":"deserts"},{"name":"Almond and date cake","price":"80.00","category":"deserts"},{"name":"Panner Majestic","price":"279.00","category":"starter"},{"name":"veg Spring Roll","price":"269.00","category":"starter"},{"name":"Chicken 65","price":"349.00","category":"starter"},{"name":"Apollo Fish","price":"399.00","category":"starter"},{"name":"Butter Naan","price":"45.00","category":"Breads"},{"name":"Pulka","price":"40.00","category":"Breads"}];
const menuItems=document.querySelector('.menu-items');

var dragged;
const ulList=document.createElement('ul');
var db={};

menuItems.append(ulList);
const url='data.json';

loaddata(loadingD);
function loaddata(loading){
    // var mydata = JSON.parse(loading);
    addToPage(loadingD)
    //fetch(url).then(rep=>rep.json()).then( (data) => addToPage(data));
}

function addToPage(arr){
    arr.forEach(element => {
        const list=document.createElement('li');
        const divName=document.createElement('div');
        divName.textContent=element.name;
        divName.classList.add('menucard-name');
        const divPrice=document.createElement('div');
        divPrice.textContent=element.price;
        divPrice.classList.add('menucard-price');
        const divCategory=document.createElement('div');
        divCategory.textContent=element.category;
        divCategory.classList.add('menucard-category');
        
       
        list.append(divName);
        list.append(divPrice);
        list.append(divCategory);
        list.classList.add('menucard');
        list.setAttribute('draggable','true');
        list.setAttribute('cursor','pointer');
        list.addEventListener('dragstart',(event)=>{
            dragged=event.target;
            list.classList+=' addborder'; 
        });
        list.addEventListener('dragend',(event)=>{
            list.classList='menucard';
        });
        ulList.append(list);
    });
}


const serachMenu=document.querySelector('#searchmenu');

serachMenu.onkeyup=()=>{
    const key=serachMenu.value.toLowerCase();
    document.querySelectorAll(".menucard").forEach(element=>{
         if(element.querySelector(".menucard-category").innerHTML.toLowerCase()!=""&&(element.querySelector(".menucard-name").innerHTML.toLowerCase().indexOf(key)>-1
        || element.querySelector(".menucard-category").innerHTML.toLowerCase().indexOf(key)>-1)){
            element.style.display="";
        }else{
            element.style.display="none";
        }
    });
   
};

const serachTable=document.querySelector('#searchtable');
serachTable.onkeyup=()=>{
   const key=serachTable.value.toLowerCase();
   document.querySelectorAll('.table-name')
   .forEach(element=>{
        if(element.innerHTML.toLowerCase().indexOf(key)>-1){
            element.parentNode.style.display="";
        }else{
            element.parentNode.style.display="none";
        }
})};

const tables=document.querySelectorAll('.card');
tables.forEach(element => {
    let tab=element.querySelector('.table-name').innerHTML.toString();
    element.onclick=()=>{
        
        document.querySelector('.overlay').classList.remove('hidden');
        document.querySelector('#table-id').textContent=tab;
        document.querySelector('#bill-genrate').onclick=()=>{
            delete db[tab];
            close();
            updateItems(element,tab);
            updatePrice(element,tab);
        };
        setData(tab,element);
    };
  
    element.addEventListener('dragover',(event)=>{    
       event.preventDefault();
    });

    element.addEventListener('dragenter',(event)=>{
        event.preventDefault();
        element.classList += " changebg";
    });

    element.addEventListener('dragleave',(event)=>{
        event.preventDefault();
        element.classList.remove('changebg');
    });
    
    element.addEventListener("drop", (event)=> {
        event.preventDefault();

        let name=dragged.querySelector('.menucard-name').innerHTML.toString();
        let price=dragged.querySelector('.menucard-price').innerHTML.toString();
        let itemCount=1;
        if(db[tab]){
            db[tab].forEach((e)=>{
                if(name==e['name']){
                    e['items']+=1;
                    itemCount=e["items"];
                }
            });
        }
        if(itemCount<=1){
            let dict={"name":name,"price":price,"items":1};
            var list=db[tab]||[];
            list.push(dict);
            db[tab]=list;
        }
        updateItems(element,tab);
        updatePrice(element,tab);
        element.classList.remove('changebg');
    });
});
function updateItems(element,table){
    var items=0;
    if(db[table]){
        db[table].forEach(e=>{
            items+=e['items'];
        });
    }
    element.querySelector('.item').textContent=items;
}
function updatePrice(element,table){
    let price=0;
    if(db[table]){
        price=getPrice(table);
    }
    element.querySelector('.rupee').textContent=price+".00";
}
function getPrice(table){
    let price=0;
    db[table].forEach(e=>{
        price+=parseInt(e['price'])*e['items'];
    });
    return price;
}
document.querySelector('#close').onclick=close;
function close(){
    document.querySelector('.overlay').classList+=' hidden';
    document.querySelectorAll('.table-content').forEach(e=>e.remove());
};

function setData(table,e){
    let i=0;
    if(db[table]){
        db[table].forEach((element)=>{
            const tr=document.createElement('tr');
            const tdSno=document.createElement('td');
            const tdName=document.createElement('td');
            const tdPrice=document.createElement('td');
            const tdItems=document.createElement('td');
            const tdDelete=document.createElement('td');
            i++;
            tdSno.textContent=i+'.';
            tdName.textContent=element['name'];
            tdPrice.textContent=(parseInt(element['price'])*element['items'])+".00";
            
            tdItems.append(getCounter(e,tdPrice,table,element,element['items']));
            tdDelete.append(getDelImg(e,table,db[table].indexOf(element)));
            tr.append(tdSno);
            tr.append(tdName);
            tr.append(tdPrice);
            tr.append(tdItems);
            tr.append(tdDelete);
            
            
            tr.setAttribute('class','table-content');
            document.querySelector('table').append(tr);
        });

        const tr=document.createElement('tr');
        const tdSno=document.createElement('td');
        const tdName=document.createElement('td');
        const tdPrice=document.createElement('td');
        const tdItems=document.createElement('td');
        const tdDelete=document.createElement('td');
        tdSno.textContent=null;
        tdName.textContent=null;
        tdPrice.textContent="Total : "+getPrice(table)+".00";
        tdPrice.setAttribute('id','total-price');
        tdItems.textContent=null;
        tdDelete.textContent=null;
        tr.append(tdSno);
        tr.append(tdName);
        tr.append(tdPrice);
        tr.append(tdItems);
        tr.append(tdDelete);
        tr.setAttribute('class','table-content');
        document.querySelector('table').append(tr);
    }
    
}

function getDelImg(e,table,index){
    const img=document.createElement('img');
    img.setAttribute('src','delete.png');
    img.setAttribute('class','img-delete');
    img.setAttribute('alt','delete');
    img.addEventListener('mouseover',()=>{
        img.setAttribute('src','reddelete.png');
    });
    img.addEventListener('mouseleave',()=>{
        img.setAttribute('src','delete.png');
    });
    img.onclick=()=>{   
        delete db[table].splice(index,1);
        document.querySelectorAll('.table-content').forEach(e=>e.remove());
        setData(table,e);
        updateItems(e,table);
        updatePrice(e,table);
    };
    return img;     
}

document.querySelector('#bill-genrate').addEventListener('mouseover',()=>{
    document.querySelector('#bill-genrate').style.color='red';
});

document.querySelector('#bill-genrate').addEventListener('mouseleave',()=>{
    document.querySelector('#bill-genrate').style.color='';
});

document.querySelector('#bill-genrate').addEventListener('click',()=>{
    alert(`Please pay ${document.querySelector('#total-price').textContent.split(":")[1]}`);
    close();
});

function getCounter(card,tdPrice,table,list,items){
    const div=document.createElement('div');
    const add=document.createElement('button');
    const sub=document.createElement('button');
    const itemtext=document.createElement('p');
    itemtext.textContent=items;
    add.textContent='+';
    sub.textContent='-';
    add.setAttribute('class','count-btn');
    sub.setAttribute('class','count-btn');
    div.append(sub);
    div.append(itemtext);
    div.append(add);
    div.setAttribute('class','counter');
    add.onclick=()=>{
        if(items+1<11){
            items++;
            updateCounter(card,table,items,itemtext,list,tdPrice);
        }
    };
    sub.onclick=()=>{
        if(items-1>0){
            items--;
            updateCounter(card,table,items,itemtext,list,tdPrice);
        }
    };
    return div;
}

function updateCounter(card,table,items,itemtext,list,tdPrice){
    itemtext.textContent=items;
    list['items']=items;
    tdPrice.textContent=(parseInt(list['price'])*list['items'])+".00";
    document.querySelector('#total-price').textContent="Total : "+getPrice(table)+".00";
    updateItems(card,table);
    updatePrice(card,table);
}
