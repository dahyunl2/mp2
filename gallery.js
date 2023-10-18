
let globaldf=[];
let imgsrc=[];
let idx=0;

async function generateList(fullname, name){
    document.getElementById('loader').style.display="block"
    globaldf=[];
    imgsrc=[];
    idx=0;
    const elements = document.getElementsByClassName("itembox");
    while (elements.length > 0) elements[0].remove();

    // let link='https://api.artic.edu/api/v1/artworks/search?sort=_score&limit=100&fields=id,title,date_display,artist_display,image_id,iiif_url,place_of_origin,description,artwork_type_title&artwork_type_title='+type;
    let link='https://api.artic.edu/api/v1/artworks/search?sort=_score&limit=100&fields=id,title,date_display,artist_display,image_id,iiif_url,place_of_origin,description,artwork_type_title&q='+name;

    console.log(link)
    
    let res= await fetch(link)
    .then(response => response.json())
    let total_pages=res.pagination.total_pages;
    console.log(total_pages);
    let df=res.data;
    if (total_pages>10){
        total_pages=10
    }
    for (let i=2; i<=total_pages; i++){
        new_link=link+"&page="+i.toString();
        // console.log(new_link)
        let newres= await fetch(new_link)
        .then(response => response.json())
        df=df.concat(newres.data);
        // console.log(df);
    }
    // console.log(df);
  
    // if (length(df)==0){
    //     alert("There are no artworks related to this, please search again.");
    // }
    let x='';
    const listContainer = document.getElementById("list"); 
    let iiif=res.config.iiif_url
    for (let i = 0; i < df.length; i++) {
        // console.log(i)
        let boxData = df[i];
        if(boxData.artist_display.includes(fullname)){
            globaldf.push(boxData);
            let image_id=boxData.image_id;
            let image_src=iiif+"/"+image_id+"/full/400,/0/default.jpg";
            imgsrc.push(image_src);
            x=x+ "<img src='"+image_src+"' class=image onclick=detail("+i.toString()+")></img>";
        }
    }
        div="<div class=line>"+x+"</div>"
        document.getElementById("list").innerHTML = div;
    
        document.getElementById('loader').style.display="none"
}

function detail(index){
    console.log("clicked")
    idx=parseInt(index);
    data=globaldf[idx];
    img_src=imgsrc[idx];
    let x ="<div id=imgmodal><img src='"+img_src+"' class=image_detail></img><div>"+"<div id=modalcontent><p>ID: "+data.id+"</p> <p> Score: "+data._score+"</p> <p>Title: "+data.title+"</p> <p>Artist: "+data.artist_display+"</p>"+"</p>Date: "+data.date_display+"</p>Artwork Type: "+data.artwork_type_title+"</p>Place of Origin: "+data.place_of_origin+"</p>Description: "+data.description+"</div>";
    document.getElementById("detail").innerHTML = x;
    modalopen();
}

function next(){
    if(idx<globaldf.length-1){
        idx=idx+1;
        detail(idx);
    }
    else{
        alert("No more artwork!");
    }
}
function prev(){
    if(idx>0){
        idx=idx-1;
        detail(idx);
    }
    else{
        alert("No more artwork!");
    }
}
function modalopen(){
    console.log("open")
    document.getElementById('modal').style.display="block"
}
function closemodal(){
    console.log("close")
    document.getElementById('modal').style.display="none"
}

// detail("+df[i]+",'"+image_src+"')