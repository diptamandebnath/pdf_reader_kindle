const upload = document.getElementById("pdf-upload");
const flipbook = document.getElementById("flipbook");

upload.addEventListener("change", async function(e){

    flipbook.innerHTML = "";

    const file = e.target.files[0];

    if(!file) return;

    const fileReader = new FileReader();

    fileReader.onload = async function(){

        const typedarray = new Uint8Array(this.result);

        const pdf = await pdfjsLib.getDocument(typedarray).promise;

        for(let pageNum = 1; pageNum <= pdf.numPages; pageNum++){

            const page = await pdf.getPage(pageNum);

            const viewport = page.getViewport({scale:1.5});

            const pageDiv = document.createElement("div");
            pageDiv.className = "page";

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            pageDiv.appendChild(canvas);
            flipbook.appendChild(pageDiv);

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
        }

        $("#flipbook").turn({
            width:900,
            height:650,
            autoCenter:true,
            gradients:true,
            acceleration:true
        });
    };

    fileReader.readAsArrayBuffer(file);
});
