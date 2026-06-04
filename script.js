const upload = document.getElementById("pdf-upload");

let pageFlip = null;

upload.addEventListener("change", async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib
        .getDocument({ data: arrayBuffer })
        .promise;

    const pages = [];

    document.getElementById("flipbook").innerHTML = "";

    for (let i = 1; i <= pdf.numPages; i++) {

        const page = await pdf.getPage(i);

        const viewport = page.getViewport({
            scale: 2
        });

        const canvas = document.createElement("canvas");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: canvas.getContext("2d"),
            viewport
        }).promise;

        const img = document.createElement("img");
        img.src = canvas.toDataURL("image/jpeg");

        const pageDiv = document.createElement("div");
        pageDiv.className = "page";
        pageDiv.appendChild(img);

        pages.push(pageDiv);
    }

    pageFlip = new St.PageFlip(
        document.getElementById("flipbook"),
        {
            width: 450,
            height: 650,

            size: "stretch",

            minWidth: 315,
            maxWidth: 1000,

            minHeight: 420,
            maxHeight: 1350,

            showCover: true,

            mobileScrollSupport: false,

            usePortrait: true,

            maxShadowOpacity: 0.5,

            flippingTime: 800
        }
    );

    pageFlip.loadFromHTML(pages);
});

document
    .getElementById("nextBtn")
    .addEventListener("click", () => {

        if(pageFlip){
            pageFlip.flipNext();
        }
    });

document
    .getElementById("prevBtn")
    .addEventListener("click", () => {

        if(pageFlip){
            pageFlip.flipPrev();
        }
    });
